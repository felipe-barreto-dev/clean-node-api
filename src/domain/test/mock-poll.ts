import { type PollModel } from '@/domain/models'
import { faker } from '@faker-js/faker'
import { type AddPoll } from '../usecases'

export const mockPollModel = (): PollModel => {
  return {
    id: faker.database.mongodbObjectId(),
    question: faker.word.words(),
    options: [{
      option: faker.word.preposition()
    }, {
      option: faker.word.preposition(),
      image: faker.image.url()
    }],
    date: faker.date.recent()
  }
}

export const mockPollModels = (): PollModel[] => [
  mockPollModel(),
  mockPollModel()
]

export const mockAddPollParams = (): AddPoll.Params => ({
  question: faker.word.words(),
  options: [{
    image: faker.image.url(),
    option: faker.word.preposition()
  }, {
    option: faker.word.preposition()
  }],
  date: faker.date.recent()
})
