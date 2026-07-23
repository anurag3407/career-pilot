# CareerPilot — LinkedIn Importer Chrome Extension

This browser extension allows 1-click import of your LinkedIn profile directly into **CareerPilot** without hitting any rate limits or bot blocks.

## How to Install (Unpacked Extension)

1. Open **Google Chrome** (or Brave / Edge / Arc).
2. Go to `chrome://extensions` in your address bar.
3. Enable **Developer mode** (toggle switch in the top right corner).
4. Click **Load unpacked** (top left corner).
5. Select the `extension/` folder located in your `career-pilot` repository:
   `career-pilot/extension`

## How to Use

1. Navigate to your LinkedIn profile: `https://www.linkedin.com/in/your-username`
2. Click the **CareerPilot Importer** extension icon in your Chrome toolbar.
3. Configure your CareerPilot backend URL (default: `http://localhost:5000`).
4. (Optional) Paste your JWT authorization token if your app backend has authentication enabled.
5. Click **Import Profile to CareerPilot**.
6. Done! Your profile experience, education, skills, and about text are automatically converted into a structured resume in CareerPilot.
