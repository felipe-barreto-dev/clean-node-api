import { DbAddSurvey } from '@/data/usecases'
import { type AddSurvey } from '@/domain/usecases'
import { SurveyMongoRepository } from '@/infra/db/mongodb'

export const makeDbAddSurvey = (): AddSurvey => {
  const addSurveyRepository = new SurveyMongoRepository()
  return new DbAddSurvey(addSurveyRepository)
}
