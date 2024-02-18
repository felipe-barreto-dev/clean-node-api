import { mockPollModel, mockPollResultModel, throwError } from '@/domain/test'
import { faker } from '@faker-js/faker'

import MockDate from 'mockdate'
import { DbLoadPollResult } from '@/data/usecases'
import { LoadPollResultRepositorySpy } from '@/data/test'
import { LoadPollByIdRepositorySpy } from '@/data/test/mock-db-poll'

type SutTypes = {
  sut: DbLoadPollResult
  loadPollResultRepositorySpy: LoadPollResultRepositorySpy
  loadPollByIdRepositorySpy: LoadPollByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadPollResultRepositorySpy = new LoadPollResultRepositorySpy()
  const loadPollByIdRepositorySpy = new LoadPollByIdRepositorySpy()
  const sut = new DbLoadPollResult(loadPollResultRepositorySpy, loadPollByIdRepositorySpy)
  return {
    sut,
    loadPollResultRepositorySpy,
    loadPollByIdRepositorySpy
  }
}

let pollId: string
let accountId: string

describe('DbLoadPollResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    pollId = faker.database.mongodbObjectId()
    accountId = faker.database.mongodbObjectId()
  })

  test('Should call LoadPollResultRepository with correct values', async () => {
    const { sut, loadPollResultRepositorySpy } = makeSut()
    const loadByPollIdSpy = jest.spyOn(loadPollResultRepositorySpy, 'loadByPollId')
    await sut.load(pollId, accountId)
    expect(loadByPollIdSpy).toHaveBeenCalledWith(pollId, accountId)
  })

  test('Should throw if LoadPollResultRepository throws', async () => {
    const { sut, loadPollResultRepositorySpy } = makeSut()
    jest.spyOn(loadPollResultRepositorySpy, 'loadByPollId').mockImplementationOnce(throwError)
    const promise = sut.load(pollId, accountId)
    await expect(promise).rejects.toThrow()
  })

  test('Should call CheckPollByIdRepository if LoadPollResultRepository returns null', async () => {
    const { sut, loadPollResultRepositorySpy, loadPollByIdRepositorySpy } = makeSut()
    jest.spyOn(loadPollResultRepositorySpy, 'loadByPollId').mockReturnValueOnce(Promise.resolve(null))
    const loadByIdSpy = jest.spyOn(loadPollByIdRepositorySpy, 'loadById')
    await sut.load(pollId, accountId)
    expect(loadByIdSpy).toHaveBeenCalledWith(pollId)
  })

  test('Should return pollResultModel with all answers with count 0 if LoadPollResultRepository returns null', async () => {
    const { sut, loadPollResultRepositorySpy, loadPollByIdRepositorySpy } = makeSut()
    jest.spyOn(loadPollResultRepositorySpy, 'loadByPollId').mockReturnValueOnce(Promise.resolve(null))
    const mockedResult = mockPollModel()
    jest.spyOn(loadPollByIdRepositorySpy, 'loadById').mockReturnValueOnce(Promise.resolve(mockedResult))
    const pollResult = await sut.load(pollId, accountId)
    expect(pollResult).toEqual({
      pollId: mockedResult.id,
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

  test('Should return pollResultModel on success', async () => {
    const { sut, loadPollResultRepositorySpy } = makeSut()
    const mockedResult = mockPollResultModel()
    jest.spyOn(loadPollResultRepositorySpy, 'loadByPollId').mockReturnValueOnce(Promise.resolve(mockedResult))
    const pollResult = await sut.load(pollId, accountId)
    expect(pollResult).toEqual(mockedResult)
  })
})
