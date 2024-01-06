import { type Encrypter } from '@/data/protocols/criptography/encrypter'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
  readonly salt: number
  constructor (salt: number) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return new Promise((resolve) => { resolve(hash) })
  }
}
