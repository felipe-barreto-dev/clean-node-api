import { type Controller, type HttpResponse } from '@/presentation/protocols'
import { forbidden, serverError, ok } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { type LoadOptionsByPoll, type SavePollResult } from '@/domain/usecases'

export class SavePollResultController implements Controller {
  constructor (
    private readonly loadOptionsByPoll: LoadOptionsByPoll,
    private readonly savePollResult: SavePollResult
  ) {}

  async handle (request: SavePollResultController.Request): Promise<HttpResponse> {
    try {
      const { option, pollId } = request
      const options = await this.loadOptionsByPoll.loadOptions(pollId)

      if (!options.length) {
        return forbidden(new InvalidParamError('pollId'))
      } else if (!options.includes(option)) {
        return forbidden(new InvalidParamError('option'))
      }
      const pollResult = await this.savePollResult.save({
        ...request,
        date: new Date()
      })
      return ok(pollResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SavePollResultController {
  export type Request = {
    pollId: string
    accountId: string
    option: string
  }
}
