import { sendMatchingJobMail } from "./mailService.js";
import { searchJobs } from "./rapidApiService.js";
import { catchAsync } from "../middleware/globalErrorHandler.js";

export const Agent_24_7_Jobs = catchAsync(async (req, res, next) => {
  const user = req.user;

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
});
