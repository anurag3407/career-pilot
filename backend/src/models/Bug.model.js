import mongoose from 'mongoose';

const bugSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open'
  }
}, { timestamps: true });

bugSchema.index({ status: 1 });
bugSchema.index({ createdAt: -1 });

export default mongoose.model('Bug', bugSchema);
