import { type LoadAnswersBySurvey, type SaveSurveyResult } from '@/domain/usecases'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { type HttpRequest, ok, serverError } from '../add-survey/add-survey-protocols'
import { type SurveyResultModel } from '@/domain/models'
import MockDate from 'mockdate'

interface SutTypes {
  sut: SaveSurveyResultController
  loadAnswersBySurveyStub: LoadAnswersBySurvey
  saveSurveyResultStub: SaveSurveyResult
}

const makeLoadAnswersBySurveyResult = ['Answer 1', 'Answer 2']

const makeFakeRequest: HttpRequest = {
  body: {
    surveyId: 'survey_id',
    accountId: 'account_id',
    answer: 'Answer 1',
    date: new Date()
  }
}

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
    const httpRequest = makeFakeRequest
    httpRequest.body.date = new Date()
    await sut.handle(httpRequest)
    expect(saveSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 500 if SaveSurveyResult returns an error', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const httpResponse = await sut.handle(makeFakeRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest)
    expect(httpResponse).toEqual(ok(makeFakeSurveyResultModel))
  })
})
