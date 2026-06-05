import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    matchPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    jobTitle: {
      type: String,
      default: "General",
    },
  },
  { timestamps: true }
);

recruiterSchema.index(
  { userId: 1, jobTitle: 1 },
  { unique: true }
);

const recruiterModel = mongoose.model(
  "recruiter",
  recruiterSchema
);

export default recruiterModel;