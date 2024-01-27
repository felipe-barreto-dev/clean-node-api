import { AuthMiddleware } from '@/presentation/middlewares/auth/auth-middleware'
import { type Middleware } from '@/presentation/protocols'
import { makeLoadAccountByToken } from '../usecases/load-account-by-token/load-account-by-token-factory'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeLoadAccountByToken(), role)
}
