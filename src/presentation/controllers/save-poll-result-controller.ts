import { type Controller, type HttpResponse } from '@/presentation/protocols'
import { forbidden, serverError, ok } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { type LoadAnswersByPoll, type SavePollResult } from '@/domain/usecases'

export class SavePollResultController implements Controller {
  constructor (
    private readonly loadAnswersByPoll: LoadAnswersByPoll,
    private readonly savePollResult: SavePollResult
  ) {}

  async handle (request: SavePollResultController.Request): Promise<HttpResponse> {
    try {
      const { answer, pollId } = request
      const answers = await this.loadAnswersByPoll.loadAnswers(pollId)

      if (!answers.length) {
        return forbidden(new InvalidParamError('pollId'))
      } else if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
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
    answer: string
  }
}
