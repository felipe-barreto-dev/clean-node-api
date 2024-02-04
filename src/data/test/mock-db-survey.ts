import { mockSurveyModel } from '@/domain/test'
import { type LoadAnswersBySurveyRepository, type AddSurveyRepository, type CheckSurveyByIdRepository } from '../protocols/db/survey'
import { type SurveyModel } from '../usecases/load-surveys/db-load-surveys-protocols'
import { type LoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository'

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

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (surveyId: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockCheckSurveyByIdRepository = (): CheckSurveyByIdRepository => {
  class CheckSurveyByIdRepositoryStub implements CheckSurveyByIdRepository {
    async checkById (surveyId: string): Promise<boolean> {
      return true
    }
  }
  return new CheckSurveyByIdRepositoryStub()
}

export const mockLoadAnswersBySurveyResult = ['Answer 1', 'Answer 2']
