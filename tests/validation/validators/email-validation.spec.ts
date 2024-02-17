import { InvalidParamError } from '@/presentation/errors'
import { EmailValidation } from '@/validation/validators'
import { EmailValidatorAdapter } from '@/infra/validators'

describe('Email Validation', () => {
  test('Should return InvalidParamError if validation fails', () => {
    const sut = new EmailValidation('email', new EmailValidatorAdapter())
    const error = sut.validate({ email: 'anyemail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = new EmailValidation('email', new EmailValidatorAdapter())
    const error = sut.validate({ email: 'any@email.com' })
    expect(error).toBeFalsy()
  })
})
