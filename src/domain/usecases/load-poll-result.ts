import { type PollResultModel } from '@/domain/models'

export interface LoadPollResult {
  load: (pollId: string, accountId: string) => Promise<LoadPollResult.Result>
}

export namespace LoadPollResult {
  export type Result = PollResultModel
}
