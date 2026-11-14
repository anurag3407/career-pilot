#!/usr/bin/env node

/**
 * CareerPilot End-to-End CLI Feature & Performance Benchmark
 * Tests all production endpoints on Cloudflare Worker + D1 + ImageKit.
 * Checks HTTP status, latency, CPU execution safety, and data integrity.
 */

const BASE_URL = process.env.GATEWAY_URL || 'https://careerpilot.sayalabs.in/gateway/v1';
const TEST_USER = `test_cli_${Date.now()}`;
let createdResumeId = null;
let createdFileId = null;
let createdJobId = null;

const results = [];

async function runStep(name, fn) {
  process.stdout.write(`⏳ Testing: ${name}... `);
  const start = performance.now();
  try {
    const data = await fn();
    const elapsed = (performance.now() - start).toFixed(2);
    results.push({ name, status: '✅ PASS', timeMs: elapsed, error: null });
    console.log(`✅ PASS (${elapsed} ms)`);
    return data;
  } catch (err) {
    const elapsed = (performance.now() - start).toFixed(2);
    results.push({ name, status: '❌ FAIL', timeMs: elapsed, error: err.message });
    console.log(`❌ FAIL (${elapsed} ms) -> ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('\n======================================================');
  console.log('🚀 CareerPilot Cloudflare & ImageKit Live Feature Test');
  console.log(`Target URL: ${BASE_URL}`);
  console.log(`Test User ID: ${TEST_USER}`);
  console.log('======================================================\n');

  // 1. Health & Config Probe
  await runStep('1. Gateway Health & Bindings Check', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const json = await res.json();
    if (!res.ok || !json.ok) throw new Error(`Health check failed: ${JSON.stringify(json)}`);
    if (!json.d1) throw new Error('Cloudflare D1 is not bound');
    if (!json.imagekit) throw new Error('ImageKit is not bound');
    return json;
  });

  // 2. AI Model Discovery
  await runStep('2. AI Provider & Models Discovery', async () => {
    const res = await fetch(`${BASE_URL}/ai/models?provider=cloudflare`);
    const json = await res.json();
    if (!res.ok || !json.models || json.models.length === 0) {
      throw new Error(`Models query failed: ${JSON.stringify(json)}`);
    }
    return json;
  });

  // 3. AI Resume Builder (Text Generation & STAR Enhancement)
  const aiResult = await runStep('3. Build Resume: AI Generation & STAR Enhancement', async () => {
    const prompt = 'Enhance this work experience bullet into 2 strong, quantifiable STAR bullets for a Senior Full Stack Engineer: "worked on react frontend and improved app performance and added redis cache"';
    const res = await fetch(`${BASE_URL}/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': TEST_USER,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are an expert ATS resume writer. Output plain concise bullet points only.' },
          { role: 'user', content: prompt }
        ],
        maxTokens: 512,
        temperature: 0.6,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.text) {
      throw new Error(json.error || `AI generation failed (${res.status})`);
    }
    return json;
  });

  if (aiResult?.text) {
    console.log(`\n   📄 AI Generated Sample:\n   ${aiResult.text.trim().split('\n').slice(0, 3).join('\n   ')}\n`);
  }

  // 4. ImageKit Auth Signature
  await runStep('4. ImageKit Client Auth Parameter Generation', async () => {
    const res = await fetch(`${BASE_URL}/imagekit/auth`);
    const json = await res.json();
    if (!res.ok || !json.token || !json.signature) {
      throw new Error(`Auth generation failed: ${JSON.stringify(json)}`);
    }
    return json;
  });

  // 5. Upload Avatar to ImageKit Object Storage
  const avatarUpload = await runStep('5. Upload User Avatar to ImageKit', async () => {
    // 1x1 transparent PNG base64
    const sampleImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const res = await fetch(`${BASE_URL}/imagekit/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': TEST_USER,
      },
      body: JSON.stringify({
        file: sampleImageBase64,
        fileName: `avatar_${TEST_USER}.png`,
        folder: '/avatars',
        tags: ['test', 'avatar', TEST_USER],
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success || !json.url) {
      throw new Error(json.error || 'ImageKit upload failed');
    }
    createdFileId = json.fileId;
    return json;
  });

  // 6. Upload Resume Document (PDF / Doc representation) to ImageKit
  const resumeUpload = await runStep('6. Upload Original Resume Document to ImageKit', async () => {
    const sampleResumeBase64 = Buffer.from(
      `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000117 00000 n\ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n190\n%%EOF`
    ).toString('base64');

    const res = await fetch(`${BASE_URL}/imagekit/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': TEST_USER,
      },
      body: JSON.stringify({
        file: `data:application/pdf;base64,${sampleResumeBase64}`,
        fileName: `resume_${TEST_USER}.pdf`,
        folder: '/resumes',
        tags: ['test', 'resume', TEST_USER],
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success || !json.url) {
      throw new Error(json.error || 'Resume PDF upload failed');
    }
    return json;
  });

  const resumePdfUrl = resumeUpload?.url || 'https://ik.imagekit.io/anurag3407/resumes/sample.pdf';

  // 7. Build Resume: Save to Cloudflare D1
  createdResumeId = `res_${Date.now()}`;
  await runStep('7. Build Resume: Save Record & ImageKit URL in Cloudflare D1', async () => {
    const res = await fetch(`${BASE_URL}/db/resumes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': TEST_USER,
      },
      body: JSON.stringify({
        id: createdResumeId,
        userId: TEST_USER,
        title: 'Senior Full Stack Engineer Resume - v1',
        originalText: 'Software Engineer with experience in React and Node.js.',
        enhancedText: aiResult?.text || 'Spearheaded frontend architecture using React, cutting load time by 42%.',
        jobRole: 'Full Stack Engineer',
        atsScore: 78.5,
        pdfUrl: resumePdfUrl,
        preferences: {
          yearsOfExperience: 4,
          skills: ['React', 'Node.js', 'Cloudflare Workers', 'D1', 'TypeScript'],
        },
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success || !json.resume) {
      throw new Error(json.error || 'D1 resume save failed');
    }
    return json;
  });

  // 8. Edit Resume: Update Content & Re-score in Cloudflare D1
  await runStep('8. Edit Resume: Update ATS Score & Sections in Cloudflare D1', async () => {
    const res = await fetch(`${BASE_URL}/db/resumes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': TEST_USER,
      },
      body: JSON.stringify({
        id: createdResumeId,
        userId: TEST_USER,
        title: 'Senior Full Stack Engineer Resume - Optimized v2',
        originalText: 'Software Engineer with experience in React and Node.js.',
        enhancedText: 'Architected distributed edge APIs with Cloudflare D1 and React, improving availability to 99.99%.',
        jobRole: 'Lead Full Stack Engineer',
        atsScore: 94.0, // Updated ATS score
        pdfUrl: resumePdfUrl,
        preferences: {
          yearsOfExperience: 5,
          skills: ['React', 'Next.js', 'Node.js', 'Cloudflare Workers', 'D1', 'System Design'],
        },
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success || json.resume.ats_score !== 94.0) {
      throw new Error(json.error || 'D1 resume edit/upsert failed');
    }
    return json;
  });

  // 9. Deploy / View Single Resume from Cloudflare D1
  await runStep('9. Deploy/Preview: Fetch Single Resume by ID from D1', async () => {
    const res = await fetch(`${BASE_URL}/db/resumes?id=${createdResumeId}`);
    const json = await res.json();
    if (!res.ok || !json.resume || json.resume.id !== createdResumeId) {
      throw new Error(json.error || 'D1 single resume query failed');
    }
    if (json.resume.ats_score !== 94.0) {
      throw new Error(`ATS score mismatch: expected 94, got ${json.resume.ats_score}`);
    }
    return json;
  });

  // 10. List User Resumes from Cloudflare D1
  await runStep('10. Dashboard: List All User Resumes from D1', async () => {
    const res = await fetch(`${BASE_URL}/db/resumes?user_id=${TEST_USER}`);
    const json = await res.json();
    if (!res.ok || !Array.isArray(json.resumes) || json.resumes.length === 0) {
      throw new Error(json.error || 'D1 user resumes list failed');
    }
    return json;
  });

  // 11. Track Job: Add Application to Cloudflare D1
  createdJobId = `job_${Date.now()}`;
  await runStep('11. Track Job: Save Application in Cloudflare D1', async () => {
    const res = await fetch(`${BASE_URL}/db/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': TEST_USER,
      },
      body: JSON.stringify({
        id: createdJobId,
        userId: TEST_USER,
        company: 'Cloudflare',
        title: 'Senior Systems Engineer',
        location: 'Remote / Global',
        status: 'applied',
        salary: '$180,000 - $220,000',
        jobUrl: 'https://www.cloudflare.com/careers/jobs/12345',
        notes: 'Applied using CareerPilot optimized resume v2.',
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success || !json.job) {
      throw new Error(json.error || 'D1 job track failed');
    }
    return json;
  });

  // 12. Query Tracked Jobs from Cloudflare D1
  await runStep('12. Track Job: List Applications from Cloudflare D1', async () => {
    const res = await fetch(`${BASE_URL}/db/jobs?user_id=${TEST_USER}`);
    const json = await res.json();
    if (!res.ok || !Array.isArray(json.jobs) || json.jobs.length === 0) {
      throw new Error(json.error || 'D1 jobs query failed');
    }
    return json;
  });

  // 13. Delete Tracked Job Clean Up
  await runStep('13. Clean Up: Delete Tracked Job from Cloudflare D1', async () => {
    const res = await fetch(`${BASE_URL}/db/jobs?id=${createdJobId}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'D1 job deletion failed');
    }
    return json;
  });

  // 14. Portfolio Flow: Create/Update Portfolio in Cloudflare D1
  const testPortfolioSlug = `slug_${Date.now()}`;
  await runStep('14. Portfolio Builder: Save Portfolio to Cloudflare D1', async () => {
    const res = await fetch(`${BASE_URL}/db/portfolios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': TEST_USER,
      },
      body: JSON.stringify({
        slug: testPortfolioSlug,
        userId: TEST_USER,
        templateId: 'Swiss_Typography',
        title: 'Anurag Mishra - Senior Developer Portfolio',
        sections: {
          hero: { name: 'Anurag Mishra', title: 'Senior AI & Full Stack Engineer' },
          skills: ['React', 'Node.js', 'Cloudflare Workers', 'D1', 'ImageKit'],
          projects: [{ title: 'CareerPilot', desc: 'AI-powered job hunt acceleration platform' }],
        },
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success || !json.portfolio) {
      throw new Error(json.error || 'D1 portfolio save failed');
    }
    return json;
  });

  // 15. Portfolio Flow: Fetch Portfolio by Slug from Cloudflare D1
  await runStep('15. Portfolio View: Fetch Portfolio by Slug from Cloudflare D1', async () => {
    const res = await fetch(`${BASE_URL}/db/portfolios?slug=${testPortfolioSlug}`);
    const json = await res.json();
    if (!res.ok || !json.portfolio || json.portfolio.slug !== testPortfolioSlug) {
      throw new Error(json.error || 'D1 portfolio query failed');
    }
    return json;
  });

  // 16. Portfolio Flow: Clean Up Test Portfolio from Cloudflare D1
  await runStep('16. Clean Up: Delete Test Portfolio from Cloudflare D1', async () => {
    const res = await fetch(`${BASE_URL}/db/portfolios?slug=${testPortfolioSlug}`, {
      method: 'DELETE',
      headers: { 'X-User-Id': TEST_USER },
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'D1 portfolio deletion failed');
    }
    return json;
  });

  // Performance & Summary Table
  console.log('\n======================================================');
  console.log('📊 PERFORMANCE & CPU EXECUTION BENCHMARK RESULTS');
  console.log('======================================================');
  console.table(results.map(r => ({
    Feature: r.name,
    Status: r.status,
    'Latency (ms)': `${r.timeMs} ms`,
    Error: r.error || '-'
  })));

  const allPassed = results.every(r => r.status === '✅ PASS');
  if (allPassed) {
    console.log(`🎉 ALL ${results.length} PRODUCTION FEATURES PASSED SUCCESSFULLY!`);
    console.log('⚡ All Worker functions executed safely within Cloudflare limits with zero 1027/CPU exhaustion errors.');
  } else {
    console.log('⚠️ Some features encountered errors. Review table above.');
  }
}

main().catch(err => {
  console.error('Fatal benchmark error:', err);
  process.exit(1);
});
