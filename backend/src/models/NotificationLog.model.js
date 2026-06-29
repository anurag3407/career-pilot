import mongoose from 'mongoose';

const notificationLogSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    alertId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobAlert',
        required: true,
        index: true
    },
    jobListingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobListing',
        required: true,
        index: true
    },
    externalJobId: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    emailStatus: {
        type: String,
        enum: ['pending', 'sent', 'failed', 'bounced'],
        default: 'pending'
    },
    emailMessageId: {
        type: String,
        default: null
    },
    errorMessage: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Compound indexes for deduplication queries
// This is the critical index for preventing duplicate notifications
notificationLogSchema.index({ userId: 1, jobListingId: 1 }, { unique: true, background: true });
notificationLogSchema.index({ alertId: 1, jobListingId: 1 }, { background: true });
notificationLogSchema.index({ userId: 1, sentAt: -1 }, { background: true });
notificationLogSchema.index({ emailStatus: 1, sentAt: -1 }, { background: true });
notificationLogSchema.index({ alertId: 1, sentAt: -1 }, { background: true });
notificationLogSchema.index({ userId: 1, externalJobId: 1 }, { background: true });
notificationLogSchema.index({ userId: 1, alertId: 1, sentAt: -1 }, { background: true });

export default mongoose.model('NotificationLog', notificationLogSchema);
