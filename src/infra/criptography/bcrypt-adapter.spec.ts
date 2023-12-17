import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

interface SutTypes {
  sut: BcryptAdapter
}

describe('BCrypt Adapter', () => {
  const makeSut = (): SutTypes => {
    const sut = new BcryptAdapter(12)
    return {
      sut
    }
  }
  test('Should call bcrypt with correct values', async () => {
    const salt = 12
    const { sut } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
