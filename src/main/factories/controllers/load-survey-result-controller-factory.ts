import { type Controller } from '@/presentation/protocols'
import { LoadSurveyResultController } from '@/presentation/controllers'
import { SurveyMongoRepository } from '@/infra/db/mongodb'
import { makeDbLoadSurveyResult, makeLogControllerDecorator } from '@/main/factories'

export const makeLoadSurveyResultController = (): Controller => {
  const surveyMongoRepository = new SurveyMongoRepository()
  const loadSurveyResultController = new LoadSurveyResultController(surveyMongoRepository, makeDbLoadSurveyResult())
  return makeLogControllerDecorator(loadSurveyResultController)
}
