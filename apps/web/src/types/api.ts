export interface Account {
  id: string
  name: string
  email: string
  role?: string
}

export interface AuthResponse {
  accessToken: string
  name: string
}

export interface PollOption {
  image: string
  option: string
}

export interface Poll {
  id: string
  question: string
  options: PollOption[]
  date: string
}

export interface PollResultOption extends PollOption {
  count: number
  percent: number
  isCurrentAccountOption: boolean
}

export interface PollResult {
  pollId: string
  question: string
  options: PollResultOption[]
  date: string
}

export interface SignupData {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  role?: string
}

export interface LoginData {
  email: string
  password: string
}
