import mongoose from 'mongoose';

const isHttpUrl = (value) => {
    if (value === null || value === undefined || value === '') return true;
    try {
        const parsed = new URL(value);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
};

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
    techStack: {
        type: [{ type: String, required: true, trim: true }],
        validate: [
            (value) => Array.isArray(value) && value.length > 0,
            'At least one tech stack tag is required'
        ]
    },
    githubUrl: {
        type: String,
        required: true,
        validate: {
            validator: (value) => isHttpUrl(value),
            message: 'githubUrl must be a valid http(s) URL'
        }
    },
    demoUrl: {
         type: String,
        default: null,
        validate: {
            validator: (value) => isHttpUrl(value),
            message: 'demoUrl must be a valid http(s) URL'
        }
    },
    screenshot: {
        type: String,
        default: null,
        validate: {
            validator: (value) => isHttpUrl(value),
            message: 'screenshot must be a valid http(s) URL'
        }
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
        default: 0,
        min: 0
     },
    upvotedBy: {
        type: [String],
        default: [],
        validate: {
            validator: (value) => new Set(value).size === value.length,
            message: 'Duplicate upvotes from the same user are not allowed'
        }
    },
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