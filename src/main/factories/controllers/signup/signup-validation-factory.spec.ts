import { makeSignUpValidation } from './signup-validation-factory'
import { RequiredFieldValidation } from '@/validation/validators/required-field-validation'
import { type Validation } from '@/validation/validators/validation'
import { CompareFieldsValidation } from '@/validation/validators/compare-fields-vaildation'
import { EmailValidation } from '@/validation/validators/email-validation'
import { type EmailValidator } from '@/validation/protocols/email-validator'
import { ValidationComposite } from '@/validation/validators/validation-composite'

jest.mock('@/validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
