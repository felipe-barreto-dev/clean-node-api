import { SurveyMongoRepository } from '@/data/usecases/add-survey/db-add-survey-protocols'
import { DbLoadSurveys } from '@/data/usecases/load-surveys/db-load-surveys'
import { type LoadSurveys } from '@/domain/usecases/load-surveys'

export const makeLoadSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
