import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from '../src/models/User.model.js';
import Job from '../src/models/Job.model.js';
import Interview from '../src/models/Interview.model.js';

dotenv.config();

const connectDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      'mongodb://localhost:27017/careerpilot_staging';

    console.log('Connecting to staging database...');

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('Starting staging seed...');

    // Remove existing demo staging data
    await User.deleteMany({
      email: 'demo@careerpilot.dev',
    });

    await Job.deleteMany({
      company: 'CareerPilot Demo',
    });

    await Interview.deleteMany({
      odId: 'staging-demo-001',
    });

    // Create demo user
    const demoUser = await User.create({
      username: 'Demo User',
      email: 'demo@careerpilot.dev',
      jobRole: 'Software Developer',
      gender: 'Prefer not to say',
      yearsOfExperience: 1,
      collegeStudent: true,
      skills: ['JavaScript', 'React', 'Node.js'],
    });

    console.log('Demo user created:', demoUser.email);

    // Create demo job
    const demoJob = await Job.create({
      title: 'Frontend Developer Intern',
      company: 'CareerPilot Demo',
      description:
        'Demo staging job for testing recommendations and tracking.',
      location: {
        city: 'Remote',
        country: 'India',
        isRemote: true,
      },
      jobType: 'remote',
      employmentType: 'internship',
      requiredSkills: ['React', 'JavaScript'],
      experienceLevel: 'intern',
      isActive: true,
    });

    console.log('Demo job created:', demoJob.title);

    // Create demo interview
    const demoInterview = await Interview.create({
      odId: 'staging-demo-001',
      jobRole: 'Frontend Developer',
      industry: 'Software',
      experienceLevel: 'intern',
      questions: [
        {
          questionId: 'q1',
          question: 'Tell me about yourself',
          type: 'general',
          difficulty: 'easy',
        },
      ],
      status: 'completed',
      overallScore: 85,
    });

    console.log(
      'Demo interview created:',
      demoInterview.jobRole
    );

    console.log('Staging seed completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
};

const runSeed = async () => {
  await connectDatabase();
  await seedData();
  await mongoose.connection.close();

  console.log('Database connection closed.');
};

runSeed();