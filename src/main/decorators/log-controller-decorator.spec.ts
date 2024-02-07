import { type Controller, type HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'
import { ok, serverError } from '@/presentation/helpers'
import { LogErrorRepositorySpy } from '@/data/test'
import { faker } from '@faker-js/faker'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (request: any): Promise<HttpResponse> {
      return ok(request.body)
    }
  }
  return new ControllerStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositorySpy: LogErrorRepositorySpy
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositorySpy)

  return {
    sut,
    controllerStub,
    logErrorRepositorySpy
  }
}

describe('LogController Decorator', () => {
  test('Should calls controller handle method', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const request = faker.lorem.lines()
    await sut.handle(request)
    expect(handleSpy).toHaveBeenCalledWith(request)
  })
  test('Should returns the same result of the controller', async () => {
    const { sut } = makeSut()
    const request = {
      body: {
        email: 'any@email.com',
        name: 'any_name',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(request.body))
  })
  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositorySpy } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(error))
    const request = {
      body: {
        email: 'any@email.com',
        name: 'any_name',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    }
    await sut.handle(request)
    expect(logErrorRepositorySpy.stack).toBe('any_stack')
  })
})
