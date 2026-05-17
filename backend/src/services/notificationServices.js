import { sendMatchingJobMail } from "./mailService.js";
import { searchJobs } from "./rapidApiService.js";

export const Agent_24_7_Jobs = async (req, res) => {
  const user = req.user;

  try {
    const jobs = await searchJobs({
      query: user?.jobRole || 'jobs',
      page: 1,
      numPages: 1
    });

    if (jobs.length > 0) {
      const job = jobs[0];
      await sendMatchingJobMail({
        userEmail: user.email,
        userName: user.username,
        jobTitle: job.title,
        companyName: job.company,
        jobDescription: job.description,
        jobLocation: job.location,
        jobType: job.employmentType,
        salary: job.salary,
        applyLink: job.applyLink,
        postedDate: job.postedAt
      });
    }

    return res.status(202).json({
      success: true,
      message: 'Job match check completed',
      jobsChecked: jobs.length
    });
  } catch (error) {
    console.error('Agent_24_7_Jobs failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check jobs'
    });
  }
};
