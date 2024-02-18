import MockDate from 'mockdate'
import { throwError } from '@/domain/test'
import { type Validation } from '@/presentation/protocols'
import { type AddPoll } from '@/domain/usecases'
import { badRequest, noContent, serverError } from '@/presentation/helpers'
import { MissingParamError } from '@/presentation/errors'
import { AddPollController } from '@/presentation/controllers'
interface SutTypes {
  sut: AddPollController
  validationStub: Validation
  addPollStub: AddPoll
}

const mockRequest = (): AddPollController.Request => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAddPoll = (): AddPoll => {
  class AddPollStub implements AddPoll {
    async add (poll: AddPoll.Params): Promise<void> {}
  }
  return new AddPollStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addPollStub = makeAddPoll()
  const sut = new AddPollController(validationStub, addPollStub)

  return {
    sut,
    validationStub,
    addPollStub
  }
}

describe('AddPoll Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(mockRequest())
    expect(validateSpy).toHaveBeenCalledWith({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    })
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call AddPoll with correct values', async () => {
    const { sut, addPollStub } = makeSut()
    const addSpy = jest.spyOn(addPollStub, 'add')
    await sut.handle(mockRequest())
    expect(addSpy).toHaveBeenCalledWith({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    })
  })

  test('Should return 500 if AddPoll returns an error', async () => {
    const { sut, addPollStub } = makeSut()
    jest.spyOn(addPollStub, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
