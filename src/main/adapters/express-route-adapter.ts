import { type HttpRequest, type Controller } from '@/presentation/protocols'
import { type Request, type Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httResponse = await controller.handle(httpRequest)
    res.status(httResponse.statusCode).json(httResponse.body)
  }
}
