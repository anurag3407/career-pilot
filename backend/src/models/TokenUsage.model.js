import mongoose from 'mongoose';

const tokenUsageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  promptTokens: {
    type: Number,
    default: 0,
  },
  completionTokens: {
    type: Number,
    default: 0,
  },
  totalTokens: {
    type: Number,
    default: 0,
  },
  service: {
    type: String,
    required: true,
  },
}, { timestamps: true });

tokenUsageSchema.index({ userId: 1, createdAt: -1 }, { background: true });
tokenUsageSchema.index({ userId: 1, provider: 1, createdAt: -1 }, { background: true });

const TokenUsage = mongoose.model('TokenUsage', tokenUsageSchema);

export default TokenUsage;