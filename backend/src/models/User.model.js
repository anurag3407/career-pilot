import mongoose from 'mongoose';
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address']
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  jobRole: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  collegeStudent: {
    type: Boolean,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  notificationPreferences: {
    jobAlerts: { type: Boolean, default: true },
    directMessages: { type: Boolean, default: true },
    proposalUpdates: { type: Boolean, default: true },
  }
});

userSchema.pre("save", async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model('User', userSchema);

export default User;