import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import User from './src/models/User.model.js';
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
  console.log('\n5. PASSWORD HASHING (bcrypt)');
  try {
    // 5a. bcrypt works standalone
    const plainPassword = 'testPassword123';
    const hash = await bcrypt.hash(plainPassword, 12);
    const isMatch = await bcrypt.compare(plainPassword, hash);
    const isWrongMatch = await bcrypt.compare('wrongPassword', hash);

    if (!hash.startsWith('$2b$12$') && !hash.startsWith('$2a$12$')) throw new Error('Hash format is wrong');
    if (!isMatch) throw new Error('bcrypt.compare failed for correct password');
    if (isWrongMatch) throw new Error('bcrypt.compare passed for wrong password');

    console.log('✅ bcrypt standalone hashing works');
    console.log(`   Hash snippet: ${hash.substring(0, 20)}...`);
  } catch (err) {
    console.error('❌ bcrypt standalone Error:', err.message);
  }

  try {
    // 5b. pre-save hook hashes password on User.save()
    await mongoose.connect(process.env.MONGODB_URI);

    const plainPassword = 'hookTestPass123';
    const testEmail = `test_${Date.now()}@example.com`;

    const user = new User({
      username: 'testuser',
      email: testEmail,
      password: plainPassword,
      jobRole: 'Developer',
      gender: 'Male',
      yearsOfExperience: 1,
      collegeStudent: false,
      skills: ['JavaScript'],
    });

    await user.save();

    // fetch back with password (select: false means we must explicitly request it)
    const savedUser = await User.findOne({ email: testEmail }).select('+password');

    if (!savedUser.password) throw new Error('Password field missing after save');
    if (savedUser.password === plainPassword) throw new Error('Password was stored as plaintext!');
    if (!savedUser.password.startsWith('$2b$') && !savedUser.password.startsWith('$2a$')) throw new Error('Password is not a bcrypt hash');

    const isMatch = await bcrypt.compare(plainPassword, savedUser.password);
    if (!isMatch) throw new Error('Saved hash does not match original password');

    // cleanup test user
    await User.deleteOne({ email: testEmail });

    console.log('✅ pre-save hook hashes password correctly in MongoDB');
    console.log(`   Stored hash snippet: ${savedUser.password.substring(0, 20)}...`);

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ pre-save hook Error:', err.message);
    await mongoose.disconnect().catch(() => { });
  }

  try {
    // 5c. password is NOT returned in normal queries (select: false)
    await mongoose.connect(process.env.MONGODB_URI);

    const testEmail = `test_select_${Date.now()}@example.com`;
    const user = new User({
      username: 'selecttest',
      email: testEmail,
      password: 'somePassword123',
      jobRole: 'Designer',
      gender: 'Female',
      yearsOfExperience: 3,
      collegeStudent: false,
      skills: ['Figma'],
    });
    await user.save();

    const fetchedUser = await User.findOne({ email: testEmail }); // no .select('+password')
    if (fetchedUser.password) throw new Error('Password was returned without select: false being respected!');

    await User.deleteOne({ email: testEmail });
    console.log('✅ select: false works — password not leaked in normal queries');

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ select: false Error:', err.message);
    await mongoose.disconnect().catch(() => { });
  }
  process.exit(0);
}

runTests();
