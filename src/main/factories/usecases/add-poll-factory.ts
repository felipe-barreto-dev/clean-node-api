import { DbAddPoll } from '@/data/usecases'
import { type AddPoll } from '@/domain/usecases'
import { PollMongoRepository } from '@/infra/db/mongodb'

export const makeDbAddPoll = (): AddPoll => {
  const addPollRepository = new PollMongoRepository()
  return new DbAddPoll(addPollRepository)
}
