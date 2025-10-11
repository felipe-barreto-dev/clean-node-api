import { SavePollResultController } from '@/presentation/controllers'
import { type Controller } from '@/presentation/protocols'
import { makeDbSavePollResult, makeLoadOptionsByPoll, makeLogControllerDecorator } from '@/main/factories'

export const makeSavePollResultController = (): Controller => {
  const savePollResultController = new SavePollResultController(makeLoadOptionsByPoll(), makeDbSavePollResult())
  return makeLogControllerDecorator(savePollResultController)
}
