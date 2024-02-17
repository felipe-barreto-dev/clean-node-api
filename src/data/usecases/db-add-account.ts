import { type AddAccount, type AddAccountParams } from '@/domain/usecases'
import { type AddAccountRepository, type Hasher, type LoadAccountByEmailRepository } from '@/data/protocols'
import { type AccountModel } from '@/domain/models'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async add (account: AddAccountParams): Promise<AccountModel> {
    const accountAlreadyCreated = await this.loadAccountByEmailRepository.loadByEmail(account.email)
    if (accountAlreadyCreated) {
      return null
    }
    const { password } = account
    const hashedPassword = await this.hasher.hash(password)
    const accountCreated = await this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }))
    return Promise.resolve(accountCreated)
  }
}
