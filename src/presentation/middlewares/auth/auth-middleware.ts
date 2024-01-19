import { type LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { AccessDeniedError } from '@/presentation/errors/access-denied-error'
import { forbidden } from '@/presentation/helpers'
import { type HttpRequest, type HttpResponse } from '@/presentation/protocols'
import { type Middleware } from '@/presentation/protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByTokenStub: LoadAccountByToken) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      await this.loadAccountByTokenStub.load(accessToken)
    }
    return forbidden(new AccessDeniedError())
  }
}
