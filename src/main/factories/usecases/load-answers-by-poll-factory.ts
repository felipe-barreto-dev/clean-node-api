import { DbLoadAnswersByPoll } from '@/data/usecases'
import { type LoadAnswersByPoll } from '@/domain/usecases'
import { PollMongoRepository } from '@/infra/db/mongodb'

export const makeLoadAnswersByPoll = (): LoadAnswersByPoll => {
  const pollMongoRepository = new PollMongoRepository()
  return new DbLoadAnswersByPoll(pollMongoRepository)
}
