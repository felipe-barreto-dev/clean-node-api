import { type PollModel } from '../models/poll'

export type AddPollParams = Omit<PollModel, 'id'>

export interface AddPoll {
  add: (poll: AddPollParams) => Promise<void>
}
