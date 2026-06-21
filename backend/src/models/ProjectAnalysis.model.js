import mongoose from 'mongoose';

const projectAnalysisSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  repoUrl: { type: String, required: true },
  repoName: { type: String },
  repoOwner: { type: String },
  sessionId: { type: String, unique: true },
  status: { type: String, enum: ['analyzing', 'complete', 'failed'], default: 'analyzing' },
  stats: {
    totalFiles: Number,
    totalLOC: Number,
    languages: { type: Map, of: Number },
    moduleCount: Number,
    dependencyCount: Number,
  },
  modules: [{
    name: String,
    path: String,
    fileCount: Number,
    loc: Number,
    type: { type: String, enum: ['core', 'util', 'test', 'config', 'ui', 'api', 'docs', 'assets', 'other'], default: 'other' },
    dependencies: [String],
  }],
  fileGraph: { nodes: mongoose.Schema.Types.Mixed, edges: mongoose.Schema.Types.Mixed },
  moduleGraph: { nodes: mongoose.Schema.Types.Mixed, edges: mongoose.Schema.Types.Mixed },
  risks: [{
    file: String,
    type: { type: String },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    description: String,
  }],
  suggestions: [{
    title: String,
    description: String,
    module: String,
    priority: { type: String, enum: ['low', 'medium', 'high'] },
  }],
  architectureSummary: String,
  github: {
    stars: Number, forks: Number, openIssues: Number, license: String,
    defaultBranch: String,
    contributors: [{ login: String, avatar: String, contributions: Number }],
    languages: { type: Map, of: Number },
    lastCommit: Date,
    description: String,
  },
  dependencies: {
    manifests: [{ file: String, manager: String }],
    packages: [{
      name: String, currentVersion: String, latestVersion: String,
      status: { type: String, enum: ['up-to-date', 'minor-update', 'major-update', 'critical'] },
      manager: String
    }],
    summary: { total: Number, upToDate: Number, minorUpdates: Number, majorUpdates: Number, critical: Number }
  },
  lastAnalyzed: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
}, { timestamps: true });

projectAnalysisSchema.index({ userId: 1, repoUrl: 1 });
projectAnalysisSchema.index({ sessionId: 1 });
projectAnalysisSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('ProjectAnalysis', projectAnalysisSchema);
