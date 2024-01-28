import { type HttpResponse, type Controller, serverError, type LoadSurveys, ok } from './load-surveys-protocols'

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
