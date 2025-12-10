import { type Controller } from '@/presentation/protocols'
import { LoadPollResultController } from '@/presentation/controllers'
import { PollMongoRepository } from '@/infra/db/mongodb'
import { makeDbLoadPollResult, makeLogControllerDecorator } from '@/main/factories'

export const makeLoadPollResultController = (): Controller => {
  const pollMongoRepository = new PollMongoRepository()
  const loadPollResultController = new LoadPollResultController(pollMongoRepository, makeDbLoadPollResult())
  return makeLogControllerDecorator(loadPollResultController)
}
