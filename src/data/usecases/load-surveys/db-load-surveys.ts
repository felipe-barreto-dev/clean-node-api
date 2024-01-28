import { type SurveyModel, type LoadSurveysRepository, type LoadSurveys } from './db-load-surveys-protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load (): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.load()
    if (surveys) {
      return surveys
    }
    return null
  }
}
