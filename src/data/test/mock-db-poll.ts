import { mockPollModel } from '@/domain/test'
import { type LoadAnswersByPollRepository, type AddPollRepository, type CheckPollByIdRepository, type LoadPollsRepository, type LoadPollByIdRepository } from '@/data/protocols'
import { type PollModel } from '@/domain/models'

export class AddPollRepositorySpy implements AddPollRepository {
  poll: PollModel
  async add (poll: PollModel): Promise<void> {
    this.poll = poll
  }
}

export class LoadAnswersByPollRepositorySpy implements LoadAnswersByPollRepository {
  pollId: string
  result = mockLoadAnswersByPollResult
  async loadAnswers (pollId: string): Promise<LoadAnswersByPollRepository.Result> {
    this.pollId = pollId
    return Promise.resolve(this.result)
  }
}

export class LoadPollByIdRepositorySpy implements LoadPollByIdRepository {
  pollId: string
  result = mockPollModel()
  async loadById (pollId: string): Promise<PollModel> {
    this.pollId = pollId
    return Promise.resolve(this.result)
  }
}

export class CheckPollByIdRepositorySpy implements CheckPollByIdRepository {
  pollId: string
  result = true
  async checkById (pollId: string): Promise<boolean> {
    this.pollId = pollId
    return Promise.resolve(this.result)
  }
}

export class LoadPollsRepositorySpy implements LoadPollsRepository {
  result = [
    mockPollModel(),
    mockPollModel()
  ]

  async loadAll (): Promise<PollModel[]> {
    return Promise.resolve(this.result)
  }
}

export const mockLoadAnswersByPollResult = ['Answer 1', 'Answer 2']
