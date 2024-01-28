import { type SurveyModel } from '@/domain/models/survey-model'

export interface LoadSurveysRepository {
  load: () => Promise<SurveyModel[]>
}
