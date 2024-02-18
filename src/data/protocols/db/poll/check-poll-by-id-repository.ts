export interface CheckPollByIdRepository {
  checkById: (pollId: string) => Promise<boolean>
}
