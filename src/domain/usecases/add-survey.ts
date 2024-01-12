import { type SurveyModel } from '../models/survey-model'

export interface AddSurvey {
  add: (survey: SurveyModel) => Promise<void>
}
