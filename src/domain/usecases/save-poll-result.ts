import { type PollResultModel } from '@/domain/models'

export interface SavePollResult {
  save: (data: SavePollResult.Params) => Promise<SavePollResult.Result>
}

export namespace SavePollResult {
  export type Params = {
    pollId: string
    accountId: string
    answer: string
    date: Date
  }

  export type Result = PollResultModel
}
