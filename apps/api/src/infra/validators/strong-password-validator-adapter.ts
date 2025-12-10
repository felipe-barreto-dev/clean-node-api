import { type StrongPasswordValidator } from '@/validation/protocols'
import validator from 'validator'

export class StrongPasswordValidatorAdapter implements StrongPasswordValidator {
  isValid (password: string): boolean {
    return validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
  }
}
