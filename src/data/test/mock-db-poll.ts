import { mockPollModel } from '@/domain/test'
import { type LoadOptionsByPollRepository, type AddPollRepository, type AddPollOptionsRepository, type CheckPollByIdRepository, type LoadPollsRepository, type LoadPollByIdRepository } from '@/data/protocols'
import { type PollModel } from '@/domain/models'
import { faker } from '@faker-js/faker'

export class AddPollRepositorySpy implements AddPollRepository {
  poll: PollModel
  async add (poll: PollModel): Promise<AddPollRepository.Result> {
    this.poll = poll
    return {
      id: faker.database.mongodbObjectId(),
      question: poll.question,
      date: poll.date
    }
  }
}

export class AddPollOptionsRepositorySpy implements AddPollOptionsRepository {
  pollOptionsData: AddPollOptionsRepository.Params
  result: AddPollOptionsRepository.Result = []
  async add (pollOptionsData: AddPollOptionsRepository.Params): Promise<AddPollOptionsRepository.Result> {
    this.pollOptionsData = pollOptionsData
    this.result = pollOptionsData.options.map((option) => ({
      id: faker.database.mongodbObjectId(),
      pollId: pollOptionsData.pollId,
      option: option.option,
      image: option.image
    }))
    return Promise.resolve(this.result)
  }
}

export class LoadOptionsByPollRepositorySpy implements LoadOptionsByPollRepository {
  pollId: string
  result = mockLoadOptionsByPollResult
  async loadOptions (pollId: string): Promise<LoadOptionsByPollRepository.Result> {
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

export const mockLoadOptionsByPollResult = ['Option 1', 'Option 2']
