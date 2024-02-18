import { type PollModel } from '../models/poll'

export interface LoadPolls {
  load: () => Promise<PollModel[]>
}
