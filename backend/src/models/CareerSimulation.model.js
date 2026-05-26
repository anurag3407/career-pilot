import mongoose from 'mongoose';

const pipelineStageSchema = new mongoose.Schema({
  stageName: { type: String, required: true },
  successProbability: { type: Number, required: true },
  weakPoints: [{ type: String }],
  requiredSkills: [{ type: String }],
  suggestions: [{ type: String }]
});

const skillGapSchema = new mongoose.Schema({
  strongSkills: [{ type: String }],
  missingTechnologies: [{ type: String }],
  communicationGaps: [{ type: String }],
  projectDepth: { type: Number, default: 0 },
  indicators: [{ type: String }]
});

const roadmapItemSchema = new mongoose.Schema({
  phase: { type: String, required: true },
  skillsToLearn: [{ type: String }],
  recommendedProjects: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [{ type: String }]
  }],
  certifications: [{ type: String }],
  prepStrategy: { type: String }
});

const riskSchema = new mongoose.Schema({
  riskName: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  reason: { type: String, required: true },
  mitigation: { type: String, required: true }
});

const careerSimulationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
    index: true
  },
  jobRole: {
    type: String,
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['internship', 'entry', 'mid', 'senior'],
    required: true
  },
  readinessScore: {
    type: Number,
    required: true
  },
  pipelineStages: [pipelineStageSchema],
  skillGap: skillGapSchema,
  roadmap: [roadmapItemSchema],
  riskAnalysis: [riskSchema]
}, {
  timestamps: true
});

// Index to quickly fetch user simulation history sorted by date
careerSimulationSchema.index({ userId: 1, createdAt: -1 }, { background: true });

const CareerSimulation = mongoose.model('CareerSimulation', careerSimulationSchema);
export default CareerSimulation;
