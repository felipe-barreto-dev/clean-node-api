export interface LoadAnswersByPollRepository {
  loadAnswers: (id: string) => Promise<LoadAnswersByPollRepository.Result>
}

export namespace LoadAnswersByPollRepository {
  export type Result = string[]
}
