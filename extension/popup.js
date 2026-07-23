document.addEventListener('DOMContentLoaded', () => {
  const importBtn = document.getElementById('importBtn');
  const statusEl = document.getElementById('status');
  const apiUrlInput = document.getElementById('apiUrl');
  const tokenInput = document.getElementById('authToken');

  // Load saved configurations
  chrome.storage.local.get(['careerPilotApiUrl', 'careerPilotToken'], (result) => {
    if (result.careerPilotApiUrl) apiUrlInput.value = result.careerPilotApiUrl;
    if (result.careerPilotToken) tokenInput.value = result.careerPilotToken;
  });

  // Save changes
  apiUrlInput.addEventListener('change', () => {
    chrome.storage.local.set({ careerPilotApiUrl: apiUrlInput.value });
  });
  tokenInput.addEventListener('change', () => {
    chrome.storage.local.set({ careerPilotToken: tokenInput.value });
  });

  importBtn.addEventListener('click', async () => {
    const apiUrl = apiUrlInput.value.trim().replace(/\/$/, '');
    const token = tokenInput.value.trim();

    statusEl.className = '';
    statusEl.innerText = 'Extracting LinkedIn data...';
    importBtn.disabled = true;

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab.url.includes('linkedin.com/in/')) {
        throw new Error('Please navigate to a LinkedIn profile page (linkedin.com/in/...) first.');
      }

      chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_PROFILE' }, async (response) => {
        if (!response || !response.success) {
          statusEl.className = 'error';
          statusEl.innerText = 'Failed to extract profile. Refresh LinkedIn page & retry.';
          importBtn.disabled = false;
          return;
        }

        statusEl.innerText = 'Sending to CareerPilot...';

        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        try {
          const res = await fetch(`${apiUrl}/api/resumes/import/linkedin`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              url: response.url,
              profile: response.profile
            })
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || 'Server error importing profile');
          }

          statusEl.className = 'success';
          statusEl.innerText = '✓ Profile imported into CareerPilot!';
        } catch (err) {
          statusEl.className = 'error';
          statusEl.innerText = err.message;
        } finally {
          importBtn.disabled = false;
        }
      });
    } catch (err) {
      statusEl.className = 'error';
      statusEl.innerText = err.message;
      importBtn.disabled = false;
    }
  });
});
