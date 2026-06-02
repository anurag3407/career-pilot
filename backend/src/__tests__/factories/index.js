const defaultTimestamp = '2026-01-01T00:00:00.000Z';

export const createMockUser = (overrides = {}) => ({
  _id: 'user-1',
  username: 'testuser',
  email: 'test.user@example.com',
  password: 'Passw0rdTest',
  role: 'user',
  jobRole: 'Software Engineer',
  gender: '',
  yearsOfExperience: 2,
  collegeStudent: false,
  skills: ['JavaScript', 'Node.js'],
  notificationPreferences: {
    jobAlerts: true,
    directMessages: true,
    proposalUpdates: true,
  },
  createdAt: defaultTimestamp,
  updatedAt: defaultTimestamp,
  ...overrides,
});

export const createMockJob = (overrides = {}) => ({
  _id: 'job-1',
  title: 'Software Engineer',
  company: 'Acme Corp',
  description: 'Build and maintain scalable backend services.',
  location: {
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    isRemote: false,
  },
  jobType: 'hybrid',
  employmentType: 'full-time',
  salary: {
    min: 600000,
    max: 1200000,
    currency: 'INR',
    period: 'yearly',
  },
  applyLink: 'https://example.com/jobs/software-engineer',
  recruiterEmail: 'recruiter@example.com',
  requiredSkills: ['JavaScript', 'Node.js', 'MongoDB'],
  preferredSkills: ['React', 'Docker'],
  experienceLevel: 'junior',
  source: {
    platform: 'manual',
    url: 'https://example.com/jobs/software-engineer',
    scrapedAt: defaultTimestamp,
  },
  isActive: true,
  expiresAt: '2026-12-31T00:00:00.000Z',
  createdAt: defaultTimestamp,
  updatedAt: defaultTimestamp,
  ...overrides,
});

export const createMockResume = (overrides = {}) => ({
  _id: 'resume-1',
  userId: 'user-1',
  originalText: 'Experienced software engineer with JavaScript and Node.js skills.',
  enhancedText: 'Results-driven software engineer experienced in building scalable applications.',
  jobRole: 'Software Engineer',
  atsScore: 85,
  preferences: {
    yearsOfExperience: 2,
    skills: ['JavaScript', 'Node.js'],
    industry: 'Technology',
    customInstructions: '',
  },
  title: 'Software Engineer Resume',
  pdfUrl: null,
  createdAt: defaultTimestamp,
  lastModified: defaultTimestamp,
  ...overrides,
});

export const createMockInterview = (overrides = {}) => ({
  _id: 'interview-1',
  userId: 'user-1',
  jobRole: 'Software Engineer',
  industry: 'Technology',
  experienceLevel: 'junior',
  questionCount: 10,
  questions: [],
  createdAt: defaultTimestamp,
  updatedAt: defaultTimestamp,
  ...overrides,
});

export const makeMockJobs = (count = 1, prefix = 'job') =>
  Array.from({ length: count }, (_, index) =>
    createMockJob({
      _id: `${prefix}-${index + 1}`,
      title: `Software Engineer ${index + 1}`,
      company: `Company ${index + 1}`,
      applyLink: `https://example.com/jobs/${prefix}-${index + 1}`,
    })
  );

export const createMockRequestResponse = (body = {}, query = {}, params = {}) => {
  const req = { body, query, params };

  const res = {
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      return this;
    },
  };

  return { req, res };
};