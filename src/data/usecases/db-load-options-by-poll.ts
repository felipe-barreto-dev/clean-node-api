import { type LoadOptionsByPoll } from '@/domain/usecases'
import { type LoadOptionsByPollRepository } from '@/data/protocols'

export class DbLoadOptionsByPoll implements LoadOptionsByPoll {
  constructor (private readonly loadOptionsByPollRepository: LoadOptionsByPollRepository) {}

  async loadOptions (id: string): Promise<LoadOptionsByPoll.Result> {
    return this.loadOptionsByPollRepository.loadOptions(id)
  }
}
