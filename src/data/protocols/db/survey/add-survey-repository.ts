import { type SurveyModel } from '@/domain/models/survey'

export interface AddSurveyRepository {
  add: (surveyData: SurveyModel) => Promise<void>
}
