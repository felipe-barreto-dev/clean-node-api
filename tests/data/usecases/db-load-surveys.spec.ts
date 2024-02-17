import { mockSurveyModel, throwError } from '@/domain/test'
import { DbLoadSurveys } from '@/data/usecases'
import { LoadSurveysRepositorySpy } from '@/data/test/mock-db-survey'

describe('DbLoadSurveys Usecase', () => {
  interface SutTypes {
    sut: DbLoadSurveys
    loadSurveysRepositorySpy: LoadSurveysRepositorySpy
  }
  const makeSut = (): SutTypes => {
    const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy()
    const sut = new DbLoadSurveys(loadSurveysRepositorySpy)
    return {
      sut,
      loadSurveysRepositorySpy
    }
  }

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositorySpy, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })

  test('Should return surveys on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const mockedSurveys = [
      mockSurveyModel(),
      mockSurveyModel()
    ]
    loadSurveysRepositorySpy.result = mockedSurveys
    const surveys = await sut.load()
    expect(surveys).toEqual(mockedSurveys)
  })
})
