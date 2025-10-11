import { type LoadOptionsByPoll, type SavePollResult } from '@/domain/usecases'
import { type PollResultModel } from '@/domain/models'
import MockDate from 'mockdate'
import { throwError } from '@/domain/test'
import { SavePollResultController } from '@/presentation/controllers'
import { ok, serverError } from '@/presentation/helpers'

interface SutTypes {
  sut: SavePollResultController
  loadOptionsByPollStub: LoadOptionsByPoll
  savePollResultStub: SavePollResult
}

const makeLoadOptionsByPollResult = ['Option 1', 'Option 2']

const mockRequest = (): SavePollResultController.Request => ({
  option: 'Option 1',
  pollId: 'poll_id',
  accountId: 'account_id'
})

const makeFakePollResultModel: PollResultModel = {
  question: 'Question 1',
  pollId: '1',
  options: [{
    option: 'Option 1',
    count: 2,
    isCurrentAccountOption: true,
    percent: 20,
    image: ''
  },
  {
    option: 'Option 2',
    count: 2,
    isCurrentAccountOption: false,
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

const makeLoadOptionsByPoll = (): LoadOptionsByPoll => {
  class LoadOptionsByPollStub implements LoadOptionsByPoll {
    async loadOptions (pollId: string): Promise<LoadOptionsByPoll.Result> {
      return makeLoadOptionsByPollResult
    }
  }
  return new LoadOptionsByPollStub()
}

const makeSut = (): SutTypes => {
  const loadOptionsByPollStub = makeLoadOptionsByPoll()
  const savePollResultStub = makeSavePollResult()
  const sut = new SavePollResultController(loadOptionsByPollStub, savePollResultStub)

  return {
    sut,
    loadOptionsByPollStub,
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
