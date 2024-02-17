import { AddSurveyController } from '@/presentation/controllers'
import { type Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator, makeDbAddSurvey, makeAddSurveyValidation } from '@/main/factories'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(addSurveyController)
}
