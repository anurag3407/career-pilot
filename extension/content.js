// content.js - CareerPilot LinkedIn Profile DOM Parser

function parseLinkedInDOM() {
  const profile = {
    name: '',
    headline: '',
    location: '',
    about: '',
    experience: [],
    education: [],
    skills: [],
  };

  // Name
  const nameEl = document.querySelector('h1.inline.t-24.v-align-middle') || 
                 document.querySelector('.text-heading-xlarge') ||
                 document.querySelector('h1');
  if (nameEl) profile.name = nameEl.innerText.trim();

  // Headline
  const headlineEl = document.querySelector('.text-body-medium.break-words') ||
                     document.querySelector('div.text-body-medium');
  if (headlineEl) profile.headline = headlineEl.innerText.trim();

  // Location
  const locationEl = document.querySelector('span.text-body-small.inline.t-black--light.break-words');
  if (locationEl) profile.location = locationEl.innerText.trim();

  // About Section
  const aboutSection = Array.from(document.querySelectorAll('section')).find(sec => {
    return sec.querySelector('div[id="about"]') || sec.innerText.includes('About');
  });
  if (aboutSection) {
    const aboutText = aboutSection.querySelector('.display-flex .pv-shared-text-with-see-more') ||
                      aboutSection.querySelector('.inline-show-more-text') ||
                      aboutSection;
    if (aboutText) {
      profile.about = aboutText.innerText.replace(/[\r\n]+/g, ' ').replace('About', '').trim();
    }
  }

  // Experience Section
  const expSection = Array.from(document.querySelectorAll('section')).find(sec => {
    return sec.querySelector('div[id="experience"]') || sec.innerText.startsWith('Experience');
  });
  if (expSection) {
    const items = expSection.querySelectorAll('li.artdeco-list__item, li.pvs-list__item--line-separated');
    items.forEach(item => {
      const titleEl = item.querySelector('div.display-flex.aria-hidden span[aria-hidden="true"]') ||
                      item.querySelector('.mr1.hoverable-link-text span[aria-hidden="true"]');
      const companyEl = item.querySelector('span.t-14.t-normal span[aria-hidden="true"]');
      const durationEl = item.querySelector('span.t-14.t-normal.t-black--light span[aria-hidden="true"]');
      const descEl = item.querySelector('.pv-shared-text-with-see-more span[aria-hidden="true"]');

      if (titleEl) {
        profile.experience.push({
          title: titleEl.innerText.trim(),
          company: companyEl ? companyEl.innerText.trim() : '',
          duration: durationEl ? durationEl.innerText.trim() : '',
          description: descEl ? descEl.innerText.trim() : ''
        });
      }
    });
  }

  // Education Section
  const eduSection = Array.from(document.querySelectorAll('section')).find(sec => {
    return sec.querySelector('div[id="education"]') || sec.innerText.startsWith('Education');
  });
  if (eduSection) {
    const items = eduSection.querySelectorAll('li.artdeco-list__item, li.pvs-list__item--line-separated');
    items.forEach(item => {
      const schoolEl = item.querySelector('div.display-flex.aria-hidden span[aria-hidden="true"]') ||
                       item.querySelector('.hoverable-link-text span[aria-hidden="true"]');
      const degreeEl = item.querySelector('span.t-14.t-normal span[aria-hidden="true"]');
      const durationEl = item.querySelector('span.t-14.t-normal.t-black--light span[aria-hidden="true"]');

      if (schoolEl) {
        profile.education.push({
          school: schoolEl.innerText.trim(),
          degree: degreeEl ? degreeEl.innerText.trim() : '',
          duration: durationEl ? durationEl.innerText.trim() : ''
        });
      }
    });
  }

  // Skills Section
  const skillsSection = Array.from(document.querySelectorAll('section')).find(sec => {
    return sec.querySelector('div[id="skills"]') || sec.innerText.startsWith('Skills');
  });
  if (skillsSection) {
    const skillEls = skillsSection.querySelectorAll('.hoverable-link-text span[aria-hidden="true"], div.display-flex.aria-hidden span[aria-hidden="true"]');
    skillEls.forEach(el => {
      const skillName = el.innerText.trim();
      if (skillName && !profile.skills.includes(skillName) && skillName.length < 50) {
        profile.skills.push(skillName);
      }
    });
  }

  return profile;
}

// Listen for popup request
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'EXTRACT_PROFILE') {
    const data = parseLinkedInDOM();
    sendResponse({ success: true, profile: data, url: window.location.href });
  }
  return true;
});
