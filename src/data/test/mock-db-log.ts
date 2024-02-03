import { type LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub {
    async logError (stack: string): Promise<void> {
      return new Promise(resolve => { resolve() })
    }
  }
  return new LogErrorRepositoryStub()
}
