import { type AddAccountRepository } from '@/data/protocols/db/add-account-repository'
import { type AccountModel } from '@/domain/models/account'
import { type AddAccountModel } from '@/domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
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
}
