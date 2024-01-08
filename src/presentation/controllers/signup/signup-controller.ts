import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { type HttpRequest, type HttpResponse, type AddAccount, type Controller, type Validation, type Authentication } from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password, name } = httpRequest.body
      const account = await this.addAccount.add({
        email,
        name,
        password
      })
      await this.authentication.auth({
        email: account.email,
        password: account.password
      })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
