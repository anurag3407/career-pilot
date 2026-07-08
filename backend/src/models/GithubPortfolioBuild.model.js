import mongoose from 'mongoose';

/**
 * Persisted record of a user-built GitHub-powered portfolio.
 * Stores the AI-generated section data so users can revisit / re-edit / deploy.
 */
const buildSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    username: { type: String, required: true },
    repoCount: { type: Number, default: 0 },
    selectedRepos: { type: [String], default: [] }, // ['owner/repo', ...]
    sections: { type: mongoose.Schema.Types.Mixed, default: {} },
    templateSlug: { type: String, default: 'github-default' },
    profile: { type: mongoose.Schema.Types.Mixed, default: {} },
    languageStats: { type: mongoose.Schema.Types.Mixed, default: {} },
    aggregateStats: { type: mongoose.Schema.Types.Mixed, default: {} },
    authMode: { type: String, enum: ['pat', 'oauth', 'public'], default: 'public' },
    shareToken: { type: String, unique: true, sparse: true, index: true },
    isPublic: { type: Boolean, default: false },
    provider: { type: String, default: '' },
  },
  { timestamps: true }
);

buildSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('GithubPortfolioBuild', buildSchema);