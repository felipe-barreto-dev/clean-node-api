import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers'
import { type Controller, type HttpResponse, type Validation } from '@/presentation/protocols'
import { type Authentication } from '@/domain/usecases'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation) {}

  async handle (request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = request

      const authenticationResult = await this.authentication.auth({ email, password })
      if (!authenticationResult) {
        return unauthorized()
      }
      const { accessToken, name } = authenticationResult
      return ok({ accessToken, name })
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoginController {
  export type Request = {
    email: string
    password: string
  }
}
