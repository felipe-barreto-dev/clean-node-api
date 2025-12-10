import { type PollModel } from '@/domain/models'
import { MongoHelper } from './helpers/mongo-helper'
import { type LoadPollsRepository, type CheckPollByIdRepository, type LoadOptionsByPollRepository, type LoadPollByIdRepository, type AddPollRepository } from '@/data/protocols'
import { QueryBuilder } from './helpers'
import { ObjectId } from 'mongodb'

export class PollMongoRepository implements AddPollRepository, LoadPollsRepository, LoadOptionsByPollRepository, LoadPollByIdRepository, CheckPollByIdRepository {
  async add (pollData: PollModel): Promise<AddPollRepository.Result> {
    const pollCollection = await MongoHelper.getCollection('polls')
    const result = await pollCollection.insertOne(pollData)
    return {
      id: result.insertedId.toString(),
      question: pollData.question,
      date: pollData.date
    }
  }

  async loadAll (): Promise<PollModel[]> {
    const pollCollection = await MongoHelper.getCollection('polls')
    const pollsData = await pollCollection.find().toArray()
    const polls: PollModel[] = pollsData.map(pollData => ({
      id: pollData._id.toString(),
      question: pollData.question,
      options: pollData.options.map((optionData: { image: any, option: any }) => ({
        image: optionData.image,
        option: optionData.option
      })),
      date: pollData.date
    }))
    return polls
  }

  async loadOptions (id: string): Promise<LoadOptionsByPollRepository.Result> {
    const pollCollection = await MongoHelper.getCollection('polls')
    const query = new QueryBuilder()
      .match({
        _id: new ObjectId(id)
      })
      .project({
        _id: 0,
        options: '$options.option'
      })
      .build()
    const polls = await pollCollection.aggregate(query).toArray()
    return polls[0]?.options || []
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
