import { AccessDeniedError } from '@/presentation/errors/access-denied-error'
import { forbidden } from '@/presentation/helpers'
import { type HttpRequest } from '@/presentation/protocols'
import { AuthMiddleware } from './auth-middleware'

interface SutTypes {
  sut: AuthMiddleware
}

const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware()
  return {
    sut
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    field: 'field'
  }
})

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })
})
