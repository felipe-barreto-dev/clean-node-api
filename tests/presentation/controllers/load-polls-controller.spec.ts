import { type LoadPolls } from '@/domain/usecases'
import { throwError } from '@/domain/test'
import { type PollModel } from '@/domain/models'
import { ok, serverError } from '@/presentation/helpers'
import { LoadPollsController } from '@/presentation/controllers'

interface SutTypes {
  sut: LoadPollsController
  loadPollsStub: LoadPolls
}

const makeFakePolls: PollModel[] = [{
  question: 'Question 1',
  answers: [{
    answer: 'Answer 1'
  },
  {
    answer: 'Answer 2'
  }],
  date: new Date()
},
{
  question: 'Question 2',
  answers: [{
    answer: 'Answer 1'
  },
  {
    answer: 'Answer 2'
  }],
  date: new Date()
}]

const makeLoadPolls = (): LoadPolls => {
  class LoadPollsStub implements LoadPolls {
    async load (): Promise<PollModel[]> {
      return makeFakePolls
    }
  }
  return new LoadPollsStub()
}

const makeSut = (): SutTypes => {
  const loadPollsStub = makeLoadPolls()
  const sut = new LoadPollsController(loadPollsStub)

  return {
    sut,
    loadPollsStub
  }
}

describe('LoadPolls Controller', () => {
  test('Should call LoadPolls', async () => {
    const { sut, loadPollsStub } = makeSut()
    const loadSpy = jest.spyOn(loadPollsStub, 'load')
    await sut.handle()
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 500 if LoadPolls returns an error', async () => {
    const { sut, loadPollsStub } = makeSut()
    jest.spyOn(loadPollsStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle()
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle()
    expect(httpResponse).toEqual(ok(makeFakePolls))
  })
})
