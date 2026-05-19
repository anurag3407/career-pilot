import axios from "axios";

const EXPIRY_DAYS = 30;

/*
 Check whether a job apply link is still active
 Returns false if:
 - URL is missing
 - URL returns 404
 - Request fails
 */
export const isLinkActive = async (url) => {
  if (!url || url === "#") {
    return false;
  }

  try {
    const response = await axios.head(url, {
      maxRedirects: 5,
      timeout: 5000,
      validateStatus: () => true,
    });

    return response.status !== 404;
  } catch (error) {
    console.error(`❌ Error checking URL: ${url}`, error.message);
    return false;
  }
};

/*
 Check whether a job is expired
 based on posted date
 */
export const isJobExpired = (postedDate) => {
  if (!postedDate) {
    return false;
  }

  const currentDate = new Date();
  const jobDate = new Date(postedDate);

  // Invalid date protection
  if (isNaN(jobDate.getTime())) {
    return false;
  }

  const diffTime = currentDate - jobDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays > EXPIRY_DAYS;
};

/*
 Remove stale jobs from results
 Removes:
 - Jobs with broken apply links
 - Expired jobs
 */
export const filterFreshJobs = async (jobs = []) => {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return [];
  }

  const freshJobs = [];

  for (const job of jobs) {
    const activeLink = await isLinkActive(job.applyLink);

    const expired = isJobExpired(
      job.postedAt || job.postedDate || job.datePosted || job.createdAt,
    );

    if (activeLink && !expired) {
      freshJobs.push(job);
    }
  }

  console.log(
    `🧹 Freshness Check: ${freshJobs.length}/${jobs.length} jobs are active`,
  );

  return freshJobs;
};

export default {
  isLinkActive,
  isJobExpired,
  filterFreshJobs,
};
