import { AuthMiddleware } from '@/presentation/middlewares'
import { type Middleware } from '@/presentation/protocols'
import { makeLoadAccountByToken } from '@/main/factories'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeLoadAccountByToken(), role)
}
