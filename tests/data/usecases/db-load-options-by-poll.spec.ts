import { faker } from '@faker-js/faker'
import { DbLoadOptionsByPoll } from '@/data/usecases'
import { LoadOptionsByPollRepositorySpy, mockLoadOptionsByPollResult } from '@/data/test/mock-db-poll'
import { throwError } from '@/domain/test'

type SutTypes = {
  sut: DbLoadOptionsByPoll
  loadOptionsByPollRepositorySpy: LoadOptionsByPollRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadOptionsByPollRepositorySpy = new LoadOptionsByPollRepositorySpy()
  const sut = new DbLoadOptionsByPoll(loadOptionsByPollRepositorySpy)
  return {
    sut,
    loadOptionsByPollRepositorySpy
  }
}

let pollId: string

describe('DbLoadOptionsByPoll', () => {
  beforeEach(() => {
    pollId = faker.database.mongodbObjectId()
  })

  test('Should call LoadOptionsByPollRepository', async () => {
    const { sut, loadOptionsByPollRepositorySpy } = makeSut()
    await sut.loadOptions(pollId)
    expect(loadOptionsByPollRepositorySpy.pollId).toBe(pollId)
  })

  test('Should return options on success', async () => {
    const { sut } = makeSut()
    const options = await sut.loadOptions(pollId)
    expect(options).toEqual([
      mockLoadOptionsByPollResult[0],
      mockLoadOptionsByPollResult[1]
    ])
  })

  test('Should return empty array if LoadOptionsByPollRepository returns []', async () => {
    const { sut, loadOptionsByPollRepositorySpy } = makeSut()
    loadOptionsByPollRepositorySpy.result = []
    const options = await sut.loadOptions(pollId)
    expect(options).toEqual([])
  })

  test('Should throw if LoadOptionsByPollRepository throws', async () => {
    const { sut, loadOptionsByPollRepositorySpy } = makeSut()
    jest.spyOn(loadOptionsByPollRepositorySpy, 'loadOptions').mockImplementationOnce(throwError)
    const promise = sut.loadOptions(pollId)
    await expect(promise).rejects.toThrow()
  })
})
