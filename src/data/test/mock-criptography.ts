import { type Decrypter } from '../protocols/criptography/decrypter'
import { type HashComparer } from '../protocols/criptography/hash-comparer'
import { type Hasher } from '../protocols/criptography/hasher'
import { type Encrypter } from '../protocols/criptography/token-generator'

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return new Promise(resolve => { resolve('hashed_password') })
    }
  }
  return new HasherStub()
}

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return new Promise(resolve => { resolve('decrypted') })
    }
  }
  return new DecrypterStub()
}

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => { resolve('any_token') })
    }
  }
  return new EncrypterStub()
}

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}
