import { SignUpController } from '@/presentation/controllers'
import { type Controller } from '@/presentation/protocols'
import { makeDbAddAccount, makeDbAuthentication, makeLogControllerDecorator, makeSignUpValidation } from '@/main/factories'

export const makeSignUpController = (): Controller => {
  const signupController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(signupController)
}
