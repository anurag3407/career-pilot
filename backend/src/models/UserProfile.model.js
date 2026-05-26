import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  // 🚀 ADDED FOR PORTFOLIO SELECTION BY SLUG
  slug: {
    type: String,
    unique: true,
    sparse: true, // Allows profiles without portfolios to remain null without breaking uniqueness
    trim: true,
    lowercase: true,
  },
  // 🚀 ADDED FOR PORTFOLIO SEO CUSTOMIZATION
  seoSettings: {
    customRobotsTxt: {
      type: String,
      default: '', // Empty means fallback to default generation
    },
    blockSearchEngines: {
      type: Boolean,
      default: false, // Ensure we don't block engines by default
    }
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
