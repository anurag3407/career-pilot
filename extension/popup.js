/**
 * CareerPilot Chrome Extension Popup Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('jobForm');
  const alertBox = document.getElementById('alertBox');
  const connectionBadge = document.getElementById('connectionBadge');
  const toggleSettings = document.getElementById('toggleSettings');
  const settingsPanel = document.getElementById('settingsPanel');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const apiUrlInput = document.getElementById('apiUrl');
  const authTokenInput = document.getElementById('authToken');

  // Load saved settings
  const settings = await chrome.storage.sync.get(['apiUrl', 'authToken']);
  if (settings.apiUrl) apiUrlInput.value = settings.apiUrl;
  if (settings.authToken) authTokenInput.value = settings.authToken;

  toggleSettings.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
  });

  saveSettingsBtn.addEventListener('click', async () => {
    await chrome.storage.sync.set({
      apiUrl: apiUrlInput.value.trim() || 'http://localhost:5000',
      authToken: authTokenInput.value.trim(),
    });
    showAlert('Settings saved successfully!', 'success');
    settingsPanel.classList.add('hidden');
  });

  // Query active tab and extract job details
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_JOB' }, (response) => {
        if (chrome.runtime.lastError || !response) {
          // Content script not yet injected or unsupported page
          return;
        }

        if (response.title) document.getElementById('jobTitle').value = response.title;
        if (response.company) document.getElementById('company').value = response.company;
        if (response.location) document.getElementById('location').value = response.location;
        if (response.salary) document.getElementById('salary').value = response.salary;
        
        window._extractedJob = response;
        connectionBadge.innerText = response.source || 'Detected';
        connectionBadge.classList.add('success');
      });
    }
  } catch (err) {
    console.warn('Could not query active tab:', err);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    saveBtn.innerText = 'Saving...';

    const title = document.getElementById('jobTitle').value.trim();
    const company = document.getElementById('company').value.trim();
    const location = document.getElementById('location').value.trim();
    const salary = document.getElementById('salary').value.trim();
    const status = document.getElementById('status').value;
    const notes = document.getElementById('notes').value.trim();

    const currentSettings = await chrome.storage.sync.get(['apiUrl', 'authToken']);
    const apiUrl = currentSettings.apiUrl || 'http://localhost:5000';
    const authToken = currentSettings.authToken || '';

    const payload = {
      title,
      company,
      location,
      salary,
      status,
      notes,
      url: window._extractedJob?.url || '',
      description: window._extractedJob?.description || '',
    };

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
      }

      const res = await fetch(`${apiUrl}/api/jobs/track`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Server returned ${res.status}`);
      }

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
