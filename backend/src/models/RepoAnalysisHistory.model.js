import mongoose from 'mongoose';

const repoAnalysisHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  repoUrl: {
    type: String,
    required: true
  },
  lastAnalyzed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

repoAnalysisHistorySchema.index({ userId: 1, repoUrl: 1 }, { unique: true });

export default mongoose.model('RepoAnalysisHistory', repoAnalysisHistorySchema);
