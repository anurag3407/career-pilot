import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { getSystemPrompt, getVerbLists, enhanceResume } from './src/config/langchain.js';
import axios from 'axios';
import { getQueueStats } from './src/services/jobAlertQueue.js';

async function runTests() {
  console.log('--- INTEGRATION TESTS ---');
  
  try {
    // 1. MONGODB
    console.log('\n1. MONGODB CONNECTION');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ MongoDB Error:', err.message);
  }

  try {
    // 2. REDIS
    console.log('\n2. REDIS CONNECTION (BullMQ)');
    const stats = await getQueueStats();
    console.log('✅ Redis connected. Stats:', stats);
  } catch (err) {
    console.error('❌ Redis Error:', err.message);
  }

  try {
    // 3. AI / LANGCHAIN
    console.log('\n3. AI SERVICES (Gemini)');
    const mockResume = "Software Engineer with 2 years of experience. Developed React apps.";
    const result = await enhanceResume(mockResume, {
      jobRole: 'Frontend Developer',
      yearsOfExperience: '2',
      skills: ['React', 'JavaScript'],
    });
    console.log('✅ AI Service Success.');
    console.log(`Provider used: ${result.provider}`);
    console.log(`Tokens used: ${JSON.stringify(result.tokensUsed)}`);
    console.log('Snippet:', result.enhancedResume.substring(0, 100).replace(/\n/g, ' '));
  } catch (err) {
    console.error('❌ AI Service Error:', err.message);
  }

  try {
    // 4. RAPIDAPI
    console.log('\n4. RAPIDAPI (JSearch)');
    const options = {
      method: 'GET',
      url: `https://${process.env.RAPIDAPI_HOST}/search`,
      params: {
        query: 'developer',
        page: '1',
        num_pages: '1'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
      }
    };
    const response = await axios.request(options);
    console.log(`✅ RapidAPI Success. Found ${response.data?.data?.length} jobs.`);
  } catch (err) {
    console.error('❌ RapidAPI Error:', err.response?.data || err.message);
  }

  process.exit(0);
}

runTests();
