import express from 'express';
import {
  sendJobAlertEmail,
  sendProposalApprovalEmail,
  sendVerificationEmail
} from '../services/mailService.js';

const router = express.Router();

/**
 * Test Endpoint: Send Job Alert Email
 * POST /test-emails/job-alert
 */
router.post('/job-alert', async (req, res) => {
  try {
    const {
      userEmail = 'test@example.com',
      userName = 'Test User',
      alertTitle = 'Senior React Developer',
      jobs = []
    } = req.body;

    // Sample jobs if none provided
    const sampleJobs = jobs.length ? jobs : [
      {
        title: 'Senior React Developer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        jobType: 'Full-time',
        salary: '$150k - $200k',
        description: 'We are looking for an experienced React developer to join our expanding team...',
        postedDate: '2 hours ago',
        applyLink: 'https://example.com/apply/1'
      },
      {
        title: 'React Developer (Remote)',
        company: 'StartupXYZ',
        location: 'Remote',
        jobType: 'Full-time',
        salary: '$120k - $160k',
        description: 'Join our fast-growing startup as a React developer. Work on innovative projects...',
        postedDate: '5 hours ago',
        applyLink: 'https://example.com/apply/2'
      },
      {
        title: 'Frontend Engineer - React',
        company: 'Global Tech',
        location: 'New York, NY',
        jobType: 'Full-time',
        salary: '$140k - $180k',
        description: 'We are seeking a talented Frontend Engineer with React expertise...',
        postedDate: '1 day ago',
        applyLink: 'https://example.com/apply/3'
      }
    ];

    const result = await sendJobAlertEmail({
      userEmail,
      userName,
      alertTitle,
      jobs: sampleJobs
    });

    res.json({
      success: true,
      message: 'Job alert email sent successfully',
      result,
      template: 'jobAlert',
      emailTo: userEmail
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      template: 'jobAlert'
    });
  }
});

/**
 * Test Endpoint: Send Proposal Approval Email
 * POST /test-emails/proposal-approval
 */
router.post('/proposal-approval', async (req, res) => {
  try {
    const {
      studentEmail = 'student@example.com',
      studentName = 'John Student',
      challengeTitle = 'E-commerce Platform Redesign',
      companyName = 'TechStart Inc',
      corporateName = 'Innovation Labs',
      proposedPrice = 50000,
      estimatedDays = 30,
      feedback = 'Great proposal! We love your approach to the design.',
      chatRoomId = 'room-123'
    } = req.body;

    const result = await sendProposalApprovalEmail({
      studentEmail,
      studentName,
      challengeTitle,
      companyName,
      corporateName,
      proposedPrice,
      estimatedDays,
      feedback,
      chatRoomId
    });

    res.json({
      success: true,
      message: 'Proposal approval email sent successfully',
      result,
      template: 'proposalApproval',
      emailTo: studentEmail
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      template: 'proposalApproval'
    });
  }
});

/**
 * Test Endpoint: Send Verification Email
 * POST /test-emails/verification
 */
router.post('/verification', async (req, res) => {
  try {
    const {
      email = 'test@example.com',
      code = '123456'
    } = req.body;

    const result = await sendVerificationEmail({
      email,
      code,
      verificationLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify?code=${code}`
    });

    res.json({
      success: true,
      message: 'Verification email sent successfully',
      result,
      template: 'verification',
      emailTo: email,
      testCode: code
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      template: 'verification'
    });
  }
});

/**
 * Test Endpoint: Get preview of rendered template
 * POST /test-emails/preview/:template
 */
router.post('/preview/:template', async (req, res) => {
  try {
    const { template } = req.params;
    const { renderTemplate } = await import('../services/templateEngine.js');

    const data = req.body;
    const html = renderTemplate(template, data);

    res.json({
      success: true,
      template,
      html,
      size: `${(html.length / 1024).toFixed(2)} KB`
    });
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      template: req.params.template
    });
  }
});

export default router;
