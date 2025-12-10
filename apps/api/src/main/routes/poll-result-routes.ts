import { type Router } from 'express'
import { makeAuthMiddleware, makeLoadPollResultController, makeSavePollResultController } from '@/main/factories'
import { adaptMiddleware, adaptRoute } from '@/main/adapters'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.put('/polls/:pollId/results', adminAuth, adaptRoute(makeSavePollResultController()))
  router.get('/polls/:pollId/results', adminAuth, adaptRoute(makeLoadPollResultController()))
}
