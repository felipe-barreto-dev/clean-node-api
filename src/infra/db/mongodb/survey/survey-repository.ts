import { type SurveyModel } from '@/domain/models/survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { type AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { type LoadSurveysRepository } from '@/data/usecases/load-surveys/db-load-surveys-protocols'
import { type LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey'
import { QueryBuilder } from '../helpers'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadAnswersBySurveyRepository {
  async add (surveyData: SurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveysData = await surveyCollection.find().toArray()
    const surveys: SurveyModel[] = surveysData.map(surveyData => ({
      id: surveyData._id.toString(),
      question: surveyData.question,
      answers: surveyData.answers.map((answerData: { image: any, answer: any }) => ({
        image: answerData.image,
        answer: answerData.answer
      })),
      date: surveyData.date
    }))
    return surveys
  }

  async loadAnswers (id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .match({
        _id: new ObjectId(id)
      })
      .project({
        _id: 0,
        answers: '$answers.answer'
      })
      .build()
    const surveys = await surveyCollection.aggregate(query).toArray()
    return surveys[0]?.answers || []
  }
}
