/**
 * CareerPilot Chrome Extension Popup Logic
 *
 * The apply moment: extract the listing, score it against the user's master
 * profile, then either save it or save it and open the application packet on
 * the job board.
 */

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'you', 'are', 'will', 'have', 'this', 'that',
  'our', 'your', 'their', 'from', 'was', 'were', 'has', 'had', 'not', 'but',
  'all', 'can', 'who', 'what', 'how', 'why', 'job', 'role', 'work', 'team',
  'teams', 'company', 'candidate', 'candidates', 'experience', 'years',
  'year', 'strong', 'plus', 'ability', 'skills', 'skill', 'including',
  'working', 'across', 'about', 'into', 'more', 'than', 'also', 'new',
  'other', 'any', 'each', 'may', 'should', 'must', 'would', 'could', 'per',
  'etc', 'via', 'using', 'use', 'used', 'help', 'need', 'needs', 'want',
  'apply', 'applying', 'position', 'opportunity', 'benefits', 'required',
  'requirements', 'responsibilities', 'preferred', 'qualifications',
  'everyone', 'equal', 'employer', 'consideration', 'without', 'regard',
]);

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#. ]/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^\.+|\.+$/g, ''))
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t) && !/^\d+$/.test(t));
}

function distinct(tokens) {
  return [...new Set(tokens)];
}

/**
 * Keyword-overlap match between the listing and the master profile.
 * Returns { score (0-100), matchedCount, total, missing[] }.
 */
