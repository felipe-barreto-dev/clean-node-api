export interface SurveyModel {
  question: string
  answers: Array<{
    image?: string
    answer: string
  }>
}
