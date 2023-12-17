import { type Encrypter } from '@/data/protocols/encrypter-protocol'
import { type AccountModel } from '@/domain/models/account'
import { type AddAccountModel, type AddAccount } from '@/domain/usecases/add-account'

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
