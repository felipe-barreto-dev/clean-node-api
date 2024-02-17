import { type LoadAnswersBySurvey, type SaveSurveyResult } from '@/domain/usecases'
import { type SurveyResultModel } from '@/domain/models'
import MockDate from 'mockdate'
import { throwError } from '@/domain/test'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { ok, serverError } from '@/presentation/helpers'

interface SutTypes {
  sut: SaveSurveyResultController
  loadAnswersBySurveyStub: LoadAnswersBySurvey
  saveSurveyResultStub: SaveSurveyResult
}

const makeLoadAnswersBySurveyResult = ['Answer 1', 'Answer 2']

const mockRequest = (): SaveSurveyResultController.Request => ({
  answer: 'Answer 1',
  surveyId: 'survey_id',
  accountId: 'account_id'
})

const makeFakeSurveyResultModel: SurveyResultModel = {
  question: 'Question 1',
  surveyId: '1',
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

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
      return makeFakeSurveyResultModel
    }
  }
  return new SaveSurveyResultStub()
}

const makeLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  class LoadAnswersBySurveyStub implements LoadAnswersBySurvey {
    async loadAnswers (surveyId: string): Promise<LoadAnswersBySurvey.Result> {
      return makeLoadAnswersBySurveyResult
    }
  }
  return new LoadAnswersBySurveyStub()
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyStub = makeLoadAnswersBySurvey()
  const saveSurveyResultStub = makeSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadAnswersBySurveyStub, saveSurveyResultStub)

  return {
    sut,
    loadAnswersBySurveyStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyResult', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    const request = mockRequest()
    await sut.handle(request)
    expect(saveSpy).toHaveBeenCalledWith({
      ...request,
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult returns an error', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(makeFakeSurveyResultModel))
  })
})
