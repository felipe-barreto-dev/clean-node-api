import { type Controller, type HttpResponse } from '@/presentation/protocols'
import { forbidden, serverError, ok } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { type CheckPollById, type LoadPollResult } from '@/domain/usecases'

export class LoadPollResultController implements Controller {
  constructor (
    private readonly checkPollById: CheckPollById,
    private readonly loadPollResult: LoadPollResult
  ) {}

  async handle (request: LoadPollResultController.Request): Promise<HttpResponse> {
    try {
      const { pollId, accountId } = request
      const exists = await this.checkPollById.checkById(pollId)
      if (!exists) {
        return forbidden(new InvalidParamError('pollId'))
      }
      const pollResult = await this.loadPollResult.load(pollId, accountId)
      return ok(pollResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadPollResultController {
  export type Request = {
    pollId: string
    accountId: string
  }
}
