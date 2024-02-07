export interface SurveyModel {
  id?: string
  question: string
  answers: SurveyAnswerModel
  date: Date
}

export type SurveyAnswerModel = Array<{
  image?: string
  answer: string
}>
