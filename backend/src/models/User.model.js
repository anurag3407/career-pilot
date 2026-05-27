import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    // Never returned in queries by default — must be explicitly selected with .select('+password')
    password: {
      type: String,
      select: false,
      default: null,
    },
    // Signals that the stored password is plaintext and must be reset before the account is usable
    requiresPasswordReset: {
      type: Boolean,
      default: false,
    },
    linkedinId: {
      type: String,
      default: null,
      index: { sparse: true },
    },
    // Profile fields are completed progressively after initial registration
    jobRole: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      default: '',
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
      min: 0,
    },
    collegeStudent: {
      type: Boolean,
      default: false,
    },
    skills: {
      type: [String],
      default: [],
    },
    notificationPreferences: {
      jobAlerts: { type: Boolean, default: true },
      directMessages: { type: Boolean, default: true },
      proposalUpdates: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true, background: true });
userSchema.index({ jobRole: 1 }, { background: true });
userSchema.index({ collegeStudent: 1 }, { background: true });
userSchema.index({ jobRole: 1, yearsOfExperience: 1 }, { background: true });
userSchema.index({ skills: 1 }, { background: true });

// Hash the password whenever it has been modified before persisting.
// The guard against already-hashed values prevents double-hashing if a document
// is saved multiple times in the same request cycle.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  // Detect an already-hashed value so we never double-hash (bcrypt prefixes: $2b$ or $2a$)
  if (/^\$2[ab]\$/.test(this.password)) return next();

  try {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
  } catch (err) {
    next(err);
  }
});

// Constant-time comparison guards against timing-based user enumeration
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
