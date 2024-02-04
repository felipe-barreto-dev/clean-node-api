import { forbidden, serverError, ok } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'

import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { type HttpRequest } from '../add-survey/add-survey-protocols'
import { mockSurveyResultModel, throwError } from '@/domain/test'
import { type CheckSurveyById, type LoadSurveyResult } from '@/domain/usecases'

const mockRequest = (): HttpRequest => ({
  body: {
    accountId: faker.database.mongodbObjectId()
  },
  params: {
    surveyId: faker.database.mongodbObjectId()
  }
})

type SutTypes = {
  sut: LoadSurveyResultController
  checkSurveyByIdStub: CheckSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeCheckSurveyById = (): CheckSurveyById => {
  class CheckSurveyByIdStub implements CheckSurveyById {
    async checkById (): Promise<boolean> {
      return true
    }
  }
  return new CheckSurveyByIdStub()
}

const makeLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
      return mockSurveyResultModel()
    }
  }
  return new LoadSurveyResultStub()
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdStub = makeCheckSurveyById()
  const loadSurveyResultStub = makeLoadSurveyResult()
  const sut = new LoadSurveyResultController(checkSurveyByIdStub, loadSurveyResultStub)
  return {
    sut,
    checkSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call CheckSurveyById with correct value', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    const checkByIdSpy = jest.spyOn(checkSurveyByIdStub, 'checkById')
    const request = mockRequest()
    await sut.handle(request)
    expect(checkByIdSpy).toHaveBeenCalledWith(request.params.surveyId)
  })

  test('Should return 403 if CheckSurveyById returns false', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    jest.spyOn(checkSurveyByIdStub, 'checkById').mockReturnValueOnce(Promise.resolve(false))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if CheckSurveyById throws', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    jest.spyOn(checkSurveyByIdStub, 'checkById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.params.surveyId, request.body.accountId)
  })

  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const mockedResult = mockSurveyResultModel()
    jest.spyOn(loadSurveyResultStub, 'load').mockReturnValueOnce(Promise.resolve(mockedResult))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockedResult))
  })
})
