import Resume from '../models/Resume.model.js';
import JobListing from '../models/JobListing.model.js';

const rankByRelevance = (results) => {
  return results.sort((a, b) => (b.score || 0) - (a.score || 0));
};

// userId param ensures users only see their own resumes
export const searchResumes = async (query, userId) => {
  try {
    const results = await Resume.find(
      { $text: { $search: query }, userId },
      { score: { $meta: 'textScore' } }
    )
      .select({ title: 1, jobRole: 1, createdAt: 1, score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(10)
      .lean();

    return results.map((r) => ({ ...r, type: 'resume' }));
  } catch {
    return [];
  }
};

export const searchJobs = async (query) => {
  try {
    const results = await JobListing.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .select({ title: 1, company: 1, location: 1, employmentType: 1, score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(10)
      .lean();

    return results.map((r) => ({ ...r, type: 'job' }));
  } catch {
    return [];
  }
};

export const searchAll = async (query, userId) => {
  const [resumes, jobs] = await Promise.all([
    searchResumes(query, userId),
    searchJobs(query),
  ]);

  return rankByRelevance([...resumes, ...jobs]);
};