import { type LoadSurveys } from '@/domain/usecases'
import { type LoadSurveysRepository } from '@/data/protocols'
import { type SurveyModel } from '@/domain/models'

export class DbLoadSurveys implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load (): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll()
    if (surveys) {
      return surveys
    }
    return null
  }
}
