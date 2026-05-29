import { auth } from '../config/firebase'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

async function getAuthHeaders() {
  console.log('📡 getAuthHeaders: VITE_DEV_BYPASS_AUTH =', import.meta.env.VITE_DEV_BYPASS_AUTH);
  if (import.meta.env.VITE_DEV_BYPASS_AUTH === 'true' || import.meta.env.VITE_DEV_BYPASS_AUTH === true) {
    return {
      Authorization: `Bearer dev-token`,
      'Content-Type': 'application/json'
    }
  }

  const user = auth.currentUser

  if (!user) {
    throw new Error('Not authenticated')
  }

  const token = await user.getIdToken()

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

async function handleResponse(response) {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data
}

export const uploadApi = {
  async uploadPdf(file) {
    let token = 'dev-token'
    const isBypass = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true' || import.meta.env.VITE_DEV_BYPASS_AUTH === true;
    if (!isBypass) {
      const user = auth.currentUser

      if (!user) {
        throw new Error('Not authenticated')
      }

      token = await user.getIdToken()
    }

    const formData = new FormData()
    formData.append('resume', file)

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    return handleResponse(response)
  }
}

export const resumeApi = {
  async getAll() {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/resumes`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  }
}

export const jobTrackerApi = {
  async getAll() {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/job-tracker`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  }
}

// ============ TWO-FACTOR AUTH API ============
export const twoFactorApi = {
  async getStatus() {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/auth/2fa/status`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async setup() {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/auth/2fa/setup`, {
      method: 'POST',
      headers
    })

    return handleResponse(response)
  },

  async enable(secret, token) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/auth/2fa/enable`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ secret, token })
    })

    return handleResponse(response)
  },

  async disable(token) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/auth/2fa/disable`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ token })
    })

    return handleResponse(response)
  },

  async verify(token) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/auth/2fa/verify`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ token })
    })

    return handleResponse(response)
  },

  async verifyBackup(code) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/auth/2fa/verify-backup`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ code })
    })

    return handleResponse(response)
  },

  async regenerateBackupCodes(token) {
    const headers = await getAuthHeaders()

    const response = await fetch(
      `${API_BASE}/auth/2fa/backup-codes/regenerate`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ token })
      }
    )

    return handleResponse(response)
  }
}

// ============ JOB ALERTS API ============
export const jobAlertsApi = {
  async getAll() {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/job-alerts`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async getById(alertId) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/job-alerts/${alertId}`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async create(alertData) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/job-alerts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(alertData)
    })

    return handleResponse(response)
  },

  async update(alertId, alertData) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/job-alerts/${alertId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(alertData)
    })

    return handleResponse(response)
  },

  async delete(alertId) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/job-alerts/${alertId}`, {
      method: 'DELETE',
      headers
    })

    return handleResponse(response)
  },

  async toggle(alertId) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/job-alerts/${alertId}/toggle`, {
      method: 'POST',
      headers
    })

    return handleResponse(response)
  }
}
// ============ ENHANCE API ============
export const enhanceApi = {
  async enhance(resumeText, preferences) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/enhance`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, preferences })
    })

    return handleResponse(response)
  },

  async generateSummary(resumeText, jobRole) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/enhance/summary`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, jobRole })
    })

    return handleResponse(response)
  },

  async getSuggestions(resumeText, jobRole) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/enhance/suggestions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, jobRole })
    })

    return handleResponse(response)
  },

  async analyzeATS(resumeText, jobRole) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/enhance/ats-analysis`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, jobRole })
    })

    return handleResponse(response)
  }
}
// ============ JOBS API ============
export const jobsApi = {
  async search(query, filters = {}) {
    const headers = await getAuthHeaders()

    const params = new URLSearchParams({
      query,
      ...filters
    })

    const response = await fetch(
      `${API_BASE}/fetchjobs?${params.toString()}`,
      {
        method: 'GET',
        headers
      }
    )

    return handleResponse(response)
  }
}

// ============ COMMUNITY API ============
export const communityApi = {
  // ---- Channels ----
  async getChannels(type = 'all') {
    const headers = await getAuthHeaders()

    const response = await fetch(
      `${API_BASE}/community/channels?type=${type}`,
      {
        method: 'GET',
        headers
      }
    )

    return handleResponse(response)
  },

  async getChannel(channelId) {
    const headers = await getAuthHeaders()

    const response = await fetch(
      `${API_BASE}/community/channels/${channelId}`,
      {
        method: 'GET',
        headers
      }
    )

    return handleResponse(response)
  },

  async createChannel(data) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/community/channels`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })

    return handleResponse(response)
  },

  async joinChannel(channelId) {
    const headers = await getAuthHeaders()

    const response = await fetch(
      `${API_BASE}/community/channels/${channelId}/join`,
      {
        method: 'POST',
        headers
      }
    )

    return handleResponse(response)
  },

  async leaveChannel(channelId) {
    const headers = await getAuthHeaders()

    const response = await fetch(
      `${API_BASE}/community/channels/${channelId}/leave`,
      {
        method: 'POST',
        headers
      }
    )

    return handleResponse(response)
  },

  // ---- Posts ----
  async getPosts(params = {}) {
    const headers = await getAuthHeaders()
    const query = new URLSearchParams(params).toString()

    const response = await fetch(
      `${API_BASE}/community/posts?${query}`,
      {
        method: 'GET',
        headers
      }
    )

    return handleResponse(response)
  },

  async createPost(data) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/community/posts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })

    return handleResponse(response)
  },

  async deletePost(postId) {
    const headers = await getAuthHeaders()

    const response = await fetch(
      `${API_BASE}/community/posts/${postId}`,
      {
        method: 'DELETE',
        headers
      }
    )

    return handleResponse(response)
  },

  // ---- Comments ----
  async getComments(postId) {
    const headers = await getAuthHeaders()

    const response = await fetch(
      `${API_BASE}/community/posts/${postId}/comments`,
      {
        method: 'GET',
        headers
      }
    )

    return handleResponse(response)
  },

  async createComment(postId, data) {
    const headers = await getAuthHeaders()

    const response = await fetch(
      `${API_BASE}/community/posts/${postId}/comments`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      }
    )

    return handleResponse(response)
  },

  async toggleLikePost(postId) {
    const headers = await getAuthHeaders()

    const response = await fetch(
      `${API_BASE}/community/posts/${postId}/like`,
      {
        method: 'POST',
        headers
      }
    )

    return handleResponse(response)
  }
}

