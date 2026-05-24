import mongoose from 'mongoose';

const clickEventSchema = new mongoose.Schema({
    url: { type: String, required: true },
    clickedAt: { type: Date, default: Date.now }
}, { _id: false });

const emailLogSchema = new mongoose.Schema({
    // Unique token embedded in the tracking pixel URL and wrapped links
    trackingToken: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    recipientEmail: {
        type: String,
        required: true,
        index: true
    },

    // Optional campaign/template identifier (e.g. 'job-alert', 'weekly-digest')
    campaignId: {
        type: String,
        default: null,
        index: true
    },

    // Delivery status set by the sending service
    deliveryStatus: {
        type: String,
        enum: ['sent', 'failed', 'bounced'],
        default: 'sent'
    },

    // Open tracking
    openCount: {
        type: Number,
        default: 0
    },
    firstOpenedAt: {
        type: Date,
        default: null
    },
    lastOpenedAt: {
        type: Date,
        default: null
    },

    // Click tracking
    clickCount: {
        type: Number,
        default: 0
    },
    clickEvents: {
        type: [clickEventSchema],
        default: []
    },

    // When the email was sent
    sentAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound indexes for analytics queries
emailLogSchema.index({ recipientEmail: 1, sentAt: -1 });
emailLogSchema.index({ campaignId: 1, sentAt: -1 });
emailLogSchema.index({ openCount: 1, sentAt: -1 });

export default mongoose.model('EmailLog', emailLogSchema);
