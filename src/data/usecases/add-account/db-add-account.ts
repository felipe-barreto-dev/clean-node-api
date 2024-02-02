import { type Hasher, type AddAccount, type AddAccountParams, type AccountModel, type AddAccountRepository, type LoadAccountByEmailRepository } from './db-add-account-protocols'

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
    return new Promise(resolve => { resolve(accountCreated) })
  }
}
