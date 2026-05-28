import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    slug: { type: String, required: true },
    sections: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

portfolioSchema.index({ userId: 1, slug: 1 }, { unique: true });

export default mongoose.model('Portfolio', portfolioSchema);
