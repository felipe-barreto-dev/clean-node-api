import { faker } from '@faker-js/faker'
import { DbLoadAnswersBySurvey } from './db-load-answers-by-survey'
import { type LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey'
import { mockLoadAnswersBySurveyRepository, mockLoadAnswersBySurveyResult } from '@/data/test/mock-db-survey'
import { throwError } from '@/domain/test'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositoryStub: LoadAnswersBySurveyRepository
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositoryStub = mockLoadAnswersBySurveyRepository()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositoryStub)
  return {
    sut,
    loadAnswersBySurveyRepositoryStub
  }
}

let surveyId: string

describe('DbLoadAnswersBySurvey', () => {
  beforeEach(() => {
    surveyId = faker.database.mongodbObjectId()
  })

  test('Should call LoadAnswersBySurveyRepository', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    const loadAnswersSpy = jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers')
    await sut.loadAnswers(surveyId)
    expect(loadAnswersSpy).toHaveBeenCalledWith(surveyId)
  })

  test('Should return answers on success', async () => {
    const { sut } = makeSut()
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([
      mockLoadAnswersBySurveyResult[0],
      mockLoadAnswersBySurveyResult[1]
    ])
  })

  test('Should return empty array if LoadAnswersBySurveyRepository returns []', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers').mockReturnValueOnce(new Promise(resolve => { resolve([]) }))
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([])
  })

  test('Should throw if LoadAnswersBySurveyRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers').mockImplementationOnce(throwError)
    const promise = sut.loadAnswers(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
