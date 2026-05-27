/**
 * Cache Key naming conventions to organize keys logically
 */

/**
 * Get cache key for a user's core profile
 * @param {string} uid - User ID
 * @returns {string}
 */
export const getUserProfileKey = (uid) => {
  return `cache:user-profiles:profile:${uid}`;
};

/**
 * Get cache key for a user's stats (resume count, interviews count)
 * @param {string} uid - User ID
 * @returns {string}
 */
export const getUserStatsKey = (uid) => {
  return `cache:user-profiles:stats:${uid}`;
};

/**
 * Get cache key for a user's activity feed (community posts)
 * @param {string} uid - User ID
 * @returns {string}
 */
export const getUserActivityKey = (uid) => {
  return `cache:user-profiles:activity:${uid}`;
};

/**
 * Get cache key for job search listings based on query parameters
 * @param {object} queryObj - The express request query object
 * @returns {string}
 */
export const getJobsKey = (queryObj = {}) => {
  const { query, jobType, experienceLevel, location } = queryObj;
  
  const q = (query || '').trim().toLowerCase();
  const jt = (jobType || '').trim().toLowerCase();
  const el = (experienceLevel || '').trim().toLowerCase();
  const loc = (location || '').trim().toLowerCase();
  
  return `cache:jobs:list:q=${q}:jt=${jt}:el=${el}:loc=${loc}`;
};

/**
 * Get cache key for the AI power/weak verb lists
 * @returns {string}
 */
export const getVerbListsKey = () => {
  return 'cache:ai:verb-lists';
};
