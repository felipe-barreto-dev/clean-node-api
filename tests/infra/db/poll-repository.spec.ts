import { type Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { PollMongoRepository } from '@/infra/db/mongodb'
let pollCollection: Collection
describe('Poll Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    pollCollection = await MongoHelper.getCollection('polls')
    await pollCollection.deleteMany({})
  })

  test('Should return an poll on add method success', async () => {
    const sut = new PollMongoRepository()
    await sut.add({
      id: null,
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
    const poll = await pollCollection.findOne({ question: 'any_question' })
    expect(poll).toBeTruthy()
  })

  test('Should return all polls on loadAll method success', async () => {
    const sut = new PollMongoRepository()
    await sut.add({
      id: null,
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
      id: null,
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
    const polls = await sut.loadAll()
    expect(polls.length).toBe(2)
    expect(polls[0].question).toBe('question_1')
    expect(polls[1].question).toBe('question_2')
  })
})
