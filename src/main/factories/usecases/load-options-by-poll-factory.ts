import { DbLoadOptionsByPoll } from '@/data/usecases'
import { type LoadOptionsByPoll } from '@/domain/usecases'
import { PollMongoRepository } from '@/infra/db/mongodb'

export const makeLoadOptionsByPoll = (): LoadOptionsByPoll => {
  const pollMongoRepository = new PollMongoRepository()
  return new DbLoadOptionsByPoll(pollMongoRepository)
}
