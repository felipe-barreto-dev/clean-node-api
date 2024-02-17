import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { type Collection } from 'mongodb'
import { hash } from 'bcrypt'
import env from '@/main/config/env'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Felipe',
          email: 'felipe@teste.com',
          password: 'Teste123!',
          passwordConfirmation: 'Teste123!'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('Teste123!', 12)
      await accountCollection.insertOne({
        name: 'Felipe',
        email: 'felipe@teste.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'felipe@teste.com',
          password: 'Teste123!'
        })
        .expect(200)
    })

    test('Should return 401 on login fails', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'felipe@teste.com',
          password: 'Teste123!'
        })
        .expect(401)
    })
  })
})
