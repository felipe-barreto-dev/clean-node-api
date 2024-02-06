import { mockAccountModel, throwError } from '@/domain/test'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { DecrypterSpy, LoadAccountByTokenRepositorySpy } from '@/data/test'

describe('DbLoadAccountByToken Usecase', () => {
  interface SutTypes {
    sut: DbLoadAccountByToken
    decrypterSpy: DecrypterSpy
    loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
  }
  const makeSut = (): SutTypes => {
    const decrypterSpy = new DecrypterSpy()
    const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy()
    const sut = new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositorySpy)
    return {
      sut,
      decrypterSpy,
      loadAccountByTokenRepositorySpy
    }
  }

  test('Should call Decrypter with correct password', async () => {
    const { sut, decrypterSpy } = makeSut()
    const token = 'token'
    await sut.load(token)
    expect(decrypterSpy.ciphertext).toBe(token)
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    const token = 'token'
    const role = 'role'
    await sut.load(token, role)
    expect(loadAccountByTokenRepositorySpy.token).toBe(token)
    expect(loadAccountByTokenRepositorySpy.role).toBe(role)
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken').mockImplementationOnce(throwError)
    const token = 'token'
    const role = 'role'
    const promise = sut.load(token, role)
    await expect(promise).rejects.toThrow()
  })

  test('Should return account on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    const mockedAccount = mockAccountModel()
    loadAccountByTokenRepositorySpy.result = mockedAccount
    const token = 'token'
    const account = await sut.load(token)
    expect(account).toEqual(mockedAccount)
  })
})
