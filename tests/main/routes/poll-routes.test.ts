import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { type Collection } from 'mongodb'
import env from '@/main/config/env'
import { sign } from 'jsonwebtoken'

let pollCollection: Collection
let accountCollection: Collection

describe('Poll Routes', () => {
  describe('POST /polls', () => {
    beforeAll(async () => {
      await MongoHelper.connect(env.mongoUrl)
    })

    afterAll(async () => {
      await MongoHelper.disconnect()
    })

    beforeEach(async () => {
      pollCollection = await MongoHelper.getCollection('polls')
      await pollCollection.deleteMany({})
      accountCollection = await MongoHelper.getCollection('accounts')
      await accountCollection.deleteMany({})
    })

    test('Should return 204 on add poll success', async () => {
      const accountCreated = await accountCollection.insertOne({
        name: 'Felipe',
        email: 'felipe@teste.com',
        password: '123',
        role: 'admin'
      })
      const accessToken = sign({ id: accountCreated.insertedId }, env.jwtSecret)
      await accountCollection.updateOne({
        _id: accountCreated.insertedId
      },
      {
        $set: {
          accessToken
        }
      })
      await request(app)
        .post('/api/polls')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question?',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          }]
        })
        .expect(204)
    })

    test('Should return 403 on add poll with invalid token', async () => {
      const accountCreated = await accountCollection.insertOne({
        name: 'Felipe',
        email: 'felipe@teste.com',
        password: '123',
        role: 'admin'
      })
      const accessToken = sign({ id: accountCreated.insertedId }, env.jwtSecret)
      await accountCollection.updateOne({
        _id: accountCreated.insertedId
      },
      {
        $set: {
          accessToken
        }
      })
      await request(app)
        .post('/api/polls')
        .set('x-access-token', 'any_token')
        .send({
          question: 'Question?',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          }]
        })
        .expect(403)
    })

    test('Should return 403 on add poll without access-token', async () => {
      await request(app)
        .post('/api/polls')
        .send({
          question: 'Question?',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          }]
        })
        .expect(403)
    })
  })
})

describe('GET /polls', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    pollCollection = await MongoHelper.getCollection('polls')
    await pollCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return 200 on load polls success', async () => {
    const accountCreated = await accountCollection.insertOne({
      name: 'Felipe',
      email: 'felipe@teste.com',
      password: '123',
      role: 'admin'
    })
    const accessToken = sign({ id: accountCreated.insertedId }, env.jwtSecret)
    await accountCollection.updateOne({
      _id: accountCreated.insertedId
    },
    {
      $set: {
        accessToken
      }
    })
    await request(app)
      .get('/api/polls')
      .set('x-access-token', accessToken)
      .expect(200)
  })

  test('Should return 403 on add poll with invalid token', async () => {
    const accountCreated = await accountCollection.insertOne({
      name: 'Felipe',
      email: 'felipe@teste.com',
      password: '123',
      role: 'admin'
    })
    const accessToken = sign({ id: accountCreated.insertedId }, env.jwtSecret)
    await accountCollection.updateOne({
      _id: accountCreated.insertedId
    },
    {
      $set: {
        accessToken
      }
    })
    await request(app)
      .get('/api/polls')
      .set('x-access-token', 'any_token')
      .expect(403)
  })

  test('Should return 403 on add poll without access-token', async () => {
    await request(app)
      .get('/api/polls')
      .send({
        question: 'Question?',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        }]
      })
      .expect(403)
  })
})
