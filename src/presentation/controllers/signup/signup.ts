import { InvalidParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { type EmailValidator, type HttpRequest, type HttpResponse, type AddAccount, type Controller, type Validation } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      if (httpRequest.body.passwordConfirmation !== httpRequest.body.password) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.add({
        email: httpRequest.body.email,
        name: httpRequest.body.name,
        password: httpRequest.body.password
      })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
