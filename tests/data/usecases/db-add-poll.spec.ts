import { AddPollRepositorySpy } from '@/data/test/mock-db-poll'
import { DbAddPoll } from '@/data/usecases'
import { type PollModel } from '@/domain/models'
import MockDate from 'mockdate'

const makeFakePoll = (): PollModel => ({
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image'
  }],
  date: new Date()
})
interface SutTypes {
  sut: DbAddPoll
  addPollRepositorySpy: AddPollRepositorySpy
}

const makeSut = (): SutTypes => {
  const addPollRepositorySpy = new AddPollRepositorySpy()
  const sut = new DbAddPoll(addPollRepositorySpy)
  return {
    sut,
    addPollRepositorySpy
  }
}

describe('DbAddPoll Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should call Hasher with correct password', async () => {
    const { sut, addPollRepositorySpy } = makeSut()
    const addSpy = jest.spyOn(addPollRepositorySpy, 'add')
    await sut.add(makeFakePoll())
    expect(addSpy).toHaveBeenCalledWith(makeFakePoll())
  })
})
