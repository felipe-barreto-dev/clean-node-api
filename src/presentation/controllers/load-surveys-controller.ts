import { type LoadSurveys } from '@/domain/usecases'
import { type Controller, type HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly addSurvey: LoadSurveys) {}

  async handle (): Promise<HttpResponse> {
    try {
      const surveys = await this.addSurvey.load()
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
