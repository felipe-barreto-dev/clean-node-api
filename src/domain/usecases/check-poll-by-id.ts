export interface CheckPollById {
  checkById: (id: string) => Promise<CheckPollById.Result>
}

export namespace CheckPollById {
  export type Result = boolean
}
