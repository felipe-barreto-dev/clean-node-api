import { faker } from '@faker-js/faker'
import { type LoadSurveyResult } from '../usecases'

export const mockLoadSurveyResultResult = (): LoadSurveyResult.Result => ({
  question: faker.word.words(),
  answers: [{
    image: faker.image.url(),
    answer: faker.word.preposition(),
    count: faker.number.int(),
    percent: faker.number.int(),
    isCurrentAccountAnswer: true
  }, {
    answer: faker.word.preposition(),
    count: faker.number.int(),
    percent: faker.number.int(),
    isCurrentAccountAnswer: true
  }],
  date: faker.date.recent(),
  surveyId: faker.database.mongodbObjectId()
})
