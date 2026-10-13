import mongoose from 'mongoose';

const resumeShareSchema = new mongoose.Schema({
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  ownerId: { type: String, required: true },
  shareToken: { type: String, required: true, unique: true },
  expiresAt: { type: Date },
  collaborators: [{
    email: String,
    role: { type: String, enum: ['viewer', 'commenter'], default: 'commenter' },
    addedAt: { type: Date, default: Date.now }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

resumeShareSchema.index({ resumeId: 1 }, { background: true });
resumeShareSchema.index({ ownerId: 1, createdAt: -1 }, { background: true });
resumeShareSchema.index({ expiresAt: 1 }, { background: true, sparse: true });

export default mongoose.model('ResumeShare', resumeShareSchema);
