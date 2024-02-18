import { type PollResultModel } from '@/domain/models'
import { type LoadPollResultRepository, type SavePollResultRepository } from '@/data/protocols'
import { mockPollResultModel } from '@/domain/test'

export class SavePollResultRepositorySpy implements SavePollResultRepository {
  params: SavePollResultRepository.Params
  async save (params: SavePollResultRepository.Params): Promise<void> {
    this.params = params
  }
}

export class LoadPollResultRepositorySpy implements LoadPollResultRepository {
  pollId: string
  accountId: string
  result = mockPollResultModel()
  async loadByPollId (pollId: string, accountId: string): Promise<PollResultModel> {
    this.pollId = pollId
    this.accountId = accountId
    return Promise.resolve(this.result)
  }
}
