import mongoose from 'mongoose';

const aiConfigSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
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
}, { timestamps: true });

aiConfigSchema.index({ uid: 1, provider: 1 }, { background: true });

export default mongoose.model('AiConfig', aiConfigSchema);
