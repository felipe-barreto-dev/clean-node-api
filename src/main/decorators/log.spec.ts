import { type Controller, type HttpRequest, type HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from './log'
import { ok, serverError } from '@/presentation/helpers'
import { type LogErrorRepository } from '@/data/protocols/db/log-error-repository'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return ok(httpRequest.body)
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub {
    async logError (stack: string): Promise<void> {
      return new Promise(resolve => { resolve() })
    }
  }
  return new LogErrorRepositoryStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('Should calls controller handle method', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        email: 'any@email.com',
        name: 'any_name',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
  test('Should returns the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        name: 'any_name',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(httpRequest.body))
  })
  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => { resolve(error) }))
    const httpRequest = {
      body: {
        email: 'any@email.com',
        name: 'any_name',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
