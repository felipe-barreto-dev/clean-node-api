import { type LoadAccountByEmailRepository } from '@/data/protocols/load-account-by-email-repository'
import { type AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {
  const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        return new Promise(resolve => {
          resolve({
            email: 'any_email@mail.com',
            id: 'any_id',
            name: 'any_name',
            password: 'any_password'
          })
        })
      }
    }
    return new LoadAccountByEmailRepositoryStub()
  }

  interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  }

  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    return {
      sut,
      loadAccountByEmailRepositoryStub
    }
  }

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
