import { throwError } from '@/domain/test'
import { DbLoadSurveys } from './db-load-surveys'
import { type LoadSurveysRepository, type SurveyModel } from './db-load-surveys-protocols'

describe('DbLoadSurveys Usecase', () => {
  const makeFakeSurveys: SurveyModel[] = [{
    question: 'Question 1',
    answers: [{
      answer: 'Answer 1'
    },
    {
      answer: 'Answer 2'
    }],
    date: new Date()
  },
  {
    question: 'Question 2',
    answers: [{
      answer: 'Answer 1'
    },
    {
      answer: 'Answer 2'
    }],
    date: new Date()
  }]

  const makeLoadSurveysRepository = (): LoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      async load (): Promise<SurveyModel[]> {
        return makeFakeSurveys
      }
    }
    return new LoadSurveysRepositoryStub()
  }

  interface SutTypes {
    sut: DbLoadSurveys
    loadSurveysRepositoryStub: LoadSurveysRepository
  }
  const makeSut = (): SutTypes => {
    const loadSurveysRepositoryStub = makeLoadSurveysRepository()
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
    return {
      sut,
      loadSurveysRepositoryStub
    }
  }

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadSurveysRepositorySpy = jest.spyOn(loadSurveysRepositoryStub, 'load')
    await sut.load()
    expect(loadSurveysRepositorySpy).toHaveBeenCalled()
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'load').mockImplementationOnce(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })

  test('Should return surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(makeFakeSurveys)
  })
})
