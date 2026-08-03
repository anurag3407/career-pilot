import mongoose from 'mongoose';

const roastSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    // Deterministic scores from atsScorer.js
    overallScore: { type: Number, required: true },
    breakdown: {
      formatting: { type: Number, default: 0 },
      keywordMatch: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      skills: { type: Number, default: 0 },
    },
    sectionsFound: { type: [String], default: [] },
    // AI roast payload
    tagline: { type: String, default: '' },
    ratings: {
      buzzwordDensity: { type: Number, default: 0 },
      actionVerbs: { type: Number, default: 0 },
      quantifiedAchievements: { type: Number, default: 0 },
      formatting: { type: Number, default: 0 },
    },
    roast: { type: String, default: '' },
    silverLinings: { type: [String], default: [] },
    quickWins: { type: [String], default: [] },
    emoji: { type: String, default: '🔥' },
    jobRole: { type: String, default: '' },
    // Metadata
    resumeLength: { type: Number, default: 0 },
    provider: { type: String, default: '' },
    shareToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // We do NOT persist the raw resume text for privacy — only its hash
    resumeHash: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

roastSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('ResumeRoast', roastSchema);