import request from 'supertest';
import express from 'express';

const app = express();
app.use(express.json());

// Mock AI endpoints
app.get('/api/ai/skill-gap', (req, res) => {
  const { role } = req.query;

  if (!role) {
    return res.status(400).json({
      error: 'Role is required'
    });
  }

  res.status(200).json({
    success: true,
    gaps: ['System Design', 'Docker']
  });
});

app.get('/api/ai/career-trajectory', (req, res) => {
  const { field } = req.query;

  if (!field) {
    return res.status(400).json({
      error: 'Field is required'
    });
  }

  res.status(200).json({
    success: true,
    trajectory: ['Junior Dev', 'SDE-2', 'Tech Lead']
  });
});

app.get('/api/ai/salary-estimate', (req, res) => {
  const { experience } = req.query;

  if (!experience) {
    return res.status(400).json({
      error: 'Experience is required'
    });
  }

  res.status(200).json({
    success: true,
    estimatedSalary: '15 LPA'
  });
});

app.post('/api/ai/match-score', (req, res) => {
  const { skills } = req.body;

  if (!skills) {
    return res.status(400).json({
      error: 'Skills are required'
    });
  }

  res.status(200).json({
    success: true,
    matchScore: 87
  });
});

describe('AI Career Tools API', () => {
  test('GET /api/ai/skill-gap success', async () => {
    const res = await request(app)
      .get('/api/ai/skill-gap?role=Backend Developer');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/ai/skill-gap validation', async () => {
    const res = await request(app)
      .get('/api/ai/skill-gap');

    expect(res.statusCode).toBe(400);
  });

  test('GET /api/ai/career-trajectory success', async () => {
    const res = await request(app)
      .get('/api/ai/career-trajectory?field=AI');

    expect(res.statusCode).toBe(200);
  });

  test('GET /api/ai/salary-estimate success', async () => {
    const res = await request(app)
      .get('/api/ai/salary-estimate?experience=3');

    expect(res.statusCode).toBe(200);
  });

  test('POST /api/ai/match-score success', async () => {
    const res = await request(app)
      .post('/api/ai/match-score')
      .send({
        skills: ['React', 'Node.js']
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.matchScore).toBeDefined();
  });

  test('POST /api/ai/match-score validation', async () => {
    const res = await request(app)
      .post('/api/ai/match-score')
      .send({});

    expect(res.statusCode).toBe(400);
  });

  test('Rate limit simulation', async () => {
  const responses = await Promise.all(
    Array.from({ length: 5 }, () =>
      request(app).get('/api/ai/skill-gap?role=Backend')
    )
  );

  responses.forEach((res) => {
    expect([200, 429]).toContain(res.statusCode);
  });
});
});