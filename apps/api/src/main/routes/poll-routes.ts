import { type Router } from 'express'
import { adaptMiddleware, adaptRoute } from '@/main/adapters'
import { makeAddPollController, makeAuthMiddleware, makeLoadPollsController } from '@/main/factories'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/polls', adminAuth, adaptRoute(makeAddPollController()))
  router.get('/polls', adminAuth, adaptRoute(makeLoadPollsController()))
}
