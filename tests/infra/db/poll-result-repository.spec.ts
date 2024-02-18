import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { type PollModel } from '@/domain/models'

import { type Collection, ObjectId } from 'mongodb'
import { mockAddAccountParams } from '@/domain/test'
import { mockAddPollParams } from '@/domain/test/mock-poll'
import { PollResultMongoRepository } from '@/infra/db/mongodb'

let pollCollection: Collection
let pollResultCollection: Collection
let accountCollection: Collection

const makeSut = (): PollResultMongoRepository => {
  return new PollResultMongoRepository()
}

const mockPoll = async (): Promise<PollModel> => {
  const res = await pollCollection.insertOne(mockAddPollParams())
  const poll = await pollCollection.findOne({ _id: res.insertedId })
  return MongoHelper.map(poll)
}

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return res.insertedId.toHexString()
}

describe('PollMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    pollCollection = await MongoHelper.getCollection('polls')
    await pollCollection.deleteMany({})
    pollResultCollection = await MongoHelper.getCollection('pollResults')
    await pollResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should add a poll result if its new', async () => {
      const poll = await mockPoll()
      const accountId = await mockAccountId()
      const sut = makeSut()
      await sut.save({
        pollId: poll.id,
        accountId,
        answer: poll.answers[0].answer,
        date: new Date()
      })
      const pollResult = await pollResultCollection.findOne({
        pollId: new ObjectId(poll.id),
        accountId: new ObjectId(accountId)
      })
      expect(pollResult).toBeTruthy()
    })

    test('Should update poll result if its not new', async () => {
      const poll = await mockPoll()
      const accountId = await mockAccountId()
      await pollResultCollection.insertOne({
        pollId: new ObjectId(poll.id),
        accountId: new ObjectId(accountId),
        answer: poll.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      await sut.save({
        pollId: poll.id,
        accountId,
        answer: poll.answers[1].answer,
        date: new Date()
      })
      const pollResult = await pollResultCollection
        .find({
          pollId: new ObjectId(poll.id),
          accountId: new ObjectId(accountId)
        })
        .toArray()
      expect(pollResult).toBeTruthy()
      expect(pollResult.length).toBe(1)
    })
  })

  describe('loadByPollId()', () => {
    test('Should load poll result', async () => {
      const poll = await mockPoll()
      const accountId = await mockAccountId()
      const accountId2 = await mockAccountId()
      await pollResultCollection.insertMany([{
        pollId: new ObjectId(poll.id),
        accountId: new ObjectId(accountId2),
        answer: poll.answers[0].answer,
        date: new Date()
      }, {
        pollId: new ObjectId(poll.id),
        accountId: new ObjectId(accountId),
        answer: poll.answers[0].answer,
        date: new Date()
      }])
      const sut = makeSut()
      const pollResult = await sut.loadByPollId(poll.id, accountId)
      expect(pollResult).toBeTruthy()
      expect(pollResult.pollId).toEqual(poll.id)
      expect(pollResult.answers[0].count).toBe(2)
      expect(pollResult.answers[0].percent).toBe(100)
      expect(pollResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(pollResult.answers[1].count).toBe(0)
      expect(pollResult.answers[1].percent).toBe(0)
      expect(pollResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(pollResult.answers.length).toBe(poll.answers.length)
    })

    test('Should load poll result 2', async () => {
      const poll = await mockPoll()
      const accountId = await mockAccountId()
      const accountId2 = await mockAccountId()
      const accountId3 = await mockAccountId()
      await pollResultCollection.insertMany([{
        pollId: new ObjectId(poll.id),
        accountId: new ObjectId(accountId),
        answer: poll.answers[0].answer,
        date: new Date()
      }, {
        pollId: new ObjectId(poll.id),
        accountId: new ObjectId(accountId2),
        answer: poll.answers[1].answer,
        date: new Date()
      }, {
        pollId: new ObjectId(poll.id),
        accountId: new ObjectId(accountId3),
        answer: poll.answers[1].answer,
        date: new Date()
      }])
      const sut = makeSut()
      const pollResult = await sut.loadByPollId(poll.id, accountId2)
      expect(pollResult).toBeTruthy()
      expect(pollResult.pollId).toEqual(poll.id)
      expect(pollResult.answers[0].count).toBe(2)
      expect(pollResult.answers[0].percent).toBe(67)
      expect(pollResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(pollResult.answers[1].count).toBe(1)
      expect(pollResult.answers[1].percent).toBe(33)
      expect(pollResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(pollResult.answers.length).toBe(poll.answers.length)
    })

    test('Should load poll result 3', async () => {
      const poll = await mockPoll()
      const accountId = await mockAccountId()
      const accountId2 = await mockAccountId()
      const accountId3 = await mockAccountId()
      await pollResultCollection.insertMany([{
        pollId: new ObjectId(poll.id),
        accountId: new ObjectId(accountId),
        answer: poll.answers[0].answer,
        date: new Date()
      }, {
        pollId: new ObjectId(poll.id),
        accountId: new ObjectId(accountId2),
        answer: poll.answers[1].answer,
        date: new Date()
      }])
      const sut = makeSut()
      const pollResult = await sut.loadByPollId(poll.id, accountId3)
      expect(pollResult).toBeTruthy()
      expect(pollResult.pollId).toEqual(poll.id)
      expect(pollResult.answers[0].count).toBe(1)
      expect(pollResult.answers[0].percent).toBe(50)
      expect(pollResult.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(pollResult.answers[1].count).toBe(1)
      expect(pollResult.answers[1].percent).toBe(50)
      expect(pollResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(pollResult.answers.length).toBe(poll.answers.length)
    })

    test('Should return null if there is no poll result', async () => {
      const poll = await mockPoll()
      const accountId = await mockAccountId()
      const sut = makeSut()
      const pollResult = await sut.loadByPollId(poll.id, accountId)
      expect(pollResult).toBeNull()
    })
  })
})
