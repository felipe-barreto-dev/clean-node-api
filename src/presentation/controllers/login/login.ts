import { badRequest, ok } from '@/presentation/helpers'
import { type Controller, type HttpRequest, type HttpResponse } from '../signup/signup-protocols'
import { MissingParamError } from '@/presentation/errors'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    return ok(httpRequest.body)
  }
}
