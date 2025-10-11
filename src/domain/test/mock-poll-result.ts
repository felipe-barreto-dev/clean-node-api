import { faker } from '@faker-js/faker'
import { type PollResultModel } from '../models'

export const mockPollResultModel = (): PollResultModel => ({
  question: faker.word.words(),
  options: [{
    image: faker.image.url(),
    option: faker.word.preposition(),
    count: faker.number.int(),
    percent: faker.number.int(),
    isCurrentAccountOption: true
  }, {
    option: faker.word.preposition(),
    count: faker.number.int(),
    percent: faker.number.int(),
    isCurrentAccountOption: true
  }],
  date: faker.date.recent(),
  pollId: faker.database.mongodbObjectId()
})
