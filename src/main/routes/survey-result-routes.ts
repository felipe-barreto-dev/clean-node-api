import { type Router } from 'express'
import { makeAuthMiddleware, makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories'
import { adaptMiddleware, adaptRoute } from '@/main/adapters'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.put('/surveys/:surveyId/results', adminAuth, adaptRoute(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', adminAuth, adaptRoute(makeLoadSurveyResultController()))
}
