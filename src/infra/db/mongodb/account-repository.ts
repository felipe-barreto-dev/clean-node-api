import { type AccountModel } from '@/domain/models'
import { type AddAccountParams } from '@/domain/usecases'
import { MongoHelper } from './helpers/mongo-helper'
import { ObjectId } from 'mongodb'
import { type AddAccountRepository, type LoadAccountByEmailRepository, type LoadAccountByTokenRepository, type UpdateAccessTokenRepository } from '@/data/protocols'

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

  async add (accountData: AddAccountParams): Promise<AccountModel> {
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
