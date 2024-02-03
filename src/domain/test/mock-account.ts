import { type AccountModel } from '../models'
import { type AddAccountParams } from '../usecases'

export const mockAccountModel = (): AccountModel => ({
  email: 'any_email@mail.com',
  id: 'any_id',
  name: 'any_name',
  password: 'any_password'
})

export const mockAddAccountParams = (): AddAccountParams => ({
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'any_password'
})
