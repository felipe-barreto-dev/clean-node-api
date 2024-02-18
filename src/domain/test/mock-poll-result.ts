import { faker } from '@faker-js/faker'
import { type PollResultModel } from '../models'

export const mockPollResultModel = (): PollResultModel => ({
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
  pollId: faker.database.mongodbObjectId()
})
