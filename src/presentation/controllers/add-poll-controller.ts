import { type AddPoll } from '@/domain/usecases'
import { type Controller, type HttpResponse, type Validation } from '@/presentation/protocols'
import { badRequest, noContent, serverError } from '@/presentation/helpers'
import { type PollAnswerModel } from '@/domain/models'

export class AddPollController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addPoll: AddPoll) {}

  async handle (request: AddPollController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { question, answers } = request
      await this.addPoll.add({
        question,
        answers,
        date: new Date()
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace AddPollController {
  export type Request = {
    question: string
    answers: PollAnswerModel
  }
}
