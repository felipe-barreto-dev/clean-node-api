import { type LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { AccessDeniedError } from '@/presentation/errors/access-denied-error'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { type HttpResponse } from '@/presentation/protocols'
import { type Middleware } from '@/presentation/protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken, private readonly role?: string) {}
  async handle (request: any): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
