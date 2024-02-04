import { SurveyMongoRepository } from '@/data/usecases/add-survey/db-add-survey-protocols'
import { DbLoadAnswersBySurvey } from '@/data/usecases/load-answers-by-survey/db-load-answers-by-survey'
import { type LoadAnswersBySurvey } from '@/domain/usecases'

export const makeLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadAnswersBySurvey(surveyMongoRepository)
}
