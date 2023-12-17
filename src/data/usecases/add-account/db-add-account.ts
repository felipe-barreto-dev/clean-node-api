import { type Encrypter, type AddAccount, type AddAccountModel, type AccountModel } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  readonly encrypter: Encrypter
  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const { password } = account
    await this.encrypter.encrypt(password)
    return new Promise(resolve => { resolve(null) })
  }
}
