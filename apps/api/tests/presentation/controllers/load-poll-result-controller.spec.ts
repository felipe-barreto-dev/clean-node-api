import { forbidden, serverError, ok } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'
import { mockPollResultModel, throwError } from '@/domain/test'
import { type CheckPollById, type LoadPollResult } from '@/domain/usecases'
import { LoadPollResultController } from '@/presentation/controllers'

const mockRequest = (): LoadPollResultController.Request => ({
  accountId: faker.database.mongodbObjectId(),
  pollId: faker.database.mongodbObjectId()
})

type SutTypes = {
  sut: LoadPollResultController
  checkPollByIdStub: CheckPollById
  loadPollResultStub: LoadPollResult
}

const makeCheckPollById = (): CheckPollById => {
  class CheckPollByIdStub implements CheckPollById {
    async checkById (): Promise<boolean> {
      return true
    }
  }
  return new CheckPollByIdStub()
}

const makeLoadPollResult = (): LoadPollResult => {
  class LoadPollResultStub implements LoadPollResult {
    async load (pollId: string, accountId: string): Promise<LoadPollResult.Result> {
      return mockPollResultModel()
    }
  }
  return new LoadPollResultStub()
}

const makeSut = (): SutTypes => {
  const checkPollByIdStub = makeCheckPollById()
  const loadPollResultStub = makeLoadPollResult()
  const sut = new LoadPollResultController(checkPollByIdStub, loadPollResultStub)
  return {
    sut,
    checkPollByIdStub,
    loadPollResultStub
  }
}

describe('LoadPollResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call CheckPollById with correct value', async () => {
    const { sut, checkPollByIdStub } = makeSut()
    const checkByIdSpy = jest.spyOn(checkPollByIdStub, 'checkById')
    const request = mockRequest()
    await sut.handle(request)
    expect(checkByIdSpy).toHaveBeenCalledWith(request.pollId)
  })

  test('Should return 403 if CheckPollById returns false', async () => {
    const { sut, checkPollByIdStub } = makeSut()
    jest.spyOn(checkPollByIdStub, 'checkById').mockReturnValueOnce(Promise.resolve(false))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('pollId')))
  })

  test('Should return 500 if CheckPollById throws', async () => {
    const { sut, checkPollByIdStub } = makeSut()
    jest.spyOn(checkPollByIdStub, 'checkById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call LoadPollResult with correct values', async () => {
    const { sut, loadPollResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadPollResultStub, 'load')
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.pollId, request.accountId)
  })

  test('Should return 500 if LoadPollResult throws', async () => {
    const { sut, loadPollResultStub } = makeSut()
    jest.spyOn(loadPollResultStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut, loadPollResultStub } = makeSut()
    const mockedResult = mockPollResultModel()
    jest.spyOn(loadPollResultStub, 'load').mockReturnValueOnce(Promise.resolve(mockedResult))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockedResult))
  })
})
