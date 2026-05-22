import mongoose from 'mongoose';
import softDelete from '../middleware/softDelete.js';

const twoFactorSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
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

twoFactorSchema.add({ isDeleted: { type: Boolean, default: false }, deletedAt: { type: Date, default: null } });

// Partial unique index on uid for soft-deleted docs
twoFactorSchema.index({ uid: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });

twoFactorSchema.plugin(softDelete);

const TwoFactor = mongoose.model('TwoFactor', twoFactorSchema);

export default TwoFactor;
