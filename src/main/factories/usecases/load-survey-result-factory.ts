import { SurveyMongoRepository, SurveyResultMongoRepository } from '@/infra/db/mongodb'
import { DbLoadSurveyResult } from '@/data/usecases'
import { type LoadSurveyResult } from '@/domain/usecases'

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyResult(surveyResultMongoRepository, surveyMongoRepository)
}
