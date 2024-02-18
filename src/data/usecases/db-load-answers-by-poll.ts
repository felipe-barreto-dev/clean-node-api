import { type LoadAnswersByPoll } from '@/domain/usecases'
import { type LoadAnswersByPollRepository } from '@/data/protocols'

export class DbLoadAnswersByPoll implements LoadAnswersByPoll {
  constructor (private readonly loadAnswersByPollRepository: LoadAnswersByPollRepository) {}

  async loadAnswers (id: string): Promise<LoadAnswersByPoll.Result> {
    return this.loadAnswersByPollRepository.loadAnswers(id)
  }
}
