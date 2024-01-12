import { badRequest, serverError } from '../../../helpers/http-helper'
import { type HttpRequest, type HttpResponse, type Controller, type Validation } from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
