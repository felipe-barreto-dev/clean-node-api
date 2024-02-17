import { type Controller } from '@/presentation/protocols'
import { LoadSurveysController } from '@/presentation/controllers'
import { makeLoadSurveys, makeLogControllerDecorator } from '@/main/factories'

export const makeLoadSurveysController = (): Controller => {
  const loadSurveysController = new LoadSurveysController(makeLoadSurveys())
  return makeLogControllerDecorator(loadSurveysController)
}
