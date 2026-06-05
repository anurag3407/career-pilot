import  mongoose from 'mongoose';

const inputSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
    },

    jobRole: String,

    experienceLevel: {
      type: String,
      enum: ["Entry", "Junior", "Mid", "Senior"],
      default: "Entry",
    },

    techSkills: [
      {
        name: String,
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced"],
          default: "beginner",
        },
      },
    ],

    softSkills: [String],

    resume: {
      type: String,
    },

    resumeText: {
      type: String,
    },

    education: {
      degree: String,
      college: String,
      year: String,
    },

    projects: [
      {
        title: String,
        description: String,
        techStack: [String],
        githubLink: String,
      },
    ],

    experience: [
      {
        company: String,
        role: String,
        duration: String,
        techUsed: [String],
      },
    ],

    preferences: {
      location: String,
      jobType: String,
    },
  },
  { timestamps: true },
);
const inputModel = mongoose.model("input", inputSchema);
export default inputModel;
