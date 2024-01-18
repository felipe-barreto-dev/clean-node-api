import { AccessDeniedError } from '@/presentation/errors/access-denied-error'
import { forbidden } from '@/presentation/helpers'
import { type HttpRequest, type HttpResponse } from '@/presentation/protocols'
import { type Middleware } from '@/presentation/protocols/middleware'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden(new AccessDeniedError())
  }
}
