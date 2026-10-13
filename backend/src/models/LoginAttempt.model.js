import mongoose from 'mongoose';

const loginAttemptSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    default: null
  },
  attempts: {
    type: Number,
    default: 0
  },
  lockoutUntil: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Index for rate-limit checks combining IP + email
loginAttemptSchema.index({ ip: 1, email: 1 }, { background: true });
loginAttemptSchema.index({ lockoutUntil: 1 }, { background: true, sparse: true });
// Automatically expire login attempt logs after 24 hours of inactivity
loginAttemptSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400, background: true });

export default mongoose.model('LoginAttempt', loginAttemptSchema);
