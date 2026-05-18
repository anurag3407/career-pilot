import mongoose from 'mongoose';

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

const TwoFactor = mongoose.model('TwoFactor', twoFactorSchema);

export default TwoFactor;
