import { EmailInUseError } from '@/presentation/errors'
import { type Controller, type HttpResponse, type Validation } from '@/presentation/protocols'
import { type AddAccount, type Authentication } from '@/domain/usecases'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication) {}

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { email, password, name, role } = request
      const account = await this.addAccount.add({
        email,
        name,
        password,
        role
      })
      if (!account) {
        return forbidden(new EmailInUseError())
      }
      const { accessToken } = await this.authentication.auth({
        email,
        password
      })
      return ok({ accessToken, name })
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
    role: string
  }
}
