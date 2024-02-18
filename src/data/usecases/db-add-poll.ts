import { type AddPollRepository } from '@/data/protocols'
import { type AddPoll, type AddPollParams } from '@/domain/usecases'

export class DbAddPoll implements AddPoll {
  constructor (
    private readonly addPollRepository: AddPollRepository) {}

  async add (poll: AddPollParams): Promise<void> {
    await this.addPollRepository.add(poll)
    return Promise.resolve(null)
  }
}
