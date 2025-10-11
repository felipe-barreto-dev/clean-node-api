import { type AddPoll } from '@/domain/usecases'
import { type AddPollOptionsRepository, type AddPollRepository } from '../protocols/db/poll'

export class DbAddPoll implements AddPoll {
  constructor (
    private readonly addPollRepository: AddPollRepository,
    private readonly addPollOptionsRepository: AddPollOptionsRepository) {}

  async add (poll: AddPoll.Params): Promise<void> {
    const { question, date, options } = poll
    const createdPoll = await this.addPollRepository.add({
      question,
      date
    })
    if (createdPoll.id) {
      await this.addPollOptionsRepository.add({
        pollId: createdPoll.id,
        options
      })
      return Promise.resolve(null)
    }
    return Promise.resolve(null)
  }
}
