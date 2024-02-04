import { type Router } from 'express'
import { adaptMiddleware } from '../adapters/express/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeSaveSurveyResultController } from '../factories/controllers/save-survey-result/save-survey-result-controller-factory'
import { makeLoadSurveyResultController } from '../factories/controllers/load-survey-result/load-survey-result-controller-factory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.put('/surveys/:surveyId/results', adminAuth, adaptRoute(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', adminAuth, adaptRoute(makeLoadSurveyResultController()))
}