// ============ USER PROFILE API ============
export const userProfileApi = {
  async getMyProfile() {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/user-profiles/me`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async updateMyProfile(data) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/user-profiles/me`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    })

    return handleResponse(response)
  },

  async getMyStats() {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/user-profiles/me/stats`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async getMyActivity() {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/user-profiles/me/activity`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async getMyRecommendations() {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/user-profiles/me/recommendations`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async getProfile(uid) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/user-profiles/${uid}`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async getStats(uid) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/user-profiles/${uid}/stats`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async getActivity(uid) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/user-profiles/${uid}/activity`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  }
}

// ============ INTERVIEW API ============
export const interviewApi = {
  async startInterview(formData) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/interview/start`, {
      method: 'POST',
      headers,
      body: JSON.stringify(formData)
    })

    return handleResponse(response)
  },

  async submitAnswer(interviewId, data) {
    const headers = await getAuthHeaders()

    const response = await fetch(
      `${API_BASE}/interview/${interviewId}/answer`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      }
    )

    return handleResponse(response)
  },

  async completeInterview(interviewId) {
    const headers = await getAuthHeaders()

    const response = await fetch(
      `${API_BASE}/interview/${interviewId}/complete`,
      {
        method: 'POST',
        headers
      }
    )

    return handleResponse(response)
  },

  async getInterview(interviewId) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/interview/${interviewId}`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async getHistory() {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/interview/history`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  }
}

// ============ FELLOWSHIP API ============
export const fellowshipApi = {
  async getProfile() {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/fellowship/profile`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async createProfile(data) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/fellowship/profile`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })

    return handleResponse(response)
  },

  async sendVerificationEmail(email) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/fellowship/verify/send-email`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email })
    })

    return handleResponse(response)
  },

  async confirmVerification(code) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/fellowship/verify/confirm`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ code })
    })

    return handleResponse(response)
  },

  async getChallenges(params = {}) {
    const headers = await getAuthHeaders()
    const query = new URLSearchParams(params).toString()

    const response = await fetch(`${API_BASE}/fellowship/challenges?${query}`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async getChallenge(id) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/fellowship/challenges/${id}`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async createChallenge(data) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/fellowship/challenges`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })

    return handleResponse(response)
  },

  async getMyChallenges() {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/fellowship/my-challenges`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async deleteChallenge(challengeId) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/fellowship/challenges/${challengeId}`, {
      method: 'DELETE',
      headers
    })

    return handleResponse(response)
  },

  async applyToChallenge(challengeId, data) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/fellowship/challenges/${challengeId}/apply`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })

    return handleResponse(response)
  },

  async getMyProposals() {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/fellowship/my-proposals`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async getChallengeProposals(challengeId) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/fellowship/challenges/${challengeId}/proposals`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async updateProposalStatus(proposalId, status, feedback) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/fellowship/proposals/${proposalId}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status, feedback })
    })

    return handleResponse(response)
  },

  async getStats() {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/fellowship/stats`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async getChatRooms() {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/fellowship/chat/rooms`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async getChatRoom(roomId) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/fellowship/chat/rooms/${roomId}`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async getChatMessages(roomId, before = null) {
    const headers = await getAuthHeaders()

    const url = before
      ? `${API_BASE}/fellowship/chat/rooms/${roomId}/messages?before=${before}`
      : `${API_BASE}/fellowship/chat/rooms/${roomId}/messages`

    const response = await fetch(url, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  },

  async sendChatMessage(roomId, content) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/fellowship/chat/rooms/${roomId}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ content })
    })

    return handleResponse(response)
  }
}

// ============ NOTIFICATION API ============
export const notificationApi = {
  async getPreferences() {
    const headers = await getAuthHeaders()

    const response = await fetch(
      `${API_BASE}/auth/notification-preferences`,
      {
        method: 'GET',
        headers
      }
    )

    return handleResponse(response)
  },

  async updatePreferences(preferences) {
    const headers = await getAuthHeaders()

    const response = await fetch(
      `${API_BASE}/auth/notification-preferences`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(preferences)
      }
    )

    return handleResponse(response)
  }
}

// ============ PAYMENT API ============
export const paymentApi = {
  // Create Razorpay order
  async createOrder(proposalId) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ proposalId })
    })

    return handleResponse(response)
  },

  // Verify payment
  async verifyPayment(data) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/payments/verify-payment`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })

    return handleResponse(response)
  },

  // Release escrow funds
  async releaseFunds(roomId) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/payments/release-funds/${roomId}`, {
      method: 'POST',
      headers
    })

    return handleResponse(response)
  },

  // Get payment status
  async getStatus(roomId) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_BASE}/payments/status/${roomId}`, {
      method: 'GET',
      headers
    })

    return handleResponse(response)
  }
}

// ============ PORTFOLIO API ============
export const portfolioApi = {
  async getAll() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/portfolio`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  async create(data) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/portfolio`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async delete(id) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/portfolio/${id}`, {
      method: 'DELETE',
      headers
    })
    return handleResponse(response)
  }
}