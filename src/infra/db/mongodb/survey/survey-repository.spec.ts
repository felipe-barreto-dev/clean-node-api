import { type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-repository'
let surveyCollection: Collection
describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  test('Should return an survey on add method success', async () => {
    const sut = new SurveyMongoRepository()
    await sut.add({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        answer: 'a'
      }],
      date: new Date()
    })
    const survey = await surveyCollection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })

  test('Should return all surveys on loadAll method success', async () => {
    const sut = new SurveyMongoRepository()
    await sut.add({
      question: 'question_1',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        answer: 'answer'
      }],
      date: new Date()
    })
    await sut.add({
      question: 'question_2',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        answer: 'answer'
      }],
      date: new Date()
    })
    const surveys = await sut.loadAll()
    expect(surveys.length).toBe(2)
    expect(surveys[0].question).toBe('question_1')
    expect(surveys[1].question).toBe('question_2')
  })
})
