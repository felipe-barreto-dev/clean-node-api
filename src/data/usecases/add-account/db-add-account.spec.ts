import { mockAccountModel, mockAddAccountParams, throwError } from '@/domain/test'
import { DbAddAccount } from './db-add-account'
import { AddAccountRepositorySpy, HasherSpy, LoadAccountByEmailRepositorySpy } from '@/data/test'

describe('DbAddAccount Usecase', () => {
  interface SutTypes {
    sut: DbAddAccount
    hasherSpy: HasherSpy
    addAccountRepositorySpy: AddAccountRepositorySpy
    loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  }

  const makeSut = (): SutTypes => {
    const hasherSpy = new HasherSpy()
    const addAccountRepositorySpy = new AddAccountRepositorySpy()
    const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
    loadAccountByEmailRepositorySpy.result = null
    const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy)
    return {
      sut,
      hasherSpy,
      addAccountRepositorySpy,
      loadAccountByEmailRepositorySpy
    }
  }

  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(hasherSpy.plaintext).toBe(addAccountParams.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut()
    const accountData = mockAddAccountParams()
    await sut.add(accountData)
    expect(addAccountRepositorySpy.addAccountParams).toEqual({
      name: accountData.name,
      email: accountData.email,
      password: hasherSpy.digest
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest.spyOn(addAccountRepositorySpy, 'add').mockImplementationOnce(throwError)
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return account on success', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    const mockedAccount = mockAccountModel()
    addAccountRepositorySpy.result = mockedAccount
    const account = await sut.add(mockAddAccountParams())
    expect(account).toEqual(mockedAccount)
  })

  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockReturnValueOnce(Promise.resolve(mockAccountModel()))
    const account = await sut.add(mockAccountModel())
    expect(account).toBe(null)
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const mockedAccount = mockAccountModel()
    await sut.add(mockedAccount)
    expect(loadAccountByEmailRepositorySpy.email).toBe(mockedAccount.email)
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockImplementationOnce(throwError)
    const promise = sut.add(mockAccountModel())
    await expect(promise).rejects.toThrow()
  })
})
