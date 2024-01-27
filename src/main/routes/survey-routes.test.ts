import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { type Collection } from 'mongodb'
import env from '../config/env'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 204 on add survey success', async () => {
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
        .post('/api/surveys')
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

    test('Should return 403 on add survey with invalid token', async () => {
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
        .post('/api/surveys')
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

    test('Should return 403 on add survey without access-token', async () => {
      await request(app)
        .post('/api/surveys')
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
