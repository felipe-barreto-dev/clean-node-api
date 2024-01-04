import { InvalidParamError } from '@/presentation/errors'
import { type Validation } from './validation'

export class EmailValidation implements Validation {
  private readonly fieldName: string
  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  validate (input: any): Error {
    if (!input[this.fieldName]) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
