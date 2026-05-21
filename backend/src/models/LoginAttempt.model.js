import mongoose from 'mongoose';
import softDelete from '../middleware/softDelete.js';

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

loginAttemptSchema.add({ isDeleted: { type: Boolean, default: false }, deletedAt: { type: Date, default: null } });
loginAttemptSchema.plugin(softDelete);

export default mongoose.model('LoginAttempt', loginAttemptSchema);
