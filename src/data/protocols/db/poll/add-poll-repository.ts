export interface AddPollRepository {
  add: (pollData: AddPollRepository.Params) => Promise<AddPollRepository.Result>
}

export namespace AddPollRepository {
  export type Params = {
    question: string
    date: Date
  }

  export type Result = {
    id: string
    question: string
    date: Date
  }
}
