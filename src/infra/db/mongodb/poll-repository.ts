import { type PollModel } from '@/domain/models'
import { MongoHelper } from './helpers/mongo-helper'
import { type LoadPollsRepository, type CheckPollByIdRepository, type LoadAnswersByPollRepository, type LoadPollByIdRepository, type AddPollRepository } from '@/data/protocols'
import { QueryBuilder } from './helpers'
import { ObjectId } from 'mongodb'

export class PollMongoRepository implements AddPollRepository, LoadPollsRepository, LoadAnswersByPollRepository, LoadPollByIdRepository, CheckPollByIdRepository {
  async add (pollData: PollModel): Promise<void> {
    const pollCollection = await MongoHelper.getCollection('polls')
    await pollCollection.insertOne(pollData)
  }

  async loadAll (): Promise<PollModel[]> {
    const pollCollection = await MongoHelper.getCollection('polls')
    const pollsData = await pollCollection.find().toArray()
    const polls: PollModel[] = pollsData.map(pollData => ({
      id: pollData._id.toString(),
      question: pollData.question,
      answers: pollData.answers.map((answerData: { image: any, answer: any }) => ({
        image: answerData.image,
        answer: answerData.answer
      })),
      date: pollData.date
    }))
    return polls
  }

  async loadAnswers (id: string): Promise<LoadAnswersByPollRepository.Result> {
    const pollCollection = await MongoHelper.getCollection('polls')
    const query = new QueryBuilder()
      .match({
        _id: new ObjectId(id)
      })
      .project({
        _id: 0,
        answers: '$answers.answer'
      })
      .build()
    const polls = await pollCollection.aggregate(query).toArray()
    return polls[0]?.answers || []
  }

  async loadById (id: string): Promise<PollModel> {
    const pollCollection = await MongoHelper.getCollection('polls')
    const poll = await pollCollection.findOne({ _id: new ObjectId(id) })
    return poll && MongoHelper.map(poll)
  }

  async checkById (id: string): Promise<boolean> {
    const pollCollection = await MongoHelper.getCollection('polls')
    const poll = await pollCollection.findOne({
      _id: new ObjectId(id)
    }, {
      projection: {
        _id: 1
      }
    })
    return poll !== null
  }
}
