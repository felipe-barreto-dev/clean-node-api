import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { type HttpRequest, type HttpResponse, type AddAccount, type Controller, type Validation } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
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
