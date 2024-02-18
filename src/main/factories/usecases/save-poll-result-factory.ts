import { DbSavePollResult } from '@/data/usecases'
import { type SavePollResult } from '@/domain/usecases'
import { PollResultMongoRepository } from '@/infra/db/mongodb'

export const makeDbSavePollResult = (): SavePollResult => {
  const pollResultMongoRepository = new PollResultMongoRepository()
  return new DbSavePollResult(pollResultMongoRepository, pollResultMongoRepository)
}
