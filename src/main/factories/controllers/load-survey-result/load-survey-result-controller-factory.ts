import { type Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { LoadSurveyResultController } from '@/presentation/controllers/survey/load-survey-result/load-survey-result-controller'
import { makeDbLoadSurveyResult } from '../../usecases/load-survey-result/db-load-survey-result-factory'
import { SurveyMongoRepository } from '@/data/usecases/add-survey/db-add-survey-protocols'

export const makeLoadSurveyResultController = (): Controller => {
  const surveyMongoRepository = new SurveyMongoRepository()
  const loadSurveyResultController = new LoadSurveyResultController(surveyMongoRepository, makeDbLoadSurveyResult())
  return makeLogControllerDecorator(loadSurveyResultController)
}
