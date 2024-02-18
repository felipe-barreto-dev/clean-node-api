export type PollResultModel = {
  pollId: string
  question: string
  answers: PollResultAnswerModel[]
  date: Date
}

type PollResultAnswerModel = {
  image?: string
  answer: string
  count: number
  percent: number
  isCurrentAccountAnswer: boolean
}
