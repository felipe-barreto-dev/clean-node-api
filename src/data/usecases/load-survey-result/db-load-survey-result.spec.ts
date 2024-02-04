import { mockSurveyModel, mockSurveyResultModel, throwError } from '@/domain/test'
import { faker } from '@faker-js/faker'

import MockDate from 'mockdate'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { mockLoadSurveyResultRepository } from '@/data/test'
import { type LoadSurveyResultRepository } from '@/data/protocols/db/survey-result'
import { mockLoadSurveyByIdRepository } from '@/data/test/mock-db-survey'
import { type LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  }
}

let surveyId: string
let accountId: string

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    surveyId = faker.database.mongodbObjectId()
    accountId = faker.database.mongodbObjectId()
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load(surveyId, accountId)
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyId, accountId)
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.load(surveyId, accountId)
    await expect(promise).rejects.toThrow()
  })

  test('Should call CheckSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.load(surveyId, accountId)
    expect(loadByIdSpy).toHaveBeenCalledWith(surveyId)
  })

  test('Should return surveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    const mockedResult = mockSurveyModel()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve(mockedResult))
    const surveyResult = await sut.load(surveyId, accountId)
    expect(surveyResult).toEqual({
      surveyId: mockedResult.id,
      question: mockedResult.question,
      date: mockedResult.date,
      answers: mockedResult.answers.map(answer => ({
        ...answer,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }))
    })
  })

  test('Should return surveyResultModel on success', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const mockedResult = mockSurveyResultModel()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(mockedResult))
    const surveyResult = await sut.load(surveyId, accountId)
    expect(surveyResult).toEqual(mockedResult)
  })
})
