import { SurveyMongoRepository } from '@/data/usecases/add-survey/db-add-survey-protocols'
import { DbLoadSurveyResult } from '@/data/usecases/load-survey-result/db-load-survey-result'
import { type LoadSurveyResult } from '@/domain/usecases'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-repository'

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyResult(surveyResultMongoRepository, surveyMongoRepository)
}
