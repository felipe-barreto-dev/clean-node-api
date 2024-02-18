import { type LoadPolls } from '@/domain/usecases'
import { type Controller, type HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers'

export class LoadPollsController implements Controller {
  constructor (
    private readonly addPoll: LoadPolls) {}

  async handle (): Promise<HttpResponse> {
    try {
      const polls = await this.addPoll.load()
      return ok(polls)
    } catch (error) {
      return serverError(error)
    }
  }
}
