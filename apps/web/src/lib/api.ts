const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token)
    }
  }

  getToken() {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken')
    }
    return this.token
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    const token = this.getToken()
    if (token) {
      headers['x-access-token'] = token
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.error || `API Error: ${response.statusText}`)
    }

    if (response.status === 204) {
      return null
    }

    return response.json()
  }

  // Auth
  async signup(data: {
    name: string
    email: string
    password: string
    passwordConfirmation: string
    role?: string
  }) {
    return this.request('/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async login(email: string, password: string) {
    const data = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (data?.accessToken) {
      this.setToken(data.accessToken)
    }
    return data
  }

  async logout() {
    this.clearToken()
  }

  // Polls
  async getPolls() {
    return this.request('/polls')
  }

  async createPoll(data: {
    question: string
    options: Array<{ image: string; option: string }>
  }) {
    return this.request('/polls', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async vote(pollId: string, option: string) {
    return this.request(`/polls/${pollId}/results`, {
      method: 'PUT',
      body: JSON.stringify({ option }),
    })
  }

  async getPollResult(pollId: string) {
    return this.request(`/polls/${pollId}/results`)
  }
}

export const api = new ApiClient(API_URL)
