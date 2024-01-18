import { type SurveyModel } from '@/domain/models/survey-model'
import { MongoHelper } from '../helpers/mongo-helper'
import { type AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: SurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }
}
