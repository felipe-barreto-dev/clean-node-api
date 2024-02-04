export interface CheckSurveyByIdRepository {
  checkById: (surveyId: string) => Promise<boolean>
}
