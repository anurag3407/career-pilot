import mongoose from 'mongoose';

const portfolioVersionSchema = new mongoose.Schema({
  portfolioId: {
    type: String,
    required: true,
    index: true,
  },
  version: {
    type: Number,
    required: true,
  },
  changes: {
    type: mongoose.Schema.Types.Mixed, // Stores the diff
    default: null,
  },
  snapshot: {
    type: mongoose.Schema.Types.Mixed, // Stores full data if diff is not possible or for major versions
    default: null,
  },
  createdBy: {
    type: String,
    required: true,
  },
}, { timestamps: { createdAt: true, updatedAt: false } });

// Index for quick retrieval and uniqueness of versions for a portfolio
portfolioVersionSchema.index({ portfolioId: 1, version: -1 }, { unique: true });

export default mongoose.model('PortfolioVersion', portfolioVersionSchema);
