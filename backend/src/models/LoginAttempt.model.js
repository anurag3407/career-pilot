import mongoose from 'mongoose';
import { softDeletePlugin } from '../middleware/softDelete.js';

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

// Apply soft delete plugin
loginAttemptSchema.plugin(softDeletePlugin);

export default mongoose.model('LoginAttempt', loginAttemptSchema);
