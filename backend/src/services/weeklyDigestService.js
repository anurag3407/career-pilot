import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.model.js';
import TrackedJob from '../models/TrackedJob.model.js';

import { GoogleGenerativeAI } from '@google/generative-ai';

import cron from 'node-cron';

import {
  sendWeeklyDigestEmail
} from './mailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash'
});

const escapeHtml = (unsafe = '') => {
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

const generateWeeklyInsights = async (user, trackedJobs) => {
  try {
    const recentJobs = trackedJobs.slice(0, 5);

    const prompt = `
You are a career coach AI.

Generate a concise weekly career digest for this user.

User Role: ${user.jobRole}
Skills: ${user.skills?.join(', ') || 'Not specified'}
Experience: ${user.yearsOfExperience} years

Recent tracked jobs:
${recentJobs.map((job, index) => `
${index + 1}.
Title: ${job.title}
Company: ${job.company}
Status: ${job.status}
Location: ${job.location}
`).join('\n')}

Return STRICTLY in this format:

MARKET_TRENDS:
- point 1
- point 2

PERSONALIZED_TIPS:
- point 1
- point 2

SKILL_RECOMMENDATIONS:
- skill 1
- skill 2
- skill 3

Keep response concise.
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error('Error generating weekly insights:', error);

    return `
MARKET_TRENDS:
- Hiring demand remains steady for ${user.jobRole} roles.
- Companies continue prioritizing practical skills and project experience.

PERSONALIZED_TIPS:
- Continue applying consistently to relevant positions.
- Strengthen portfolio projects and resume impact metrics.

SKILL_RECOMMENDATIONS:
- System Design
- Communication
- Problem Solving
`;
  }
};

const buildDigestHtml = async ({
  user,
  insights,
  trackedJobs
}) => {
  const templatePath = path.join(
    __dirname,
    '../templates/emails/weekly-digest.html'
  );

  let template = await fs.readFile(templatePath, 'utf-8');

  const trackedJobsHtml = trackedJobs
    .slice(0, 5)
    .map((job) => `
      <li>
        <strong>${escapeHtml(job.title)}</strong>
        at ${escapeHtml(job.company)}
        (${escapeHtml(job.status)})
      </li>
    `)
    .join('');

  template = template
    .replace(
    '{{USER_NAME}}',
    escapeHtml(user.username)
     )
    .replace(
    '{{INSIGHTS}}',
    escapeHtml(insights).replace(/\n/g, '<br>')
    )
    .replace('{{TRACKED_JOBS}}', trackedJobsHtml);

return template;
};

export const generateWeeklyDigestForUser = async (user) => {
  const trackedJobs = await TrackedJob.find({
    userId: user.uid
  })
    .sort({ updatedAt: -1 })
    .limit(10);

  const insights = await generateWeeklyInsights(
    user,
    trackedJobs
  );

  const html = await buildDigestHtml({
    user,
    insights,
    trackedJobs
  });

  return {
    insights,
    html
  };
};

export const getWeeklyDigestUsers = async () => {
  return User.find({
    'notificationPreferences.jobAlerts': true
  });
};

export const sendWeeklyDigests = async () => {
    try {
      console.log('Starting weekly digest generation...');
  
      const users = await getWeeklyDigestUsers();
  
      console.log(`Found ${users.length} users for digest`);
  
      for (const user of users) {
        try {
          const { html } =
            await generateWeeklyDigestForUser(user);
  
          await sendWeeklyDigestEmail({
            userEmail: user.email,
            userName: user.username,
            html
          });
  
          console.log(
            `Weekly digest sent to ${user.email}`
          );
        } catch (error) {
          console.error(
            `Failed weekly digest for ${user.email}:`,
            error.message
          );
        }
      }
  
      console.log('Weekly digest process completed');
    } catch (error) {
      console.error(
        'Weekly digest scheduler failed:',
        error
      );
    }
  };
  
  export const scheduleWeeklyDigest = () => {
    const schedule = '0 9 * * 1';
  
    console.log(
      `Weekly digest scheduled with cron: ${schedule}`
    );
  
    cron.schedule(
        schedule,
        async () => {
          console.log(
            'Weekly digest cron triggered'
          );
      
          await sendWeeklyDigests();
        },
        {
          timezone:
            process.env.WEEKLY_DIGEST_TIMEZONE || 'UTC'
        }
      );
  };