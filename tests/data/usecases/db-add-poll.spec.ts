import { AddPollRepositorySpy, AddPollOptionsRepositorySpy } from '@/data/test/mock-db-poll'
import { DbAddPoll } from '@/data/usecases'
import { type PollModel } from '@/domain/models'
import MockDate from 'mockdate'

const makeFakePoll = (): PollModel => ({
  question: 'any_question',
  options: [{
    option: 'any_option',
    image: 'any_image'
  }],
  date: new Date()
})
interface SutTypes {
  sut: DbAddPoll
  addPollRepositorySpy: AddPollRepositorySpy
  addPollOptionsRepositorySpy: AddPollOptionsRepositorySpy
}

const makeSut = (): SutTypes => {
  const addPollRepositorySpy = new AddPollRepositorySpy()
  const addPollOptionsRepositorySpy = new AddPollOptionsRepositorySpy()
  const sut = new DbAddPoll(addPollRepositorySpy, addPollOptionsRepositorySpy)
  return {
    sut,
    addPollRepositorySpy,
    addPollOptionsRepositorySpy
  }
}

describe('DbAddPoll Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should call AddPollRepository with correct values', async () => {
    const { sut, addPollRepositorySpy } = makeSut()
    const addSpy = jest.spyOn(addPollRepositorySpy, 'add')
    const fakePoll = makeFakePoll()
    await sut.add(fakePoll)
    expect(addSpy).toHaveBeenCalledWith({
      question: fakePoll.question,
      date: fakePoll.date
    })
  })

  test('Should call AddPollOptionsRepository with correct values', async () => {
    const { sut, addPollOptionsRepositorySpy } = makeSut()
    const addSpy = jest.spyOn(addPollOptionsRepositorySpy, 'add')
    const fakePoll = makeFakePoll()
    await sut.add(fakePoll)
    expect(addSpy).toHaveBeenCalledWith(expect.objectContaining({
      pollId: expect.any(String),
      options: fakePoll.options
    }))
  })
})
