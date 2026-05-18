import Resume from '../models/Resume.model.js';
import JobListing from '../models/JobListing.model.js';

const rankByRelevance = (results) => {
  return results.sort((a, b) => (b.score || 0) - (a.score || 0));
};

export const searchResumes = async (query) => {
  try {
    const results = await Resume.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .select('userId originalText enhancedText createdAt')
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
      .select('title company location description employmentType')
      .limit(10)
      .lean();

    return results.map((r) => ({ ...r, type: 'job' }));
  } catch {
    return [];
  }
};

export const searchAll = async (query) => {
  const [resumes, jobs] = await Promise.all([
    searchResumes(query),
    searchJobs(query),
  ]);

  return rankByRelevance([...resumes, ...jobs]);
};