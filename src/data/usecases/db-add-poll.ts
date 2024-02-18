import { type AddPoll } from '@/domain/usecases'
import { type AddPollRepository } from '../protocols/db/poll'

export class DbAddPoll implements AddPoll {
  constructor (
    private readonly addPollRepository: AddPollRepository) {}

  async add (poll: AddPoll.Params): Promise<void> {
    await this.addPollRepository.add(poll)
    return Promise.resolve(null)
  }
}
