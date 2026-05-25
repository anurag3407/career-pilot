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
    required: false,
    default: '',
  },
  gender: {
    type: String,
    required: false,
    default: '',
  },
  yearsOfExperience: {
    type: Number,
    required: false,
    default: 0,
  },
  collegeStudent: {
    type: Boolean,
    required: false,
    default: false,
  },
  skills: {
    type: [String],
    required: false,
    default: [],
  },
  notificationPreferences: {
    jobAlerts: { type: Boolean, default: true },
    directMessages: { type: Boolean, default: true },
    proposalUpdates: { type: Boolean, default: true },
  }
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true, background: true });
userSchema.index({ jobRole: 1 }, { background: true });
userSchema.index({ collegeStudent: 1 }, { background: true });
userSchema.index({ jobRole: 1, yearsOfExperience: 1 }, { background: true });
userSchema.index({ skills: 1 }, { background: true });

const User = mongoose.model('User', userSchema);

export default User;