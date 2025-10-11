export interface PollModel {
  id?: string
  question: string
  options: PollOptionModel
  date: Date
}

export type PollOptionModel = Array<{
  image?: string
  option: string
}>
