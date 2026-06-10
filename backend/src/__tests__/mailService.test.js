import { describe, test, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import axios from 'axios';

// We will dynamically import the mailService module with different query strings
// to test both external service configurations and fallback SMTP configurations.

describe('Mail Service', () => {
  beforeEach(() => {
    mock.restoreAll();
  });

  afterEach(() => {
    mock.restoreAll();
  });

  describe('External Vercel Service Path', () => {
    let mailService;

    beforeEach(async () => {
      // Set configuration before importing
      process.env.EMAIL_SERVICE_URL = 'https://fake-email-service.com';
      process.env.EMAIL_API_KEY = 'fake-api-key';
      process.env.FRONTEND_URL = 'https://fake-frontend.com';

      // Load with unique query to bypass module cache
      mailService = await import('../services/mailService.js?test-external');
    });

    test('should send job application email via external service', async () => {
      let capturedUrl = '';
      let capturedData = null;
      let capturedHeaders = null;

      mock.method(axios, 'post', async (url, data, config) => {
        capturedUrl = url;
        capturedData = data;
        capturedHeaders = config.headers;
        return { data: { messageId: 'ext-app-id-1' } };
      });

      const result = await mailService.sendJobApplicationEmail({
        recruiterEmail: 'recruiter@example.com',
        recruiterName: 'John',
        jobTitle: 'Developer',
        companyName: 'Tech Co',
        applicantName: 'Bob',
        applicantEmail: 'bob@example.com',
        applicantPhone: '1234567890',
        resumeUrl: 'https://safe-resume.com/file.pdf',
        message: 'Hello'
      });

      assert.equal(capturedUrl, 'https://fake-email-service.com/api/send-job-application');
      assert.equal(capturedHeaders['X-API-KEY'], 'fake-api-key');
      assert.equal(capturedData.recruiterEmail, 'recruiter@example.com');
      assert.equal(capturedData.jobTitle, 'Developer');
      assert.equal(result.messageId, 'ext-app-id-1');
    });

    test('should propagate external email service errors', async () => {
      mock.method(axios, 'post', async () => {
        throw {
          response: {
            status: 401,
            statusText: 'Unauthorized',
            data: { error: 'Invalid API Key' }
          }
        };
      });

      await assert.rejects(
        async () => {
          await mailService.sendJobApplicationEmail({
            recruiterEmail: 'recruiter@example.com',
            jobTitle: 'Dev',
            companyName: 'Tech',
            applicantName: 'Bob',
            applicantEmail: 'bob@example.com'
          });
        },
        /Email service error: Invalid API Key/
      );
    });

    test('should send job match alert via external service', async () => {
      let capturedUrl = '';
      mock.method(axios, 'post', async (url) => {
        capturedUrl = url;
        return { data: { messageId: 'ext-match-1' } };
      });

      await mailService.sendMatchingJobMail({
        userEmail: 'user@example.com',
        jobTitle: 'Developer',
        companyName: 'Tech Co'
      });

      assert.equal(capturedUrl, 'https://fake-email-service.com/api/send-matching-job');
    });

    test('should send job alerts with multiple jobs via external service', async () => {
      let capturedData = null;
      mock.method(axios, 'post', async (url, data) => {
        capturedData = data;
        return { data: { messageId: 'ext-jobs-1' } };
      });

      await mailService.sendJobAlertEmail({
        userEmail: 'user@example.com',
        userName: 'User',
        alertTitle: 'React Developer',
        jobs: [{ title: 'React Dev', company: 'Google', applyLink: 'https://jobs.google.com' }]
      });

      assert.equal(capturedData.userEmail, 'user@example.com');
      assert.equal(capturedData.jobs.length, 1);
      assert.equal(capturedData.jobs[0].title, 'React Dev');
    });

    test('should reject job alert send if jobs array is empty', async () => {
      await assert.rejects(
        async () => {
          await mailService.sendJobAlertEmail({
            userEmail: 'user@example.com',
            jobs: []
          });
        },
        /No jobs to send/
      );
    });
  });

  describe('Local SMTP Fallback Path', () => {
    let mailService;
    let mockTransporter;

    beforeEach(async () => {
      // Clear configuration to force fallback path
      delete process.env.EMAIL_SERVICE_URL;
      delete process.env.EMAIL_API_KEY;
      process.env.EMAIL_USER = 'test-sender@example.com';
      process.env.FRONTEND_URL = 'https://fake-frontend.com';

      mailService = await import('../services/mailService.js?test-local');

      mockTransporter = {
        sendMail: mock.fn(async (options) => {
          return { messageId: 'smtp-msg-id-123' };
        })
      };

      mailService.__setMockTransport(mockTransporter);
    });

    test('should send job application email via nodemailer fallback', async () => {
      const result = await mailService.sendJobApplicationEmail({
        recruiterEmail: 'recruiter@example.com',
        jobTitle: 'Developer',
        companyName: 'Tech Co',
        applicantName: 'Bob',
        applicantEmail: 'bob@example.com'
      });

      assert.equal(mockTransporter.sendMail.mock.calls.length, 1);
      const mailOptions = mockTransporter.sendMail.mock.calls[0].arguments[0];
      assert.equal(mailOptions.to, 'recruiter@example.com');
      assert.equal(mailOptions.from, 'test-sender@example.com');
      assert.match(mailOptions.subject, /Job Application for Developer - Bob/);
      assert.equal(result.success, true);
      assert.equal(result.messageId, 'smtp-msg-id-123');
    });

    test('should fetch and attach resume pdf if valid resumeUrl is provided', async () => {
      let getRequestUrl = '';
      mock.method(axios, 'get', async (url) => {
        getRequestUrl = url;
        return { data: Buffer.from('mock-pdf-buffer') };
      });

      await mailService.sendJobApplicationEmail({
        recruiterEmail: 'recruiter@example.com',
        jobTitle: 'Developer',
        companyName: 'Tech Co',
        applicantName: 'Bob',
        applicantEmail: 'bob@example.com',
        resumeUrl: 'https://safe-resume.com/my-resume.pdf'
      });

      assert.equal(getRequestUrl, 'https://safe-resume.com/my-resume.pdf');
      assert.equal(mockTransporter.sendMail.mock.calls.length, 1);
      const mailOptions = mockTransporter.sendMail.mock.calls[0].arguments[0];
      assert.equal(mailOptions.attachments.length, 1);
      assert.equal(mailOptions.attachments[0].filename, 'Bob_Resume.pdf');
      assert.deepEqual(mailOptions.attachments[0].content, Buffer.from('mock-pdf-buffer'));
    });

    test('should skip resume attachment if resumeUrl is unsafe', async () => {
      mock.method(axios, 'get', async () => {
        throw new Error('Should not be called');
      });

      await mailService.sendJobApplicationEmail({
        recruiterEmail: 'recruiter@example.com',
        jobTitle: 'Developer',
        companyName: 'Tech Co',
        applicantName: 'Bob',
        applicantEmail: 'bob@example.com',
        resumeUrl: 'http://127.0.0.1/unsafe-resume.pdf' // localhost/private IPs are unsafe
      });

      assert.equal(mockTransporter.sendMail.mock.calls.length, 1);
      const mailOptions = mockTransporter.sendMail.mock.calls[0].arguments[0];
      assert.equal(mailOptions.attachments.length, 0);
    });

    test('should send job match email via nodemailer fallback', async () => {
      await mailService.sendMatchingJobMail({
        userEmail: 'user@example.com',
        userName: 'User',
        jobTitle: 'Developer',
        companyName: 'Tech Co',
        applyLink: 'https://jobs.example.com/123'
      });

      assert.equal(mockTransporter.sendMail.mock.calls.length, 1);
      const mailOptions = mockTransporter.sendMail.mock.calls[0].arguments[0];
      assert.equal(mailOptions.to, 'user@example.com');
      assert.match(mailOptions.html, /https:\/\/jobs\.example\.com\/123/);
    });

    test('should send account lockout alert email', async () => {
      const lockoutDate = new Date();
      await mailService.sendLockoutAlertEmail({
        email: 'user@example.com',
        ip: '192.168.1.1',
        lockoutUntil: lockoutDate
      });

      assert.equal(mockTransporter.sendMail.mock.calls.length, 1);
      const mailOptions = mockTransporter.sendMail.mock.calls[0].arguments[0];
      assert.equal(mailOptions.to, 'user@example.com');
      assert.match(mailOptions.html, /192\.168\.1\.1/);
      assert.match(mailOptions.html, new RegExp(lockoutDate.toUTCString()));
    });

    test('should send verification code email', async () => {
      await mailService.sendVerificationEmail({
        email: 'user@example.com',
        code: '123456'
      });

      assert.equal(mockTransporter.sendMail.mock.calls.length, 1);
      const mailOptions = mockTransporter.sendMail.mock.calls[0].arguments[0];
      assert.equal(mailOptions.to, 'user@example.com');
      assert.match(mailOptions.html, /123456/);
    });

    test('should reject verification email if code or email is missing', async () => {
      await assert.rejects(
        async () => {
          await mailService.sendVerificationEmail({ email: 'user@example.com' });
        },
        /Email and verification code are required/
      );
    });

    test('should send password reset email', async () => {
      await mailService.sendPasswordResetEmail({
        email: 'user@example.com',
        resetLink: 'https://fake-frontend.com/reset-password?token=abc'
      });

      assert.equal(mockTransporter.sendMail.mock.calls.length, 1);
      const mailOptions = mockTransporter.sendMail.mock.calls[0].arguments[0];
      assert.equal(mailOptions.to, 'user@example.com');
      assert.match(mailOptions.html, /https:\/\/fake-frontend\.com\/reset-password\?token=abc/);
    });
  });
});
