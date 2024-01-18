import { type SurveyModel } from '@/domain/models/survey-model'

export interface AddSurveyRepository {
  add: (surveyData: SurveyModel) => Promise<void>
}
