import { type LoadAnswersByPoll, type SavePollResult } from '@/domain/usecases'
import { type PollResultModel } from '@/domain/models'
import MockDate from 'mockdate'
import { throwError } from '@/domain/test'
import { SavePollResultController } from '@/presentation/controllers'
import { ok, serverError } from '@/presentation/helpers'

interface SutTypes {
  sut: SavePollResultController
  loadAnswersByPollStub: LoadAnswersByPoll
  savePollResultStub: SavePollResult
}

const makeLoadAnswersByPollResult = ['Answer 1', 'Answer 2']

const mockRequest = (): SavePollResultController.Request => ({
  answer: 'Answer 1',
  pollId: 'poll_id',
  accountId: 'account_id'
})

const makeFakePollResultModel: PollResultModel = {
  question: 'Question 1',
  pollId: '1',
  answers: [{
    answer: 'Answer 1',
    count: 2,
    isCurrentAccountAnswer: true,
    percent: 20,
    image: ''
  },
  {
    answer: 'Answer 2',
    count: 2,
    isCurrentAccountAnswer: false,
    percent: 20,
    image: ''
  }],
  date: new Date()
}

const makeSavePollResult = (): SavePollResult => {
  class SavePollResultStub implements SavePollResult {
    async save (data: SavePollResult.Params): Promise<SavePollResult.Result> {
      return makeFakePollResultModel
    }
  }
  return new SavePollResultStub()
}

const makeLoadAnswersByPoll = (): LoadAnswersByPoll => {
  class LoadAnswersByPollStub implements LoadAnswersByPoll {
    async loadAnswers (pollId: string): Promise<LoadAnswersByPoll.Result> {
      return makeLoadAnswersByPollResult
    }
  }
  return new LoadAnswersByPollStub()
}

const makeSut = (): SutTypes => {
  const loadAnswersByPollStub = makeLoadAnswersByPoll()
  const savePollResultStub = makeSavePollResult()
  const sut = new SavePollResultController(loadAnswersByPollStub, savePollResultStub)

  return {
    sut,
    loadAnswersByPollStub,
    savePollResultStub
  }
}

describe('SavePollResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SavePollResult', async () => {
    const { sut, savePollResultStub } = makeSut()
    const saveSpy = jest.spyOn(savePollResultStub, 'save')
    const request = mockRequest()
    await sut.handle(request)
    expect(saveSpy).toHaveBeenCalledWith({
      ...request,
      date: new Date()
    })
  })

  test('Should return 500 if SavePollResult returns an error', async () => {
    const { sut, savePollResultStub } = makeSut()
    jest.spyOn(savePollResultStub, 'save').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(makeFakePollResultModel))
  })
})
