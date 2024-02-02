import { type AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { type AccountModel } from '@/domain/models/account'
import { type AddAccountModel } from '@/domain/usecases/add-account'
import { type LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { type UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { type LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    })
    if (!result) {
      return null
    }
    const account = {
      id: result._id.toString(),
      name: result.name,
      email: result.email,
      password: result.password,
      role: result.role,
      accessToken: result.accessToken
    }
    return account
  }

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

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const userId = new ObjectId(id)
    await accountCollection.updateOne(
      { _id: userId },
      { $set: { accessToken: token } }
    )
  }
}
