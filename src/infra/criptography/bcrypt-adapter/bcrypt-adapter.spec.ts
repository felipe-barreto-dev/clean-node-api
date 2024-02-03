import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'
import { throwError } from '@/domain/test'

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

const salt = 12

const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter(salt)
  return {
    sut
  }
}

describe('BCrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const { sut } = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a hash on hash method success', async () => {
      const { sut } = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash')
    })

    test('Should throw if bcrypt hash method throws', async () => {
      const { sut } = makeSut()
      jest.spyOn<any, string>(bcrypt, 'hash')
        .mockImplementationOnce(throwError)
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const { sut } = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_hash')
      expect(hashSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return true on compare method success', async () => {
      const { sut } = makeSut()
      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toBe(true)
    })

    test('Should return false on compare method fail', async () => {
      const { sut } = makeSut()
      jest.spyOn<any, string>(bcrypt, 'compare').mockReturnValueOnce(new Promise(resolve => { resolve(false) }))
      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toBe(false)
    })

    test('Should throw if bcrypt compare method throws', async () => {
      const { sut } = makeSut()
      jest.spyOn<any, string>(bcrypt, 'compare')
        .mockImplementationOnce(throwError)
      const promise = sut.compare('any_value', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
