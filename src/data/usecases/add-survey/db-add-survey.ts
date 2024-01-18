import { type AddSurveyRepository, type AddSurvey, type SurveyModel } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository) {}

  async add (survey: SurveyModel): Promise<void> {
    await this.addSurveyRepository.add(survey)
    return new Promise(resolve => { resolve(null) })
  }
}
