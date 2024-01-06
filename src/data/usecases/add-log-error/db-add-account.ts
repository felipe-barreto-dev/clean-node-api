import { type Hasher, type AddAccount, type AddAccountModel, type AccountModel, type AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  readonly hasher: Hasher
  readonly addAccountRepository: AddAccountRepository
  constructor (hasher: Hasher, addAccountRepository: AddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const { password } = account
    const hashedPassword = await this.hasher.hash(password)
    const accountCreated = await this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }))
    return new Promise(resolve => { resolve(accountCreated) })
  }
}
