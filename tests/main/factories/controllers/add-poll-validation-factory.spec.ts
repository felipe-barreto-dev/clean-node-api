import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { type Validation } from '@/presentation/protocols'
import { makeAddPollValidation } from '@/main/factories'

jest.mock('@/validation/validators/validation-composite')

describe('AddPollValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddPollValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
