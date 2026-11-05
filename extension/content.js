/**
 * CareerPilot Content Script
 * Extracts structured job data from LinkedIn, Indeed, Greenhouse, and Lever job listings.
 */

function extractJobDetails() {
  const url = window.location.href;
  const hostname = window.location.hostname;

  let title = '';
  let company = '';
  let location = '';
  let salary = '';
  let description = '';
  let source = 'other';

  if (hostname.includes('linkedin.com')) {
    source = 'LinkedIn';
    title = 
      document.querySelector('.job-details-jobs-unified-top-card__job-title')?.innerText?.trim() ||
      document.querySelector('h1.t-24')?.innerText?.trim() ||
      document.querySelector('.jobs-unified-top-card__job-title')?.innerText?.trim() ||
      document.title.split('|')[0]?.trim() || '';

    company = 
      document.querySelector('.job-details-jobs-unified-top-card__company-name a')?.innerText?.trim() ||
      document.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText?.trim() ||
      document.querySelector('.jobs-unified-top-card__company-name')?.innerText?.trim() || '';

    location = 
      document.querySelector('.job-details-jobs-unified-top-card__bullet')?.innerText?.trim() ||
      document.querySelector('.jobs-unified-top-card__bullet')?.innerText?.trim() || '';

    const salaryEl = document.querySelector('.job-details-jobs-unified-top-card__job-insight');
    if (salaryEl && salaryEl.innerText.includes('$')) {
      salary = salaryEl.innerText.trim();
    }

    description = document.querySelector('.jobs-description__content')?.innerText?.trim() || '';
  } else if (hostname.includes('indeed.com')) {
    source = 'Indeed';
    title = 
      document.querySelector('h1[data-testid="jobsearch-JobInfoHeader-title"]')?.innerText?.trim() ||
      document.querySelector('.jobsearch-JobInfoHeader-title')?.innerText?.trim() || '';

    company = 
      document.querySelector('[data-testid="inlineHeader-companyName"]')?.innerText?.trim() ||
      document.querySelector('.jobsearch-CompanyInfoContainer a')?.innerText?.trim() || '';

    location = 
      document.querySelector('[data-testid="inlineHeader-companyLocation"]')?.innerText?.trim() ||
      document.querySelector('.jobsearch-JobInfoHeader-companyLocation')?.innerText?.trim() || '';

    salary = 
      document.querySelector('#salaryInfoAndJobType')?.innerText?.trim() ||
      document.querySelector('.jobsearch-JobMetadataHeader-item')?.innerText?.trim() || '';

    description = document.querySelector('#jobDescriptionText')?.innerText?.trim() || '';
  } else if (hostname.includes('greenhouse.io')) {
    source = 'Greenhouse';
    title = document.querySelector('.app-title')?.innerText?.trim() || document.querySelector('h1')?.innerText?.trim() || '';
    company = document.querySelector('.company-name')?.innerText?.trim() || '';
    location = document.querySelector('.location')?.innerText?.trim() || '';
    description = document.querySelector('#content')?.innerText?.trim() || '';
  } else if (hostname.includes('lever.co')) {
    source = 'Lever';
    title = document.querySelector('.posting-headline h2')?.innerText?.trim() || '';
    company = document.querySelector('.main-header-logo img')?.alt || '';
    location = document.querySelector('.posting-categories .location')?.innerText?.trim() || '';
    description = document.querySelector('.section-wrapper')?.innerText?.trim() || '';
  }

  // Fallback heuristics for any webpage
  if (!title) {
    const h1 = document.querySelector('h1');
    if (h1) title = h1.innerText.trim();
  }

  return {
    title,
    company,
    location,
    salary,
    description: description.slice(0, 5000), // Cap description size
    url,
    source,
  };
}

// Listen for requests from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'EXTRACT_JOB') {
    const data = extractJobDetails();
    sendResponse(data);
  }
  return true;
});
