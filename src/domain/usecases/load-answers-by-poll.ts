export interface LoadAnswersByPoll {
  loadAnswers: (id: string) => Promise<LoadAnswersByPoll.Result>
}

export namespace LoadAnswersByPoll {
  export type Result = string[]
}
