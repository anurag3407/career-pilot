import test, { mock } from 'node:test';
import assert from 'node:assert';
import { 
  __setMockTransport,
  sendJobApplicationEmail,
  sendMatchingJobMail,
  sendJobAlertEmail,
  sendWeeklyDigestEmail,
  sendProposalApprovalEmail,
  sendLockoutAlertEmail,
  sendVerificationEmail
} from '../../src/services/mailService.js';

// Setup mock before running tests
process.env.EMAIL_SERVICE_URL = '';
process.env.EMAIL_API_KEY = '';

let lastMailOptions = null;
__setMockTransport({
  sendMail: async (options) => {
    lastMailOptions = options;
    return { messageId: 'mock-id' };
  }
});

test('Email Templates Snapshot Tests', async (t) => {
  mock.timers.enable({ apis: ['Date'], now: new Date('2023-01-01T12:00:00Z') });
  t.after(() => mock.timers.reset());

  await t.test('sendJobApplicationEmail template', async (st) => {
    await sendJobApplicationEmail({
      recruiterEmail: 'recruiter@example.com',
      recruiterName: 'John Doe',
      jobTitle: 'Software Engineer',
      companyName: 'Tech Corp',
      applicantName: 'Jane Smith',
      applicantEmail: 'jane@example.com',
      applicantPhone: '1234567890',
      message: 'Here is my application.'
    });
    st.assert.snapshot(lastMailOptions.html);
  });

  await t.test('sendMatchingJobMail template', async (st) => {
    await sendMatchingJobMail({
      userEmail: 'user@example.com',
      userName: 'Jane Smith',
      jobTitle: 'Software Engineer',
      companyName: 'Tech Corp',
      jobDescription: 'Great job',
      jobLocation: 'Remote',
      jobType: 'Full-time',
      salary: '$100k',
      applyLink: 'https://example.com/apply',
      postedDate: '2023-01-01'
    });
    st.assert.snapshot(lastMailOptions.html);
  });

  await t.test('sendJobAlertEmail template', async (st) => {
    await sendJobAlertEmail({
      userEmail: 'user@example.com',
      userName: 'Jane Smith',
      alertTitle: 'Software Engineering Jobs',
      jobs: [
        {
          title: 'Frontend Dev',
          company: 'Web Corp',
          location: 'New York',
          applyLink: 'https://example.com/job1'
        },
        {
          title: 'Backend Dev',
          company: 'Data Corp',
          location: 'San Francisco',
          applyLink: 'https://example.com/job2'
        }
      ]
    });
    st.assert.snapshot(lastMailOptions.html);
  });

  await t.test('sendWeeklyDigestEmail template', async (st) => {
    await sendWeeklyDigestEmail({
      userEmail: 'user@example.com',
      userName: 'Jane Smith',
      html: '<h1>Weekly Digest</h1><p>Here are your updates...</p>'
    });
    st.assert.snapshot(lastMailOptions.html);
  });

  await t.test('sendProposalApprovalEmail template', async (st) => {
    await sendProposalApprovalEmail({
      studentEmail: 'student@example.com',
      studentName: 'Jane Smith',
      challengeTitle: 'Build a Website',
      companyName: 'Tech Corp',
      corporateName: 'Tech Corp Inc',
      proposedPrice: 5000,
      estimatedDays: 14,
      feedback: 'Looks good!',
      chatRoomId: 'room123'
    });
    st.assert.snapshot(lastMailOptions.html);
  });

  await t.test('sendLockoutAlertEmail template', async (st) => {
    await sendLockoutAlertEmail({
      email: 'user@example.com',
      ip: '192.168.1.1',
      lockoutUntil: '2023-01-01T12:00:00Z'
    });
    st.assert.snapshot(lastMailOptions.html);
  });

  await t.test('sendVerificationEmail template', async (st) => {
    await sendVerificationEmail({
      email: 'user@example.com',
      code: '123456'
    });
    st.assert.snapshot(lastMailOptions.html);
  });

});
