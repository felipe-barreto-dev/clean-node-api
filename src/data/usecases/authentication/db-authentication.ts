import { type AuthenticationModel, type Authentication } from '@/domain/usecases/authentication'
import { type LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import { type HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { type TokenGenerator } from '@/data/protocols/criptography/token-generator'
import { type UpdateAccessTokenRepository } from '@/data/protocols/db/update-access-token-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer, tokenGenerator: TokenGenerator, updateAccessTokenRepository: UpdateAccessTokenRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const idValidPassword = await this.hashComparer.compare(authentication.password, account.password)
      if (!idValidPassword) {
        return null
      }
      const accessToken = await this.tokenGenerator.generate(account.id)
      await this.updateAccessTokenRepository.update(account.id, accessToken)
      return accessToken
    }
    return null
  }
}
