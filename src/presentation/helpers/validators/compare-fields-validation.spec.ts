import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from './compare-fields-vaildation'

describe('CompareFields Validation', () => {
  test('Should return InvalidParamError if validation fails', () => {
    const sut = new CompareFieldsValidation('password', 'passwordConfirmation')
    const error = sut.validate({ password: 'any_password', passwordConfirmation: 'any' })
    expect(error).toEqual(new InvalidParamError('passwordConfirmation'))
  })
})
