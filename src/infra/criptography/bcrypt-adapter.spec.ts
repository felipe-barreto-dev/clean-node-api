import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

interface SutTypes {
  sut: BcryptAdapter
}

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise((resolve) => { resolve('hash') })
  },
  async compare (): Promise<boolean> {
    return new Promise((resolve) => { resolve(true) })
  }
}))

describe('BCrypt Adapter', () => {
  const salt = 12

  const makeSut = (): SutTypes => {
    const sut = new BcryptAdapter(salt)
    return {
      sut
    }
  }

  test('Should call hash with correct values', async () => {
    const { sut } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut } = makeSut()
    jest.spyOn<any, string>(bcrypt, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => { reject(new Error()) })
      )
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('Should call compare with correct values', async () => {
    const { sut } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })
})
