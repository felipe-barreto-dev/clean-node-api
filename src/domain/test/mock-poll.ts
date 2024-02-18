import { type PollModel } from '@/domain/models'
import { type AddPollParams } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export const mockPollModel = (): PollModel => {
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

export const mockPollModels = (): PollModel[] => [
  mockPollModel(),
  mockPollModel()
]

export const mockAddPollParams = (): AddPollParams => ({
  question: faker.word.words(),
  answers: [{
    image: faker.image.url(),
    answer: faker.word.preposition()
  }, {
    answer: faker.word.preposition()
  }],
  date: faker.date.recent()
})
