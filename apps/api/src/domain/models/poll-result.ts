export type PollResultModel = {
  pollId: string
  question: string
  options: PollResultOptionModel[]
  date: Date
}

type PollResultOptionModel = {
  image?: string
  option: string
  count: number
  percent: number
  isCurrentAccountOption: boolean
}
