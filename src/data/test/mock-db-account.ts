import { mockAccountModel } from '@/domain/test'
import { type LoadAccountByEmailRepository, type AccountModel, type AddAccountParams, type AddAccountRepository } from '../usecases/add-account/db-add-account-protocols'
import { type LoadAccountByTokenRepository } from '../protocols/db/account/load-account-by-token-repository'
import { type UpdateAccessTokenRepository } from '../usecases/authentication/db-authentication-protocols'

export class AddAccountRepositorySpy implements AddAccountRepository {
  addAccountParams: AddAccountParams
  result = mockAccountModel()
  async add (addAccountParams: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = addAccountParams
    return Promise.resolve(this.result)
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  email: string
  result = mockAccountModel()
  async loadByEmail (email: string): Promise<AccountModel> {
    this.email = email
    return Promise.resolve(this.result)
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  token: string
  role: string
  result = mockAccountModel()
  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    this.token = token
    this.role = role
    return Promise.resolve(this.result)
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken (id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
  }
}
