import mongoose from 'mongoose';

const resumeCommentSchema = new mongoose.Schema({
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  shareToken: { type: String, required: true },
  section: { type: String, required: true },
  text: { type: String, required: true },
  authorEmail: { type: String, required: true },
  authorName: { type: String },
  resolved: { type: Boolean, default: false },
  resolvedBy: { type: String },
  resolvedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('ResumeComment', resumeCommentSchema);
