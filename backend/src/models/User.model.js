import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address']
  },
  jobRole: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  collegeStudent: {
    type: Boolean,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  notificationPreferences: {
    jobAlerts: { type: Boolean, default: true },
    directMessages: { type: Boolean, default: true },
    proposalUpdates: { type: Boolean, default: true },
  },
  //  NEW FIELDS FOR ONBOARDING CHECKLIST
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  onboardingProgress: {
    type: Map,
    of: Boolean,
    default: {
      resume_uploaded: false,
      resume_enhanced: false,
      github_connected: false,
      portfolio_created: false,
      portfolio_deployed: false,
      job_alerts_setup: false
    }
  },
  checklistDismissed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

export default User;