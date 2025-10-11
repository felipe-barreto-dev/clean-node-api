export interface AddPollOptionsRepository {
  add: (pollData: AddPollOptionsRepository.Params) => Promise<AddPollOptionsRepository.Result>
}

export namespace AddPollOptionsRepository {
  export type Params = {
    pollId: string
    options: Array<{
      option: string
      image?: string
    }>
  }

  export type Result = Array<{
    id: string
    pollId: string
    option: string
    image?: string
  }>
}
