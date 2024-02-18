import { type SavePollResult } from '@/domain/usecases'
import { type SavePollResultRepository, type LoadPollResultRepository } from '@/data/protocols'

export class DbSavePollResult implements SavePollResult {
  constructor (
    private readonly savePollResultRepository: SavePollResultRepository,
    private readonly loadPollResultRepository: LoadPollResultRepository
  ) {}

  async save (data: SavePollResult.Params): Promise<SavePollResult.Result> {
    await this.savePollResultRepository.save(data)
    return this.loadPollResultRepository.loadByPollId(data.pollId, data.accountId)
  }
}
