import { type LoadAnswersBySurveyRepository, type AddSurveyRepository } from '../protocols/db/survey'
import { type SurveyModel } from '../usecases/load-surveys/db-load-surveys-protocols'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (survey: SurveyModel): Promise<void> {}
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadAnswersBySurveyRepository = (): LoadAnswersBySurveyRepository => {
  class LoadAnswersBySurveyRepositoryStub implements LoadAnswersBySurveyRepository {
    async loadAnswers (surveyId: string): Promise<LoadAnswersBySurveyRepository.Result> {
      return mockLoadAnswersBySurveyResult
    }
  }
  return new LoadAnswersBySurveyRepositoryStub()
}

export const mockLoadAnswersBySurveyResult = ['Answer 1', 'Answer 2']
