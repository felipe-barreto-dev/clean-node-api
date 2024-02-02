import { type AddAccountParams , type AccountModel } from '../../../usecases/add-account/db-add-account-protocols'

export interface AddAccountRepository {
  add: (accountData: AddAccountParams) => Promise<AccountModel>
}
