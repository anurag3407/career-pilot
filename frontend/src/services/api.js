import { auth } from '../config/firebase'

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// Helper to get auth headers
async function getAuthHeaders() {
  const user = auth.currentUser
  if (!user) throw new Error('Not authenticated')


  const token = await user.getIdToken()
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

// Helper to handle API responses
async function handleResponse(response) {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong')
  }
  return data
}

// ============ AUTH API ============
export const authApi = {
  // Verify token
  async verifyToken() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers
    })
    return handleResponse(response)
  },

  // Get user profile
  async getProfile() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  }
}

// ============ UPLOAD API ============
export const uploadApi = {
  // Upload PDF and extract text
  async uploadPdf(file) {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')


    const token = await user.getIdToken()
    const formData = new FormData()
    formData.append('resume', file)


    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    return handleResponse(response)
  },

  // Extract text from PDF (re-process)
  async extractText(file) {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')


    const token = await user.getIdToken()
    const formData = new FormData()
    formData.append('resume', file)


    const response = await fetch(`${API_BASE}/upload/extract-text`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    return handleResponse(response)
  }
}

// ============ RESUME API ============
export const resumeApi = {
  // Get all resumes
  async getAll() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/resumes`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  // Get single resume
  async getById(resumeId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/resumes/${resumeId}`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  // Create resume
  async create(data) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/resumes`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  // Update resume
  async update(resumeId, data) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/resumes/${resumeId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  // Delete resume
  async delete(resumeId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/resumes/${resumeId}`, {
      method: 'DELETE',
      headers
    })
    return handleResponse(response)
  },

  // Download resume as PDF
  async downloadPdf(resumeId, version = 'enhanced') {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const token = await user.getIdToken()
    const response = await fetch(`${API_BASE}/resumes/${resumeId}/download?version=${version}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to download PDF')
    }

    return response.blob()
  }
}

// ============ ENHANCE API ============
export const enhanceApi = {
  // Enhance resume with AI
  async enhance(resumeText, preferences) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/enhance`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, preferences })
    })
    return handleResponse(response)
  },

  // Generate summary only
  async generateSummary(resumeText, jobRole) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/enhance/summary`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, jobRole })
    })
    return handleResponse(response)
  },

  // Get improvement suggestions
  async getSuggestions(resumeText, jobRole) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/enhance/suggestions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, jobRole })
    })
    return handleResponse(response)
  },

  // Analyze ATS score
  async analyzeATS(resumeText, jobRole) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/enhance/ats-analysis`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, jobRole })
    })
    return handleResponse(response)
  },

  // Comprehensive resume analysis (Senior Expert Level)
  async comprehensiveAnalysis(resumeText, jobRole) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/enhance/comprehensive-analysis`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, jobRole })
    })
    return handleResponse(response)
  },

  // Analyze individual bullet points
  async analyzeBullets(resumeText, jobRole) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/enhance/analyze-bullets`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, jobRole })
    })
    return handleResponse(response)
  },

  // Generate before/after comparison
  async beforeAfter(resumeText, jobRole, analysisResults = {}) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/enhance/before-after`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, jobRole, analysisResults })
    })
    return handleResponse(response)
  },

  // Get power/weak verb lists
  async getVerbLists() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/enhance/verb-lists`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  // Generate job application emails
  async generateEmail(data) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/enhance/generate-email`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  }
}

// ============ JOBS API ============
export const jobsApi = {
  // Search jobs with query
  async search(query, filters = {}) {
    const headers = await getAuthHeaders()
    const params = new URLSearchParams({ query, ...filters })
    const response = await fetch(`${API_BASE}/fetchjobs?${params}`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  }
}

// ============ JOB TRACKER API ============
export const jobTrackerApi = {
  // Get all tracked jobs
  async getAll() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/job-tracker`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  // Track a new job application
  async track(jobData) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/job-tracker`, {
      method: 'POST',
      headers,
      body: JSON.stringify(jobData)
    })
    return handleResponse(response)
  },

  // Update job application status
  async updateStatus(jobId, status, notes = '') {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/job-tracker/${jobId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status, notes })
    })
    return handleResponse(response)
  },

  // Delete tracked job
  async delete(jobId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/job-tracker/${jobId}`, {
      method: 'DELETE',
      headers
    })
    return handleResponse(response)
  },

  // Research a company
  async researchCompany(companyName, industry = '') {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/job-tracker/research`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ companyName, industry })
    })
    return handleResponse(response)
  },

  // Get job tracker stats
  async getStats() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/job-tracker/stats`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  }
}

