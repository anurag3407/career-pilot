import mongoose from 'mongoose';
import { softDeletePlugin } from '../middleware/softDelete.js';

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
}
}, { timestamps: true });

// Apply soft delete plugin
userSchema.plugin(softDeletePlugin);

const User = mongoose.model('User', userSchema);

export default User;