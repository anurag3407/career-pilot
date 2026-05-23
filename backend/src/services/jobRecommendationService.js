import { getDefaultProvider } from '../config/aiProviders.js';
import dotenv from 'dotenv';
dotenv.config();

const resolveProvider = (aiProvider) => aiProvider || getDefaultProvider();

export const getSimilarJobs = async (targetJob, candidateJobs, aiProvider) => {
  try {
    const provider = resolveProvider(aiProvider);
    if (!targetJob || !candidateJobs || candidateJobs.length === 0) return [];

    const candidateData = candidateJobs.map(job => ({
      id: job.job_id || job._id || job.id,
      title: job.job_title || job.title,
      skills: job.job_required_skills || [],
      company: job.employer_name || job.company,
      type: job.job_employment_type || job.employmentType
    })).filter(job => job.id !== (targetJob.job_id || targetJob._id || targetJob.id)).slice(0, 20);

    if (candidateData.length === 0) return [];

    const prompt = `You are an AI career assistant. I will provide you with a target job and a list of candidate jobs.
Please score the similarity of each candidate job to the target job based on job title, required skills, and company type.
Return ONLY valid JSON, containing an array of exactly up to 5 most similar job IDs from the candidate list.

Target Job:
Title: ${targetJob.job_title || targetJob.title}
Skills: ${(targetJob.job_required_skills || []).join(', ')}
Company: ${targetJob.employer_name || targetJob.company}

Candidate Jobs:
${JSON.stringify(candidateData)}

Return this exact JSON structure:
{
  "similarJobIds": ["<id 1>", "<id 2>", "<id 3>", "<id 4>", "<id 5>"]
}
`;
    const result = await provider.generateContent(prompt);
    
    const cleanedText = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);
    
    if (data && Array.isArray(data.similarJobIds)) {
        const similarJobs = candidateJobs.filter(job => data.similarJobIds.includes(job.job_id || job._id || job.id));
        return similarJobs.slice(0, 5);
    }
    return Array.isArray(candidateJobs) ? candidateJobs.slice(0, 5) : [];
  } catch (error) {
    console.error('Error getting similar jobs:', error);
    return Array.isArray(candidateJobs) ? candidateJobs.slice(0, 5) : [];
  }
};
