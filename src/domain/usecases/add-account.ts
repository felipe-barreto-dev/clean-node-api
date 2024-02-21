import { type AccountModel } from '../models/account'

export type AddAccountParams = Omit<AccountModel, 'id'>
export interface AddAccount {
  add: (account: AddAccount.Params) => Promise<AddAccount.Result>
}

export namespace AddAccount {
  export type Params = {
    name: string
    email: string
    password: string
    role: string
  }

  export type Result = {
    name: string
    email: string
    password: string
  }
}
