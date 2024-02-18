import { type SavePollResult } from '@/domain/usecases'

export interface SavePollResultRepository {
  save: (data: SavePollResultRepository.Params) => Promise<void>
}

export namespace SavePollResultRepository {
  export type Params = SavePollResult.Params
}
