import { type Controller } from '@/presentation/protocols'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-repository'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { makeSignUpValidation } from './signup-validation-factory'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import { DbAuthentication } from '@/data/usecases/authentication/db-authentication'
import env from '@/main/config/env'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountRepository = new AccountMongoRepository()
  const logRepository = new LogMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountRepository)
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const signupController = new SignUpController(dbAddAccount, makeSignUpValidation(), dbAuthentication)
  return new LogControllerDecorator(signupController, logRepository)
}
