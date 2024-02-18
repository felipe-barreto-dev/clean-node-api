import { PollMongoRepository, PollResultMongoRepository } from '@/infra/db/mongodb'
import { DbLoadPollResult } from '@/data/usecases'
import { type LoadPollResult } from '@/domain/usecases'

export const makeDbLoadPollResult = (): LoadPollResult => {
  const pollResultMongoRepository = new PollResultMongoRepository()
  const pollMongoRepository = new PollMongoRepository()
  return new DbLoadPollResult(pollResultMongoRepository, pollMongoRepository)
}
