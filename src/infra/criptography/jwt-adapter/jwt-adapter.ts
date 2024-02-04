import { type Decrypter } from '@/data/protocols/criptography/decrypter'
import { type Encrypter } from '@/data/protocols/criptography/token-generator'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret)
    return Promise.resolve(accessToken)
  }

  async decrypt (token: string): Promise<string> {
    const value = jwt.verify(token, this.secret)
    return String(value)
  }
}
