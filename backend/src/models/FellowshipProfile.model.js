import mongoose from 'mongoose';
import crypto from 'crypto';

const fellowshipProfileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    role: {
        type: String,
        enum: ['student', 'corporate'],
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedEmail: {
        type: String,
        default: null
    },
    verificationCode: {
        type: String,
        default: null
    },
    verificationCodeExpiry: {
        type: Date,
        default: null
    },
    companyName: {
        type: String,
        default: null
    },
    collegeName: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: null
    },
    skills: [{
        type: String
    }],
    proposalCount: {
        type: Number,
        default: 0
    },
    challengeCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const hashVerificationCode = (code) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(code, salt, 64).toString('hex');
    return `${salt}:${hash}`;
};

const compareVerificationCode = (code, stored) => {
    const [salt, storedHash] = stored.split(':');
    if (!salt || !storedHash) return false;
    const hash = crypto.scryptSync(code, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
};


fellowshipProfileSchema.pre('save', function () {
    this.updatedAt = new Date();

    if (this.isModified('verificationCode') && this.verificationCode) {
        if (!this.verificationCode.includes(':')) {
            this.verificationCode = hashVerificationCode(this.verificationCode);
        }
    }
});

fellowshipProfileSchema.methods.compareVerificationCode = function (code) {
    if (!this.verificationCode) return false;
    return compareVerificationCode(code, this.verificationCode);
};

const FellowshipProfile = mongoose.model('FellowshipProfile', fellowshipProfileSchema);

export default FellowshipProfile;
