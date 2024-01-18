import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { type Validation } from '../../../../validation/validators/validation'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
