# CareerPilot - 1-Click Job Tracker Chrome Extension

A Manifest V3 browser extension that lets you capture job listings from **LinkedIn, Indeed, Greenhouse, and Lever** and sync them directly into your CareerPilot Kanban application tracker in one click.

---

## Features
- **Auto-Extraction**: Detects job title, company, location, salary range, and job description directly from the DOM.
- **Direct Kanban Sync**: Posts straight to `POST /api/jobs/track` or Supabase `tracked_jobs`.
- **Status Selection**: Save as `Saved / Wishlist`, `Applied`, `Interviewing`, or `Offer Received`.
- **Custom API Endpoint**: Works with your local development server (`http://localhost:5000`) or production deployment.

---

## How to Install in Chrome / Brave / Edge

1. Open your browser and navigate to:
   - Chrome / Brave: `chrome://extensions`
   - Edge: `edge://extensions`
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** in the top-left corner.
4. Select the `extension/` directory inside this repository.
5. The **CareerPilot** extension icon will appear in your extensions toolbar!

---

## Usage
1. Open any job posting on **LinkedIn**, **Indeed**, **Greenhouse**, or **Lever**.
2. Click the CareerPilot extension icon.
3. The job details will be pre-filled automatically.
4. (Optional) Set your Auth Token in **Settings** (copy from CareerPilot Settings or use default local dev auth).
5. Click **Save to CareerPilot**. The job is now on your Kanban board!
