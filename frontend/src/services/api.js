const API_BASE = '/v1'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

async function request(endpoint, options = {}) {
  const apiKey = localStorage.getItem('neo_api_key')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (apiKey) {
    headers['X-API-Key'] = apiKey
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new ApiError(data.detail || data.error || 'Erro na requisicao', response.status)
  }

  return response.json()
}

export const auth = {
  async register(email, password) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  async login(email, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },
}

export const user = {
  async getMe() {
    return request('/me')
  },

  async getUsage() {
    return request('/me/usage')
  },

  async submitIntent(wouldSubscribe, feedback) {
    return request('/me/subscription-intent', {
      method: 'POST',
      body: JSON.stringify({ would_subscribe: wouldSubscribe, feedback }),
    })
  },

  async initPurchase(tokensAmount, provider = 'stripe') {
    return request('/tokens/purchase/init', {
      method: 'POST',
      body: JSON.stringify({ tokens_amount: tokensAmount, provider }),
    })
  },

  async submitSurvey(usage, circuits, payment, consent = true) {
    return request('/user/submit-survey', {
      method: 'POST',
      body: JSON.stringify({
        usage,
        circuits,
        payment,
        consent,
      }),
    })
  },
}

export const admin = {
  async getOverview() {
    return request('/admin/overview')
  },

  async getUsers() {
    return request('/admin/users')
  },

  async getUsage() {
    return request('/admin/usage')
  },

  async invalidateCache(backendName) {
    const query = backendName ? `?backend_name=${encodeURIComponent(backendName)}` : ''
    return request(`/admin/spam-cache/invalidate${query}`, {
      method: 'POST',
    })
  },

  async getSurveys() {
    return request('/admin/surveys')
  },
}

export { ApiError }