// ============ JOB ALERTS API ============
export const jobAlertsApi = {
  // Get all job alerts (1-indexed)
  async getAll() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/job-alerts`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  // Get single alert with notification history
  async getById(alertId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/job-alerts/${alertId}`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  // Create new job alert
  async create(alertData) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/job-alerts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(alertData)
    })
    return handleResponse(response)
  },

  // Update job alert
  async update(alertId, alertData) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/job-alerts/${alertId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(alertData)
    })
    return handleResponse(response)
  },

  // Delete job alert
  async delete(alertId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/job-alerts/${alertId}`, {
      method: 'DELETE',
      headers
    })
    return handleResponse(response)
  },

  // Toggle alert active status
  async toggle(alertId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/job-alerts/${alertId}/toggle`, {
      method: 'POST',
      headers
    })
    return handleResponse(response)
  },

  // Trigger test fetch for an alert
  async test(alertId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/job-alerts/${alertId}/test`, {
      method: 'POST',
      headers
    })
    return handleResponse(response)
  },

  // Get alerts summary stats
  async getStats() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/job-alerts/stats/summary`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  }
}

// ============ COMMUNITY API ============
export const communityApi = {
  // ---- Channels ----
  async getChannels(type = 'all') {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/channels?type=${type}`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  async getChannel(channelId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/channels/${channelId}`, {
      method: 'GET',
      headers
    })
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
    const response = await fetch(`${API_BASE}/community/channels/${channelId}/join`, {
      method: 'POST',
      headers
    })
    return handleResponse(response)
  },

  async leaveChannel(channelId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/channels/${channelId}/leave`, {
      method: 'POST',
      headers
    })
    return handleResponse(response)
  },

  async getChannelMessages(channelId, page = 1) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/channels/${channelId}/messages?page=${page}`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  // ---- Posts ----
  async getPosts(params = {}) {
    const headers = await getAuthHeaders()
    const queryParams = new URLSearchParams(params).toString()
    const response = await fetch(`${API_BASE}/community/posts?${queryParams}`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  async getPost(postId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/posts/${postId}`, {
      method: 'GET',
      headers
    })
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

  async updatePost(postId, data) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/posts/${postId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async deletePost(postId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/posts/${postId}`, {
      method: 'DELETE',
      headers
    })
    return handleResponse(response)
  },

  async toggleLikePost(postId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/posts/${postId}/like`, {
      method: 'POST',
      headers
    })
    return handleResponse(response)
  },

  async getScheduledPosts() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/posts/scheduled/mine`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  async cancelScheduledPost(postId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/posts/${postId}/schedule`, {
      method: 'DELETE',
      headers
    })
    return handleResponse(response)
  },

  // ---- Comments ----
  async getComments(postId, page = 1) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/posts/${postId}/comments?page=${page}`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  async createComment(postId, data) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/posts/${postId}/comments`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async toggleLikeComment(commentId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/comments/${commentId}/like`, {
      method: 'POST',
      headers
    })
    return handleResponse(response)
  },

  // ---- Direct Messages ----
  async getConversations() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/conversations`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  async getConversationMessages(conversationId, page = 1) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/conversations/${conversationId}/messages?page=${page}`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  // ---- Presence ----
  async getOnlineUsers() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/online-users`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  // ---- Search ----
  async search(query, type = 'all') {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/community/search?q=${encodeURIComponent(query)}&type=${type}`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  }
}

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
    const response = await fetch(`${API_BASE}/interview/${interviewId}/answer`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async completeInterview(interviewId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/interview/${interviewId}/complete`, {
      method: 'POST',
      headers
    })
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

// ============ USER PROFILE API ============
export const userProfileApi = {
  async getMyProfile() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/user-profiles/me`, { method: 'GET', headers })
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
    const response = await fetch(`${API_BASE}/user-profiles/me/stats`, { method: 'GET', headers })
    return handleResponse(response)
  },

  async getMyActivity() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/user-profiles/me/activity`, { method: 'GET', headers })
    return handleResponse(response)
  },

  async getProfile(uid) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/user-profiles/${uid}`, { method: 'GET', headers })
    return handleResponse(response)
  },

  async getStats(uid) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/user-profiles/${uid}/stats`, { method: 'GET', headers })
    return handleResponse(response)
  },

  async getActivity(uid) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/user-profiles/${uid}/activity`, { method: 'GET', headers })
    return handleResponse(response)
  },
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

  async verifyLogin(email, token, useBackup) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/auth/2fa/verify-login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, token, useBackup })
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
    const response = await fetch(`${API_BASE}/auth/2fa/backup-codes/regenerate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ token })
    })
    return handleResponse(response)
  }
}


// ============ PAYMENT API ============
export const paymentApi = {
  // Create Razorpay order for proposal acceptance
  async createOrder(proposalId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ proposalId })
    })
    return handleResponse(response)
  },

  // Verify payment after Razorpay checkout
  async verifyPayment(data) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/payments/verify-payment`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  // Release funds from escrow
  async releaseFunds(roomId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/payments/release-funds/${roomId}`, {
      method: 'POST',
      headers
    })
    return handleResponse(response)
  },

  // Get payment status for a room
  async getStatus(roomId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/payments/status/${roomId}`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  }
  
}
// ============ NOTIFICATION PREFERENCES API ============
export const notificationApi = {
  async getPreferences() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/auth/notification-preferences`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  async updatePreferences(preferences) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/auth/notification-preferences`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(preferences)
    })
    return handleResponse(response)
  }
}
