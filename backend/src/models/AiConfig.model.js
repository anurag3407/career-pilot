import mongoose from 'mongoose';
import { softDeletePlugin } from '../middleware/softDelete.js';

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

// Apply soft delete plugin
aiConfigSchema.plugin(softDeletePlugin);

export default mongoose.model('AiConfig', aiConfigSchema);
