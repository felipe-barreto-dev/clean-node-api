import { badRequest, ok, serverError } from '@/presentation/helpers'
import { EmailValidator, type Controller, type HttpRequest, type HttpResponse } from '../signup/signup-protocols'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      return ok(httpRequest.body)
    } catch (error) {
      return serverError(error)
    }
  }
}
