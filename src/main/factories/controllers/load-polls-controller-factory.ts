import { type Controller } from '@/presentation/protocols'
import { LoadPollsController } from '@/presentation/controllers'
import { makeLoadPolls, makeLogControllerDecorator } from '@/main/factories'

export const makeLoadPollsController = (): Controller => {
  const loadPollsController = new LoadPollsController(makeLoadPolls())
  return makeLogControllerDecorator(loadPollsController)
}
