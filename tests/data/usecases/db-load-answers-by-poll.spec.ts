import { faker } from '@faker-js/faker'
import { DbLoadAnswersByPoll } from '@/data/usecases'
import { LoadAnswersByPollRepositorySpy, mockLoadAnswersByPollResult } from '@/data/test/mock-db-poll'
import { throwError } from '@/domain/test'

type SutTypes = {
  sut: DbLoadAnswersByPoll
  loadAnswersByPollRepositorySpy: LoadAnswersByPollRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAnswersByPollRepositorySpy = new LoadAnswersByPollRepositorySpy()
  const sut = new DbLoadAnswersByPoll(loadAnswersByPollRepositorySpy)
  return {
    sut,
    loadAnswersByPollRepositorySpy
  }
}

let pollId: string

describe('DbLoadAnswersByPoll', () => {
  beforeEach(() => {
    pollId = faker.database.mongodbObjectId()
  })

  test('Should call LoadAnswersByPollRepository', async () => {
    const { sut, loadAnswersByPollRepositorySpy } = makeSut()
    await sut.loadAnswers(pollId)
    expect(loadAnswersByPollRepositorySpy.pollId).toBe(pollId)
  })

  test('Should return answers on success', async () => {
    const { sut } = makeSut()
    const answers = await sut.loadAnswers(pollId)
    expect(answers).toEqual([
      mockLoadAnswersByPollResult[0],
      mockLoadAnswersByPollResult[1]
    ])
  })

  test('Should return empty array if LoadAnswersByPollRepository returns []', async () => {
    const { sut, loadAnswersByPollRepositorySpy } = makeSut()
    loadAnswersByPollRepositorySpy.result = []
    const answers = await sut.loadAnswers(pollId)
    expect(answers).toEqual([])
  })

  test('Should throw if LoadAnswersByPollRepository throws', async () => {
    const { sut, loadAnswersByPollRepositorySpy } = makeSut()
    jest.spyOn(loadAnswersByPollRepositorySpy, 'loadAnswers').mockImplementationOnce(throwError)
    const promise = sut.loadAnswers(pollId)
    await expect(promise).rejects.toThrow()
  })
})
