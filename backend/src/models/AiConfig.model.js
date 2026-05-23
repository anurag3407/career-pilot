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

export default mongoose.model('AiConfig', aiConfigSchema);
