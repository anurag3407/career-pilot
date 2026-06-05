// In-memory mock database store for local development when MongoDB is offline
import { v4 as uuidv4 } from 'uuid';

const store = {
  portfolios: [],
  resumes: [],
  trackedJobs: [],
  profiles: {},
  twoFactor: {}
};

export const devDb = {
  // --- Portfolios ---
  getPortfolios: (userId) => {
    return store.portfolios.filter(p => p.userId === userId);
  },
  
  createPortfolio: (userId, data) => {
    const newPortfolio = {
      id: uuidv4(),
      userId,
      title: data.title || '',
      description: data.description || '',
      deployedUrl: data.deployedUrl || '',
      isDeployed: data.isDeployed === true || data.isDeployed === 'true',
      createdAt: new Date().toISOString()
    };
    store.portfolios.unshift(newPortfolio);
    return newPortfolio;
  },
  
  deletePortfolio: (userId, id) => {
    const initialLength = store.portfolios.length;
    store.portfolios = store.portfolios.filter(p => !(p.id === id && p.userId === userId));
    return store.portfolios.length < initialLength;
  },

  // --- Resumes ---
  getResumes: (userId) => {
    return store.resumes.filter(r => r.userId === userId);
  },

  createResume: (userId, data) => {
    const newResume = {
      id: uuidv4(),
      userId,
      title: data.title || `Resume - ${new Date().toLocaleDateString()}`,
      originalText: data.originalText || '',
      enhancedText: data.enhancedText || null,
      jobRole: data.jobRole || null,
      preferences: data.preferences || {},
      pdfUrl: data.pdfUrl || null,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    store.resumes.unshift(newResume);
    return newResume;
  },

  // --- Job Tracker ---
  getTrackedJobs: (userId) => {
    return store.trackedJobs.filter(j => j.userId === userId);
  },

  createTrackedJob: (userId, data) => {
    const newJob = {
      id: uuidv4(),
      userId,
      company: data.company || '',
      position: data.position || '',
      status: data.status || 'applied',
      dateApplied: data.dateApplied || new Date().toISOString(),
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };
    store.trackedJobs.unshift(newJob);
    return newJob;
  },

  // --- Two-Factor ---
  getTwoFactorStatus: (uid) => {
    const record = store.twoFactor[uid] || { enabled: false, backupCodes: [] };
    return {
      enabled: record.enabled,
      backupCodesRemaining: record.backupCodes?.length || 0
    };
  },

  // --- User Profiles ---
  getProfile: (uid, email, name) => {
    if (!store.profiles[uid]) {
      store.profiles[uid] = {
        uid,
        displayName: name || email?.split('@')[0] || 'Developer',
        bio: 'In-memory fallback developer profile',
        jobRole: 'AI Engineer',
        skills: ['React', 'Node.js', 'MongoDB', 'AI'],
        location: 'Remote',
        website: '',
        github: '',
        linkedin: ''
      };
    }
    return store.profiles[uid];
  },

  updateProfile: (uid, updates) => {
    if (!store.profiles[uid]) {
      store.profiles[uid] = { uid };
    }
    store.profiles[uid] = {
      ...store.profiles[uid],
      ...updates
    };
    return store.profiles[uid];
  }
};
