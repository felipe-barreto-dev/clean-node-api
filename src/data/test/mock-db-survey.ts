import { mockSurveyModel } from '@/domain/test'
import { type LoadAnswersBySurveyRepository, type AddSurveyRepository, type CheckSurveyByIdRepository, type LoadSurveysRepository, type LoadSurveyByIdRepository } from '@/data/protocols'
import { type SurveyModel } from '@/domain/models'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  survey: SurveyModel
  async add (survey: SurveyModel): Promise<void> {
    this.survey = survey
  }
}

export class LoadAnswersBySurveyRepositorySpy implements LoadAnswersBySurveyRepository {
  surveyId: string
  result = mockLoadAnswersBySurveyResult
  async loadAnswers (surveyId: string): Promise<LoadAnswersBySurveyRepository.Result> {
    this.surveyId = surveyId
    return Promise.resolve(this.result)
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  surveyId: string
  result = mockSurveyModel()
  async loadById (surveyId: string): Promise<SurveyModel> {
    this.surveyId = surveyId
    return Promise.resolve(this.result)
  }
}

export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  surveyId: string
  result = true
  async checkById (surveyId: string): Promise<boolean> {
    this.surveyId = surveyId
    return Promise.resolve(this.result)
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  result = [
    mockSurveyModel(),
    mockSurveyModel()
  ]

  async loadAll (): Promise<SurveyModel[]> {
    return Promise.resolve(this.result)
  }
}

export const mockLoadAnswersBySurveyResult = ['Answer 1', 'Answer 2']
