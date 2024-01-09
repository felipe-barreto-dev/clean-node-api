import { DbAddAccount } from '@/data/usecases/add-account/db-add-account'
import { type AddAccount } from '@/domain/usecases/add-account'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-repository'

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountRepository = new AccountMongoRepository()
  return new DbAddAccount(bcryptAdapter, accountRepository)
}
