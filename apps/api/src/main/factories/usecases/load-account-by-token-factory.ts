import { DbLoadAccountByToken } from '@/data/usecases'
import { type LoadAccountByToken } from '@/domain/usecases'
import { JwtAdapter } from '@/infra/criptography'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import env from '@/main/config/env'

export const makeLoadAccountByToken = (): LoadAccountByToken => {
  const decrypter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(decrypter, accountMongoRepository)
}
