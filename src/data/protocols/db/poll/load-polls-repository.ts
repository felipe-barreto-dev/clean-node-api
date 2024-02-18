import { type PollModel } from '@/domain/models'

export interface LoadPollsRepository {
  loadAll: () => Promise<PollModel[]>
}
