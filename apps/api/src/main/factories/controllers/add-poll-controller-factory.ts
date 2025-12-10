import { AddPollController } from '@/presentation/controllers'
import { type Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator, makeDbAddPoll, makeAddPollValidation } from '@/main/factories'

export const makeAddPollController = (): Controller => {
  const addPollController = new AddPollController(makeAddPollValidation(), makeDbAddPoll())
  return makeLogControllerDecorator(addPollController)
}
