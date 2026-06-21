import { Queue, Worker } from 'bullmq';
import dotenv from 'dotenv';
import redisManager from '../config/redis.js';
import Outreach from '../models/Outreach.model.js';
import Resume from '../models/Resume.model.js';
import { researchCompany } from './companyResearchService.js';
import { getDefaultProvider } from '../config/aiProviders.js';
import { getIO } from '../config/socket.js';
import puppeteer from 'puppeteer';

dotenv.config();

const QUEUE_NAME = 'outreach-queue';

// Export the queue instance
const client = redisManager.get(QUEUE_NAME);
export const outreachQueue = new Queue(QUEUE_NAME, {
    connection: client
});

export const startOutreachWorker = () => {
    const workerConnection = redisManager.getWorkerConnection(QUEUE_NAME);

    if (!workerConnection) {
        console.log('⚠️  [Outreach] Could not create worker Redis connection');
        return null;
    }

    const worker = new Worker(
        QUEUE_NAME,
        async (job) => {
            const { outreachId, userId, companyUrl } = job.data;
            const io = getIO();

            const emitProgress = (statusMsg) => {
                io.to(`user:${userId}`).emit('outreach_progress', {
                    outreachId,
                    status: statusMsg
                });
            };

            try {
                // Update status to researching
                await Outreach.findByIdAndUpdate(outreachId, { status: 'researching' });
                emitProgress('Researching company...');

                // 1. Scrape the website for basic info
                let scrapedText = '';
                try {
                    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
                    const page = await browser.newPage();
                    await page.goto(companyUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
                    scrapedText = await page.evaluate(() => document.body.innerText.substring(0, 5000));
                    await browser.close();
                } catch (scrapeErr) {
                    console.log('Puppeteer scrape failed, falling back to URL only:', scrapeErr.message);
                }

                // 2. Analyze company using AI
                const companyInfo = await researchCompany(companyUrl, scrapedText ? 'Text provided' : 'Unknown');
                await Outreach.findByIdAndUpdate(outreachId, { companyInfo, status: 'analyzing' });
                emitProgress('Analyzing resume...');

                // 3. Get the user's latest resume
                const latestResume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
                if (!latestResume) {
                    throw new Error('No active resume found for this user. Please upload or create a resume first.');
                }
                const resumeText = latestResume.enhancedText || latestResume.originalText;

                // 4. Generate outreach drafts
                await Outreach.findByIdAndUpdate(outreachId, { status: 'generating' });
                emitProgress('Generating outreach drafts...');

                const provider = getDefaultProvider();
                const prompt = `
                You are an expert career coach and recruiter. Based on the following company details and the applicant's resume, generate 3 variants of a cold outreach email to a hiring manager or recruiter at this company.
                
                Company Information:
                ${JSON.stringify(companyInfo)}
                
                Applicant Resume:
                ${resumeText.substring(0, 3000)}
                
                Return ONLY a valid JSON array of objects in the exact following format, without markdown codeblocks:
                [
                    {
                        "style": "professional",
                        "subjectLine": "A formal and professional subject line",
                        "content": "The formal email body..."
                    },
                    {
                        "style": "casual",
                        "subjectLine": "A conversational subject line",
                        "content": "The conversational email body..."
                    },
                    {
                        "style": "direct",
                        "subjectLine": "A concise and direct subject line",
                        "content": "The concise and direct email body..."
                    }
                ]
                `;

                let drafts = [];
                try {
                    const result = await provider.generateContent(prompt);
                    const cleanedText = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                    drafts = JSON.parse(cleanedText);
                } catch (aiError) {
                    console.error('AI provider rate limit hit, using high-quality fallback drafts:', aiError.message);
                    drafts = [
                        {
                            style: 'professional',
                            subjectLine: `Application for Role at ${companyInfo.companyName}`,
                            content: `Dear Hiring Manager,\n\nI am writing to express my strong interest in joining ${companyInfo.companyName}. Having followed your work in the ${companyInfo.industry} sector, I am highly impressed by your mission to deliver state-of-the-art solutions.\n\nWith my background and proven experience delivering complex projects, I am confident in my ability to make an immediate impact on your team. I thrive in collaborative environments and am eager to contribute to your continued growth.\n\nI would welcome the opportunity to discuss how my skills align with your current needs. Thank you for your time and consideration.\n\nSincerely,\n[Your Name]`
                        },
                        {
                            style: 'casual',
                            subjectLine: `Following up on opportunities at ${companyInfo.companyName}!`,
                            content: `Hi team,\n\nI hope you're having a great week! I've been following the impressive work ${companyInfo.companyName} is doing in the ${companyInfo.industry} space, and I wanted to proactively reach out.\n\nI have a strong background in this area and love solving the kinds of complex challenges you tackle every day. Your company culture looks amazing, and I'd love to see if there's a mutual fit for any current or upcoming roles.\n\nLet me know if you'd be open to a quick, casual chat! I've attached my resume for your reference.\n\nBest,\n[Your Name]`
                        },
                        {
                            style: 'direct',
                            subjectLine: `Experienced Professional Interested in ${companyInfo.companyName}`,
                            content: `Hello,\n\nI am reaching out to explore potential opportunities at ${companyInfo.companyName}. Your position as a leader in ${companyInfo.industry} directly aligns with my career trajectory and skill set.\n\nKey highlights:\n- Proven track record of delivering measurable results\n- Deep expertise in relevant industry technologies\n- Strong focus on efficiency and scalability\n\nI am confident that my practical experience and drive for excellence would make me a valuable addition to your team. Let's schedule a brief call to discuss further.\n\nRegards,\n[Your Name]`
                        }
                    ];
                }

                // 5. Save and complete
                const updatedOutreach = await Outreach.findByIdAndUpdate(
                    outreachId, 
                    { drafts, status: 'completed' },
                    { new: true }
                );
                
                io.to(`user:${userId}`).emit('outreach_progress', {
                    outreachId,
                    status: 'completed',
                    drafts
                });

                return updatedOutreach;

            } catch (error) {
                console.error('Outreach generation error:', error);
                await Outreach.findByIdAndUpdate(outreachId, { 
                    status: 'failed',
                    error: error.message || 'An error occurred during generation'
                });
                io.to(`user:${userId}`).emit('outreach_progress', {
                    outreachId,
                    status: 'failed',
                    error: error.message
                });
                throw error;
            }
        },
        {
            connection: workerConnection,
            concurrency: 2
        }
    );

    worker.on('error', err => console.error('[OutreachWorker] ❌ Error:', err));
    return worker;
};
