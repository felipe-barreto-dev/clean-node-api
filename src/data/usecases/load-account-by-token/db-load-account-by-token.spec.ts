import { DbLoadAccountByToken } from './db-load-account-by-token'
import { type AccountModel, type Decrypter } from './db-load-account-by-token-protocols'
import { type LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'

describe('DbLoadAccountByToken Usecase', () => {
  const makeFakeAccount = (): AccountModel => ({
    email: 'any_email@mail.com',
    id: 'any_id',
    name: 'any_name',
    password: 'any_password'
  })
  const makeDecrypterStub = (): Decrypter => {
    class DecrypterStub implements Decrypter {
      async decrypt (value: string): Promise<string> {
        return new Promise(resolve => { resolve('decrypted') })
      }
    }
    return new DecrypterStub()
  }

  const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
      async loadByToken (token: string): Promise<AccountModel> {
        return new Promise(resolve => {
          resolve(makeFakeAccount())
        })
      }
    }
    return new LoadAccountByTokenRepositoryStub()
  }

  interface SutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
    loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  }
  const makeSut = (): SutTypes => {
    const decrypterStub = makeDecrypterStub()
    const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
    const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
    return {
      sut,
      decrypterStub,
      loadAccountByTokenRepositoryStub
    }
  }

  test('Should call Decrypter with correct password', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const token = 'token'
    await sut.load(token)
    expect(decryptSpy).toHaveBeenCalledWith(token)
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadAccountByTokenRepositorySpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    const token = 'token'
    const role = 'role'
    await sut.load(token, role)
    expect(loadAccountByTokenRepositorySpy).toHaveBeenCalledWith(token, role)
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const token = 'token'
    const role = 'role'
    const promise = sut.load(token, role)
    await expect(promise).rejects.toThrow()
  })

  test('Should return account on success', async () => {
    const { sut } = makeSut()
    const token = 'token'
    const account = await sut.load(token)
    expect(account).toEqual(makeFakeAccount())
  })
})
