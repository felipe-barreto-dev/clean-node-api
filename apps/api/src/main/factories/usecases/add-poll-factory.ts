import { DbAddPoll } from '@/data/usecases'
import { type AddPoll } from '@/domain/usecases'
import { PollMongoRepository, PollOptionsMongoRepository } from '@/infra/db/mongodb'

export const makeDbAddPoll = (): AddPoll => {
  const addPollRepository = new PollMongoRepository()
  const addPollOptionsRepository = new PollOptionsMongoRepository()
  return new DbAddPoll(addPollRepository, addPollOptionsRepository)
}
