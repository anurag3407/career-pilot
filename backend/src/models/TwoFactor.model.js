import mongoose from 'mongoose';
import { softDeletePlugin } from '../middleware/softDelete.js';

const twoFactorSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  secret: {
    type: String,
    default: null,
    select: false
  },
  enabled: {
    type: Boolean,
    default: false
  },
  backupCodes: {
    type: [String],
    default: [],
    select: false
  }
}, { timestamps: true });

// Apply soft delete plugin
twoFactorSchema.plugin(softDeletePlugin);

const TwoFactor = mongoose.model('TwoFactor', twoFactorSchema);

export default TwoFactor;
