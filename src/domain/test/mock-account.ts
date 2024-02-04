import { faker } from '@faker-js/faker'
import { type AccountModel } from '../models'
import { type AuthenticationParams, type AddAccountParams } from '../usecases'

export const mockAccountModel = (): AccountModel => ({
  email: 'any_email@mail.com',
  id: 'any_id',
  name: 'any_name',
  password: 'any_password'
})

export const mockAddAccountParams = (): AddAccountParams => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password()
})

export const mockFakeAuthentication = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})
