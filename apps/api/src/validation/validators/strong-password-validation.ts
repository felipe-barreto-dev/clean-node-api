import { InvalidParamError } from '@/presentation/errors'
import { type Validation } from '@/presentation/protocols'
import { type StrongPasswordValidator } from '@/validation/protocols'

export class StrongPasswordValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly strongPasswordValidator: StrongPasswordValidator) {}

  validate (input: any): Error {
    const isValid = this.strongPasswordValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
