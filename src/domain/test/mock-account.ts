import { faker } from '@faker-js/faker'
import { type AccountModel } from '../models'
import { type AuthenticationParams, type AddAccountParams } from '../usecases'

export const mockAccountModel = (): AccountModel => ({
  email: faker.internet.email(),
  id: faker.database.mongodbObjectId(),
  name: faker.person.fullName(),
  password: faker.internet.password()
})

export const mockAddAccountParams = (): AddAccountParams => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password()
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
