import { mockAccountModel, mockAddAccountParams, throwError } from '@/domain/test'
import { DbAddAccount } from './db-add-account'
import { type AddAccountRepository, type AccountModel, type AddAccountParams, type Hasher, type LoadAccountByEmailRepository } from './db-add-account-protocols'

describe('DbAddAccount Usecase', () => {
  const makeHasherStub = (): Hasher => {
    class HasherStub implements Hasher {
      async hash (value: string): Promise<string> {
        return new Promise(resolve => { resolve('hashed_password') })
      }
    }
    return new HasherStub()
  }
  const makeAddAccountRepositoryStub = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
      async add (accountData: AddAccountParams): Promise<AccountModel> {
        const fakeAccount = {
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email',
          password: 'hashed_password'
        }
        return new Promise(resolve => { resolve(fakeAccount) })
      }
    }
    return new AddAccountRepositoryStub()
  }

  const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async loadByEmail (email: string): Promise<AccountModel> {
        return new Promise(resolve => {
          resolve(null)
        })
      }
    }
    return new LoadAccountByEmailRepositoryStub()
  }
  interface SutTypes {
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  }
  const makeSut = (): SutTypes => {
    const hasherStub = makeHasherStub()
    const addAccountRepositoryStub = makeAddAccountRepositoryStub()
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
    return {
      sut,
      hasherStub,
      addAccountRepositoryStub,
      loadAccountByEmailRepositoryStub
    }
  }

  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError)
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(addAccountRepositorySpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError)
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(mockAddAccountParams())
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => { resolve(mockAccountModel()) }))
    const account = await sut.add(mockAccountModel())
    expect(account).toBe(null)
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockAccountModel())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError)
    const promise = sut.add(mockAccountModel())
    await expect(promise).rejects.toThrow()
  })
})
