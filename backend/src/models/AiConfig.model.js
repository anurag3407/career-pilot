import mongoose from 'mongoose';
import softDelete from '../middleware/softDelete.js';

const aiConfigSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    index: true,
  },
  provider: {
    type: String,
    default: '',
    trim: true,
  },
  apiKeyEncrypted: {
    type: String,
    default: '',
  },
  model: {
    type: String,
    default: '',
    trim: true,
  },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
}, { timestamps: true });

// Partial unique index on uid for soft-deleted docs
aiConfigSchema.index({ uid: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });

aiConfigSchema.plugin(softDelete);

export default mongoose.model('AiConfig', aiConfigSchema);
