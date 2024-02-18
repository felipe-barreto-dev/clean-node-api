import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { type Collection } from 'mongodb'
import env from '@/main/config/env'
import { sign } from 'jsonwebtoken'

let pollCollection: Collection
let accountCollection: Collection

describe('Poll Result Routes', () => {
  describe('PUT /polls/:pollId/results', () => {
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

    test('Should return 403 on save poll result without accessToken', async () => {
      await request(app)
        .put('/api/polls/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save poll result with accessToken', async () => {
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
      const res = await pollCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answer 2'
        }],
        date: new Date()
      })
      await request(app)
        .put(`/api/polls/${res.insertedId.toHexString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 2'
        })
        .expect(200)
    })
  })

  describe('GET /polls/:pollId/results', () => {
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

    test('Should return 403 on load poll result without accessToken', async () => {
      await request(app)
        .get('/api/polls/any_id/results')
        .expect(403)
    })

    test('Should return 200 on load poll result with accessToken', async () => {
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
      const res = await pollCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answer 2'
        }],
        date: new Date()
      })
      await request(app)
        .get(`/api/polls/${res.insertedId.toHexString()}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
