export interface LoadOptionsByPoll {
  loadOptions: (id: string) => Promise<LoadOptionsByPoll.Result>
}

export namespace LoadOptionsByPoll {
  export type Result = string[]
}
