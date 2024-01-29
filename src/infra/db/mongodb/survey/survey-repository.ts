import { type SurveyModel } from '@/domain/models/survey-model'
import { MongoHelper } from '../helpers/mongo-helper'
import { type AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { type LoadSurveysRepository } from '@/data/usecases/load-surveys/db-load-surveys-protocols'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (surveyData: SurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async load (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveysData = await surveyCollection.find().toArray()
    const surveys: SurveyModel[] = surveysData.map(surveyData => ({
      question: surveyData.question,
      answers: surveyData.answers.map((answerData: { image: any, answer: any }) => ({
        image: answerData.image,
        answer: answerData.answer
      })),
      date: surveyData.date
    }))
    return surveys
  }
}
