import mongoose from 'mongoose';

const loginAttemptSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true,
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

export default mongoose.model('LoginAttempt', loginAttemptSchema);
