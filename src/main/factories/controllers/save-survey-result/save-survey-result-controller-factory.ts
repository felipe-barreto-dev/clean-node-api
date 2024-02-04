import { type Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { SaveSurveyResultController } from '@/presentation/controllers/survey/save-survey-result/save-survey-result-controller'
import { makeLoadAnswersBySurvey } from '../../usecases/load-answers-by-survey/load-answers-by-survey-factory'
import { makeDbSaveSurveyResult } from '../../usecases/save-survey-result/db-save-survey-result-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const saveSurveyResultController = new SaveSurveyResultController(makeLoadAnswersBySurvey(), makeDbSaveSurveyResult())
  return makeLogControllerDecorator(saveSurveyResultController)
}
