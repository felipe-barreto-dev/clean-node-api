import { mockPollModel, throwError } from '@/domain/test'
import { DbLoadPolls } from '@/data/usecases'
import { LoadPollsRepositorySpy } from '@/data/test/mock-db-poll'

describe('DbLoadPolls Usecase', () => {
  interface SutTypes {
    sut: DbLoadPolls
    loadPollsRepositorySpy: LoadPollsRepositorySpy
  }
  const makeSut = (): SutTypes => {
    const loadPollsRepositorySpy = new LoadPollsRepositorySpy()
    const sut = new DbLoadPolls(loadPollsRepositorySpy)
    return {
      sut,
      loadPollsRepositorySpy
    }
  }

  test('Should call LoadPollsRepository', async () => {
    const { sut, loadPollsRepositorySpy } = makeSut()
    const loadAllSpy = jest.spyOn(loadPollsRepositorySpy, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should throw if LoadPollsRepository throws', async () => {
    const { sut, loadPollsRepositorySpy } = makeSut()
    jest.spyOn(loadPollsRepositorySpy, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })

  test('Should return polls on success', async () => {
    const { sut, loadPollsRepositorySpy } = makeSut()
    const mockedPolls = [
      mockPollModel(),
      mockPollModel()
    ]
    loadPollsRepositorySpy.result = mockedPolls
    const polls = await sut.load()
    expect(polls).toEqual(mockedPolls)
  })
})
