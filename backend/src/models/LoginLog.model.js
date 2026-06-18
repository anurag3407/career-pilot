import mongoose from 'mongoose';

const loginLogSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    default: 'Unknown'
  }
}, { timestamps: true }); // createdAt acts as the timestamp

// Add index to speed up sorting and querying by date and email
loginLogSchema.index({ createdAt: -1 });
loginLogSchema.index({ email: 1, createdAt: -1 });

export default mongoose.model('LoginLog', loginLogSchema);
