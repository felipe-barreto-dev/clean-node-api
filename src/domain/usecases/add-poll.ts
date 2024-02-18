import { type PollModel } from '../models/poll'

export interface AddPoll {
  add: (poll: AddPoll.Params) => Promise<void>
}

export namespace AddPoll {
  export type Params = Omit<PollModel, 'id'>
}
