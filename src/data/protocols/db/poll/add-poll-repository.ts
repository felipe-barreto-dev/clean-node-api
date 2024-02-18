import { type PollModel } from '@/domain/models'

export interface AddPollRepository {
  add: (pollData: PollModel) => Promise<void>
}
