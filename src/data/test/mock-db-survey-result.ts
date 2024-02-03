import { type SaveSurveyResultRepository } from '../protocols/db/survey-result'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultRepository.Params): Promise<void> {}
  }
  return new SaveSurveyResultRepositoryStub()
}
