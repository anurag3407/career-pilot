import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        minlength: 20
    },
    techStack: [{
        type: String,
        required: true
    }],
    githubUrl: {
        type: String,
        required: true
    },
    demoUrl: {
        type: String,
        default: null
    },
    screenshot: {
        type: String,
        default: null
    },
    authorId: {
        type: String,
        required: true,
        index: true
    },
    authorName: {
        type: String,
        required: true
    },
    upvotes: {
        type: Number,
        default: 0
    },
    upvotedBy: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        index: true
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

projectSchema.index({ status: 1, createdAt: -1 }, { background: true });
projectSchema.index({ authorId: 1, createdAt: -1 }, { background: true });
projectSchema.index({ techStack: 1, status: 1 }, { background: true });

projectSchema.pre('save', function () {
    this.updatedAt = new Date();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;