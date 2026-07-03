import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  displayName: {
    type: String,
    default: '',
    maxlength: 100,
    trim: true,
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500,
    trim: true,
  },
  jobRole: {
    type: String,
    default: '',
    maxlength: 100,
    trim: true,
  },
  skills: [{
    type: String,
    trim: true,
    maxlength: 50,
  }],
  location: {
    type: String,
    default: '',
    maxlength: 100,
    trim: true,
  },
  website: {
    type: String,
    default: '',
    maxlength: 200,
    trim: true,
  },
  github: {
    type: String,
    default: '',
    maxlength: 100,
    trim: true,
  },
  linkedin: {
    type: String,
    default: '',
    maxlength: 200,
    trim: true,
  },
  // Cloud URL of the user's uploaded avatar (Firebase Storage /avatars/{uid})
  avatarUrl: {
    type: String,
    default: '',
    maxlength: 500,
    trim: true,
  },
  phone: {
    type: String,
    default: '',
    maxlength: 30,
    trim: true,
    select: false,
  },
  // Short tagline shown under the display name
  headline: {
    type: String,
    default: '',
    maxlength: 120,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    default: null,
    select: false,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary', 'prefer-not-to-say', 'other', ''],
    default: '',
    select: false,
  },
  // Current employer / company
  company: {
    type: String,
    default: '',
    maxlength: 100,
    trim: true,
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
    min: 0,
  },
  collegeStudent: {
    type: Boolean,
    default: false,
  },
  // Availability flag surfaced to recruiters / community
  openToWork: {
    type: Boolean,
    default: false,
  },
  education: [{
    institution: { type: String, trim: true, maxlength: 150 },
    degree: { type: String, trim: true, maxlength: 100 },
    field: { type: String, trim: true, maxlength: 100 },
    startYear: { type: Number, min: 1900, max: 2100 },
    endYear: { type: Number, min: 1900, max: 2100 },
  }],
  languages: [{
    type: String,
    trim: true,
    maxlength: 50,
  }],
  // Longer professional summary, distinct from the social bio
  resumeHeadline: {
    type: String,
    default: '',
    maxlength: 300,
    trim: true,
  },
  projects: [{
    githubRepoUrl: {
      type: String,
      trim: true,
    },
    isManuallyEdited: {
      type: Boolean,
      default: false,
    },
    lastSyncedAt: {
      type: Date,
    },
    autoData: {
      description: {
        type: String,
        default: '',
      },
      readme: {
        type: String,
        default: '',
      }
    }
  }],
}, { timestamps: true });

userProfileSchema.index({ uid: 1, updatedAt: -1 }, { background: true });
userProfileSchema.index({ jobRole: 1 }, { background: true });
userProfileSchema.index({ location: 1 }, { background: true });
userProfileSchema.index({ skills: 1 }, { background: true });

export default mongoose.model('UserProfile', userProfileSchema);
