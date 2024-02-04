import { DbSaveSurveyResult } from '@/data/usecases/save-survey-result/db-save-survey-result'
import { type SaveSurveyResult } from '@/domain/usecases'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultMongoRepository, surveyResultMongoRepository)
}
