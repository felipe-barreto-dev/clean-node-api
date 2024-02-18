import { type LoadPolls } from '@/domain/usecases'
import { type LoadPollsRepository } from '@/data/protocols'
import { type PollModel } from '@/domain/models'

export class DbLoadPolls implements LoadPolls {
  constructor (
    private readonly loadPollsRepository: LoadPollsRepository) {}

  async load (): Promise<PollModel[]> {
    const polls = await this.loadPollsRepository.loadAll()
    if (polls) {
      return polls
    }
    return null
  }
}
