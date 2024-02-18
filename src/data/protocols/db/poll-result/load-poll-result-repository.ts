import { type PollResultModel } from '@/domain/models'

export interface LoadPollResultRepository {
  loadByPollId: (pollId: string, accountId: string) => Promise<LoadPollResultRepository.Result>
}

export namespace LoadPollResultRepository {
  export type Result = PollResultModel
}
