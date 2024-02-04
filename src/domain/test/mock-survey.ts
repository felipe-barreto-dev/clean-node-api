import { type SurveyModel } from '@/domain/models'
import { type AddSurveyParams } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export const mockSurveyModel = (): SurveyModel => {
  return {
    id: faker.database.mongodbObjectId(),
    question: faker.word.words(),
    answers: [{
      answer: faker.word.preposition()
    }, {
      answer: faker.word.preposition(),
      image: faker.image.url()
    }],
    date: faker.date.recent()
  }
}

export const mockSurveyModels = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel()
]

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: faker.word.words(),
  answers: [{
    image: faker.image.url(),
    answer: faker.word.preposition()
  }, {
    answer: faker.word.preposition()
  }],
  date: faker.date.recent()
})
