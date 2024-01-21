import { type LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { type AccountModel, type LoadAccountByToken, type Decrypter } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository) {}

  async load (token: string, role?: string): Promise<AccountModel> {
    const decryptedToken = await this.decrypter.decrypt(token)
    if (decryptedToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(decryptedToken, role)
      if (account) {
        return new Promise(resolve => { resolve(account) })
      }
    }
    return null
  }
}
