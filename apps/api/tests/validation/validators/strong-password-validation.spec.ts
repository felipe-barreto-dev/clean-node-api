import { InvalidParamError } from '@/presentation/errors'
import { StrongPasswordValidatorAdapter } from '@/infra/validators'
import { StrongPasswordValidation } from '@/validation/validators/strong-password-validation'

describe('Strong Password Validation', () => {
  test('Should return InvalidParamError if validation fails', () => {
    const sut = new StrongPasswordValidation('password', new StrongPasswordValidatorAdapter())
    const error = sut.validate({ password: 'senhafraca' })
    expect(error).toEqual(new InvalidParamError('password'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = new StrongPasswordValidation('password', new StrongPasswordValidatorAdapter())
    const error = sut.validate({ password: 'SenhaForte123!' })
    expect(error).toBeFalsy()
  })

  test('Should return error for password without uppercase', () => {
    const sut = new StrongPasswordValidation('password', new StrongPasswordValidatorAdapter())
    const error = sut.validate({ password: 'senhafraca123!' })
    expect(error).toEqual(new InvalidParamError('password'))
  })

  test('Should return error for password without numbers', () => {
    const sut = new StrongPasswordValidation('password', new StrongPasswordValidatorAdapter())
    const error = sut.validate({ password: 'SenhaFraca!' })
    expect(error).toEqual(new InvalidParamError('password'))
  })

  test('Should return error for short password', () => {
    const sut = new StrongPasswordValidation('password', new StrongPasswordValidatorAdapter())
    const error = sut.validate({ password: 'Abc123!' })
    expect(error).toEqual(new InvalidParamError('password'))
  })
})
