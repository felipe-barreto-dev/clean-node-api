import { type Encrypter } from '@/data/protocols/criptography/token-generator'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  readonly secret: string
  constructor (secret: string) {
    this.secret = secret
  }

  async encrypt (value: string): Promise<string> {
    jwt.sign({ id: value }, this.secret)
    return new Promise((resolve) => { resolve(null) })
  }
}
