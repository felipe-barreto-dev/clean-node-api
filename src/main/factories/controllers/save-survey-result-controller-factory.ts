import { SaveSurveyResultController } from '@/presentation/controllers'
import { type Controller } from '@/presentation/protocols'
import { makeDbSaveSurveyResult, makeLoadAnswersBySurvey, makeLogControllerDecorator } from '@/main/factories'

export const makeSaveSurveyResultController = (): Controller => {
  const saveSurveyResultController = new SaveSurveyResultController(makeLoadAnswersBySurvey(), makeDbSaveSurveyResult())
  return makeLogControllerDecorator(saveSurveyResultController)
}
