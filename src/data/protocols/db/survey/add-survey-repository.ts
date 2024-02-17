import { type SurveyModel } from '@/domain/models'

export interface AddSurveyRepository {
  add: (surveyData: SurveyModel) => Promise<void>
}
