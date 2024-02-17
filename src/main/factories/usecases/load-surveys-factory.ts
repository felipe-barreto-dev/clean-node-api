import { DbLoadSurveys } from '@/data/usecases'
import { type LoadSurveys } from '@/domain/usecases'
import { SurveyMongoRepository } from '@/infra/db/mongodb'

export const makeLoadSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
