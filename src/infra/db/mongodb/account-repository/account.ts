import { type AddAccountRepository } from '@/data/protocols/db/add-account-repository'
import { type AccountModel } from '@/domain/models/account'
import { type AddAccountModel } from '@/domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { type LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const createdAccountId = result.insertedId
    const createdAccount = await accountCollection.findOne({ _id: createdAccountId })
    const account = {
      id: createdAccount._id.toString(),
      name: createdAccount.name,
      email: createdAccount.email,
      password: createdAccount.password
    }
    return account
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({ email })
    if (!result) {
      return null
    }
    const account = {
      id: result._id.toString(),
      name: result.name,
      email: result.email,
      password: result.password
    }
    return account
  }
}
