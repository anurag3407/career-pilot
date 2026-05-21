import mongoose from 'mongoose';
import softDelete from '../middleware/softDelete.js';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  company: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    city: String,
    state: String,
    country: String,
    isRemote: { type: Boolean, default: false }
  },
  jobType: {
    type: String,
    enum: ['remote', 'on-site', 'hybrid'],
    default: 'on-site'
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    default: 'full-time'
  },
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' },
    period: { type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'yearly' }
  },
  applyLink: String,
  recruiterEmail: String,
  requiredSkills: [String],
  preferredSkills: [String],
  experienceLevel: {
    type: String,
    enum: ['intern', 'junior', 'mid', 'senior', 'lead'],
    default: 'mid'
  },
  source: {
    platform: String,
    url: String,
    scrapedAt: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: Date
  ,
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
}, {
  timestamps: true
});

// Indexes for efficient querying
jobSchema.index({ title: 'text', company: 'text', description: 'text' });
jobSchema.index({ isActive: 1, createdAt: -1 });
jobSchema.index({ 'location.city': 1, jobType: 1 });
jobSchema.index({ 'location.country': 1, jobType: 1 });

jobSchema.plugin(softDelete);

export default mongoose.model('Job', jobSchema);