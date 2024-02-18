import { type PollModel } from '@/domain/models'

export interface LoadPollByIdRepository {
  loadById: (pollId: string) => Promise<PollModel>
}
