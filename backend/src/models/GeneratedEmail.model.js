import mongoose from 'mongoose';

const generatedEmailSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  jobTitle: {
    type: String,
    default: '',
    trim: true,
  },
  tone: {
    type: String,
    default: 'Professional',
  },
  subjectLines: [{ type: String }],
  variants: [{ type: String }],
}, { timestamps: true });

generatedEmailSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('GeneratedEmail', generatedEmailSchema);