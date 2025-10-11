export interface LoadOptionsByPollRepository {
  loadOptions: (id: string) => Promise<LoadOptionsByPollRepository.Result>
}

export namespace LoadOptionsByPollRepository {
  export type Result = string[]
}
