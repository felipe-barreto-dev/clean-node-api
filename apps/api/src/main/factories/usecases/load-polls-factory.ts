import { DbLoadPolls } from '@/data/usecases'
import { type LoadPolls } from '@/domain/usecases'
import { PollMongoRepository } from '@/infra/db/mongodb'

export const makeLoadPolls = (): LoadPolls => {
  const pollMongoRepository = new PollMongoRepository()
  return new DbLoadPolls(pollMongoRepository)
}
