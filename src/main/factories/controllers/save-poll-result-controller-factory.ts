import { SavePollResultController } from '@/presentation/controllers'
import { type Controller } from '@/presentation/protocols'
import { makeDbSavePollResult, makeLoadAnswersByPoll, makeLogControllerDecorator } from '@/main/factories'

export const makeSavePollResultController = (): Controller => {
  const savePollResultController = new SavePollResultController(makeLoadAnswersByPoll(), makeDbSavePollResult())
  return makeLogControllerDecorator(savePollResultController)
}
