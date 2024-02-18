export interface PollModel {
  id?: string
  question: string
  answers: PollAnswerModel
  date: Date
}

export type PollAnswerModel = Array<{
  image?: string
  answer: string
}>
