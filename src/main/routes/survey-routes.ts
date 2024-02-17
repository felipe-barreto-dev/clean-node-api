import { type Router } from 'express'
import { adaptMiddleware, adaptRoute } from '@/main/adapters'
import { makeAddSurveyController, makeAuthMiddleware, makeLoadSurveysController } from '@/main/factories'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', adminAuth, adaptRoute(makeLoadSurveysController()))
}
