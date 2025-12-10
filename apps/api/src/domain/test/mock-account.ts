import { faker } from '@faker-js/faker'
import { type AccountModel } from '../models'
import { type Authentication, type AddAccountParams } from '../usecases'

export const mockAccountModel = (): AccountModel => ({
  email: faker.internet.email(),
  id: faker.database.mongodbObjectId(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
  role: faker.company.name()
})

export const mockAddAccountParams = (): AddAccountParams => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
  role: faker.company.name()
})

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
