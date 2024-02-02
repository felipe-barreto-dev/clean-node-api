import { type SurveyModel } from '../models/survey'

export interface AddSurvey {
  add: (survey: SurveyModel) => Promise<void>
}
