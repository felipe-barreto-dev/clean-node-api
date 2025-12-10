import { type AddPollOptionsRepository } from '@/data/protocols'
import { MongoHelper } from './helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class PollOptionsMongoRepository implements AddPollOptionsRepository {
  async add (pollOptionsData: AddPollOptionsRepository.Params): Promise<AddPollOptionsRepository.Result> {
    const pollCollection = await MongoHelper.getCollection('polls')
    const { pollId, options } = pollOptionsData

    await pollCollection.updateOne(
      { _id: new ObjectId(pollId) },
      { $set: { options } }
    )

    return options.map((option) => ({
      id: new ObjectId().toString(),
      pollId,
      option: option.option,
      image: option.image
    }))
  }
}
