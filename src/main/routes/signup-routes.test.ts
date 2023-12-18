import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
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