function computeMatch(profile, job) {
  const profileTokens = new Set(
    tokenize(profile?.masterResumeText).concat(tokenize((profile?.targetRoles || []).join(' '))),
  );
  const jdTokens = distinct(tokenize(`${job.title || ''} ${job.description || ''}`)).slice(0, 120);
  if (!jdTokens.length || profileTokens.size === 0) return null;

  const matched = jdTokens.filter((t) => profileTokens.has(t));
  const missing = jdTokens.filter((t) => !profileTokens.has(t)).slice(0, 6);
  return {
    score: Math.round((matched.length / jdTokens.length) * 100),
    matchedCount: matched.length,
    total: jdTokens.length,
    missing,
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('jobForm');
  const alertBox = document.getElementById('alertBox');
  const connectionBadge = document.getElementById('connectionBadge');
  const toggleSettings = document.getElementById('toggleSettings');
  const settingsPanel = document.getElementById('settingsPanel');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const apiUrlInput = document.getElementById('apiUrl');
  const appUrlInput = document.getElementById('appUrl');
  const authTokenInput = document.getElementById('authToken');
  const matchPanel = document.getElementById('matchPanel');
  const matchScore = document.getElementById('matchScore');
  const matchBar = document.getElementById('matchBar');
  const matchDetail = document.getElementById('matchDetail');
  const openPacketBtn = document.getElementById('openPacketBtn');

  // Load saved settings
  const settings = await chrome.storage.sync.get(['apiUrl', 'appUrl', 'authToken']);
  if (settings.apiUrl) apiUrlInput.value = settings.apiUrl;
  if (settings.appUrl) appUrlInput.value = settings.appUrl;
  if (settings.authToken) authTokenInput.value = settings.authToken;

  toggleSettings.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
  });

  saveSettingsBtn.addEventListener('click', async () => {
    await chrome.storage.sync.set({
      apiUrl: apiUrlInput.value.trim() || 'http://localhost:5000',
      appUrl: appUrlInput.value.trim() || 'http://localhost:5173',
      authToken: authTokenInput.value.trim(),
    });
    showAlert('Settings saved successfully!', 'success');
    settingsPanel.classList.add('hidden');
  });

  async function getAuthHeaders() {
    const { authToken } = await chrome.storage.sync.get(['authToken']);
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) {
      headers['Authorization'] = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
    }
    return headers;
  }

  function getApiUrl() {
    return apiUrlInput.value.trim() || 'http://localhost:5000';
  }

  function getAppUrl() {
    return appUrlInput.value.trim() || 'http://localhost:5173';
  }

  // Query active tab and extract job details
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_JOB' }, async (response) => {
        if (chrome.runtime.lastError || !response) {
          return;
        }

        if (response.title) document.getElementById('jobTitle').value = response.title;
        if (response.company) document.getElementById('company').value = response.company;
        if (response.location) document.getElementById('location').value = response.location;
        if (response.salary) document.getElementById('salary').value = response.salary;

        window._extractedJob = response;
        connectionBadge.innerText = response.source || 'Detected';
        connectionBadge.classList.add('success');

        // The apply moment — score the listing against the master profile.
        try {
          const res = await fetch(`${getApiUrl()}/api/career-profile`, {
            method: 'GET',
            headers: await getAuthHeaders(),
          });
          const json = await res.json();
          const profile = json?.data || json?.profile;
          const match = computeMatch(profile, response);
          if (match) {
            matchPanel.classList.remove('hidden');
            matchScore.textContent = `${match.score}%`;
            matchBar.style.width = `${Math.min(100, match.score)}%`;
            matchBar.style.background = match.score >= 60 ? '#16a34a' : match.score >= 35 ? '#CC420C' : '#dc2626';
            matchDetail.textContent = match.missing.length
              ? `Missing from your profile: ${match.missing.join(', ')}`
              : `${match.matchedCount}/${match.total} keywords matched — strong fit.`;
          } else {
            matchPanel.classList.remove('hidden');
            matchScore.textContent = '—';
            matchDetail.textContent = 'Set a master resume in Career Profile to see matches here.';
          }
        } catch (err) {
          matchPanel.classList.remove('hidden');
          matchDetail.textContent = 'Could not reach CareerPilot — check the token in settings.';
        }
      });
    }
  } catch (err) {
    console.warn('Could not query active tab:', err);
  }

  async function saveJob() {
    const title = document.getElementById('jobTitle').value.trim();
    const company = document.getElementById('company').value.trim();
    const location = document.getElementById('location').value.trim();
    const salary = document.getElementById('salary').value.trim();
    const status = document.getElementById('status').value;
    const notes = document.getElementById('notes').value.trim();

    const payload = {
      title,
      company,
      location,
      salary,
      status,
      notes,
      url: window._extractedJob?.url || '',
      description: window._extractedJob?.description || '',
      jobId: window._extractedJob?.jobId || undefined,
    };

    const res = await fetch(`${getApiUrl()}/api/jobs/track`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `Server returned ${res.status}`);
    }
    return res.json();
  }

  // Primary action: save + open the packet on the board.
  openPacketBtn.addEventListener('click', async () => {
    openPacketBtn.disabled = true;
    openPacketBtn.querySelector('span').innerText = 'Saving…';
    try {
      const json = await saveJob();
      const jobId = json?.data?.id;
      showAlert('Saved! Opening the application packet…', 'success');
      setTimeout(() => {
        chrome.tabs.create({
          url: `${getAppUrl()}/job-tracker${jobId ? `?job=${jobId}&packet=1` : ''}`,
        });
        window.close();
      }, 900);
    } catch (err) {
      showAlert(`Error: ${err.message}`, 'error');
      openPacketBtn.disabled = false;
      openPacketBtn.querySelector('span').innerText = 'Save & build the packet →';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    saveBtn.innerText = 'Saving...';

    try {
      await saveJob();
      showAlert('Job saved to your CareerPilot tracker!', 'success');
      setTimeout(() => window.close(), 1500);
    } catch (err) {
      showAlert(`Error: ${err.message}`, 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerText = 'Save to CareerPilot';
    }
  });

  function showAlert(msg, type) {
    alertBox.innerText = msg;
    alertBox.className = `alert-box ${type}`;
    alertBox.classList.remove('hidden');
  }
});
