import { type SurveyResultModel } from '@/domain/models'
import { type LoadSurveyResultRepository, type SaveSurveyResultRepository } from '@/data/protocols'
import { mockSurveyResultModel } from '@/domain/test'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  params: SaveSurveyResultRepository.Params
  async save (params: SaveSurveyResultRepository.Params): Promise<void> {
    this.params = params
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyId: string
  accountId: string
  result = mockSurveyResultModel()
  async loadBySurveyId (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    this.accountId = accountId
    return Promise.resolve(this.result)
  }
}
