import { badRequest, ok, serverError } from '@/presentation/helpers'
import { type EmailValidator, type Controller, type HttpRequest, type HttpResponse } from '../signup/signup-protocols'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { type Authentication } from '@/domain/usecases/authentication'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
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

      await this.authentication.auth(email, password)

      return ok(httpRequest.body)
    } catch (error) {
      return serverError(error)
    }
  }
}
