import { type LoadPollResult } from '@/domain/usecases'
import { type PollModel, type PollResultModel } from '@/domain/models'
import { type LoadPollResultRepository, type LoadPollByIdRepository } from '@/data/protocols'

export class DbLoadPollResult implements LoadPollResult {
  constructor (
    private readonly loadPollResultRepository: LoadPollResultRepository,
    private readonly loadPollByIdRepository: LoadPollByIdRepository
  ) {}

  async load (pollId: string, accountId: string): Promise<LoadPollResult.Result> {
    let pollResult = await this.loadPollResultRepository.loadByPollId(pollId, accountId)
    if (!pollResult) {
      const poll = await this.loadPollByIdRepository.loadById(pollId)
      pollResult = this.makeEmptyResult(poll)
    }
    return pollResult
  }

  private makeEmptyResult (poll: PollModel): PollResultModel {
    return {
      pollId: poll.id,
      question: poll.question,
      date: poll.date,
      answers: poll.answers.map(answer => ({
        ...answer,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }))
    }
  }
}
