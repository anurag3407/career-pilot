// Skill-to-synergy mapping used to infer complementary recommendations.
// Each entry defines a base skill and a list of related skills that naturally work well together.
const SKILL_SYNERGY_MAP = [
  {
    id: 'python',
    label: 'Python',
    keywords: ['python'],
    recommendations: [
      { skill: 'SQL', description: 'Frequently used alongside Python for data handling and querying.' },
      { skill: 'Pandas', description: 'Essential for efficient data manipulation and analysis with Python.' },
      { skill: 'Data Visualization', description: 'Helps communicate insights effectively from Python analysis.' },
      { skill: 'Machine Learning', description: 'Expands opportunities in advanced data and AI roles.' }
    ]
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    keywords: ['javascript', 'js'],
    recommendations: [
      { skill: 'TypeScript', description: 'Adds type safety and stronger tooling to JavaScript applications.' },
      { skill: 'React', description: 'A leading front-end framework paired with JavaScript for modern web apps.' },
      { skill: 'Node.js', description: 'Enables server-side JavaScript and full-stack application development.' },
      { skill: 'Testing', description: 'Improves application quality when building JavaScript projects.' }
    ]
  },
  {
    id: 'data analysis',
    label: 'Data Analysis',
    keywords: ['data analysis', 'analytics', 'analyst', 'business intelligence', 'data scientist'],
    recommendations: [
      { skill: 'SQL', description: 'Commonly used for querying and analyzing structured data.' },
      { skill: 'Data Visualization', description: 'Makes complex insights easier to share and act on.' },
      { skill: 'Statistics', description: 'Improves your ability to interpret and validate data findings.' },
      { skill: 'Pandas', description: 'A core Python library for cleaning and transforming data.' }
    ]
  },
  {
    id: 'cloud computing',
    label: 'Cloud Computing',
    keywords: ['cloud', 'aws', 'azure', 'gcp', 'cloud computing'],
    recommendations: [
      { skill: 'DevOps', description: 'Helps you deploy and maintain cloud-native applications more reliably.' },
      { skill: 'Docker', description: 'Standardizes app packaging and deployment in cloud environments.' },
      { skill: 'Kubernetes', description: 'Orchestrates containerized workloads at scale.' },
      { skill: 'Infrastructure as Code', description: 'Automates cloud infrastructure provisioning and updates.' }
    ]
  },
  {
    id: 'ui/ux',
    label: 'UI/UX Design',
    keywords: ['ui', 'ux', 'user experience', 'user interface', 'design'],
    recommendations: [
      { skill: 'Figma', description: 'A popular design tool for creating prototypes and user interfaces.' },
      { skill: 'User Research', description: 'Helps validate designs with the people who will use them.' },
      { skill: 'Accessibility', description: 'Makes your products more inclusive and easier to use.' }
    ]
  },
  {
    id: 'project management',
    label: 'Project Management',
    keywords: ['project management', 'scrum', 'agile', 'kanban', 'product manager'],
    recommendations: [
      { skill: 'Stakeholder Communication', description: 'Keeps cross-functional teams aligned around goals.' },
      { skill: 'Roadmapping', description: 'Helps translate plans into predictable delivery timelines.' },
      { skill: 'Data-Driven Decision Making', description: 'Improves planning using measurable outcomes and metrics.' }
    ]
  },
  {
    id: 'sql',
    label: 'SQL',
    keywords: ['sql', 'database'],
    recommendations: [
      { skill: 'Python', description: 'Python and SQL are often paired for analytics and ETL workflows.' },
      { skill: 'ETL', description: 'Builds reliable workflows to move data between systems.' },
      { skill: 'Data Visualization', description: 'Transforms queried data into clear dashboards and reports.' }
    ]
  }
];

// Career focus categories help prioritize recommendations based on the target role.
// This is inferred from job description text, not from the resume alone.
const CAREER_FOCUS_KEYWORDS = [
  {
    label: 'Data & Analytics',
    keywords: ['data', 'analytics', 'machine learning', 'ai', 'business intelligence', 'data science']
  },
  {
    label: 'Product & Project',
    keywords: ['product', 'project manager', 'scrum', 'agile', 'kanban']
  },
  {
    label: 'Cloud & DevOps',
    keywords: ['cloud', 'aws', 'azure', 'gcp', 'devops', 'kubernetes', 'docker', 'infrastructure']
  },
  {
    label: 'Front-End Web',
    keywords: ['frontend', 'front end', 'react', 'vue', 'angular', 'javascript', 'typescript']
  },
  {
    label: 'Back-End Web',
    keywords: ['backend', 'back end', 'node.js', 'java', 'python', 'api', 'server']
  }
];

// Normalize a text string for simple keyword matching.
// This removes punctuation and collapses whitespace so the matching logic is stable.
function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[’‘'.,\/()\[\]_\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractSkillsFromText(text) {
  const normalized = normalizeText(text);
  const detected = new Set();

  // Find any skill names that match known entries in the synergy map.
  SKILL_SYNERGY_MAP.forEach((entry) => {
    const matches = entry.keywords.some((keyword) => normalized.includes(keyword));
    if (matches) {
      detected.add(entry.label);
    }
  });

  return [...detected];
}

export function inferCareerFocus(text) {
  const normalized = normalizeText(text);
  const focus = CAREER_FOCUS_KEYWORDS.find((entry) =>
    entry.keywords.some((keyword) => normalized.includes(keyword))
  );
  return focus ? focus.label : 'General Career Growth';
}

// Score how well a recommended skill matches the inferred target career focus.
// This lets us sort recommendations so the most relevant skills appear first.
function computeRelevance(skill, careerFocus) {
  const normalizedSkill = normalizeText(skill);
  const normalizedFocus = normalizeText(careerFocus);
  let score = 0;

  if (normalizedFocus.includes('data')) {
    score += ['sql', 'pandas', 'data visualization', 'statistics', 'machine learning', 'power bi'].some((keyword) =>
      normalizedSkill.includes(keyword)
    )
      ? 20
      : 0;
  }

  if (normalizedFocus.includes('cloud')) {
    score += ['docker', 'kubernetes', 'devops', 'infrastructure', 'aws', 'azure', 'gcp'].some((keyword) =>
      normalizedSkill.includes(keyword)
    )
      ? 20
      : 0;
  }

  if (normalizedFocus.includes('front')) {
    score += ['react', 'typescript', 'javascript', 'ui', 'ux'].some((keyword) =>
      normalizedSkill.includes(keyword)
    )
      ? 20
      : 0;
  }

  if (normalizedFocus.includes('project')) {
    score += ['communication', 'roadmapping', 'stakeholder', 'data-driven'].some((keyword) =>
      normalizedSkill.includes(keyword)
    )
      ? 20
      : 0;
  }

  return score + 10;
}

export function getSkillSynergyInsights(currentSkills, careerPath) {
  const normalizedCurrentSkills = new Set(
    currentSkills.map((skill) => normalizeText(skill))
  );
  const recommendations = [];

  // For each known base skill, only generate recommendations when that base skill is present.
  SKILL_SYNERGY_MAP.forEach((entry) => {
    const isPresent = entry.keywords.some((keyword) => normalizedCurrentSkills.has(keyword));
    if (!isPresent) return;

    entry.recommendations.forEach((recommendation) => {
      const normalizedRecommendation = normalizeText(recommendation.skill);
      if (normalizedCurrentSkills.has(normalizedRecommendation)) return;
      if (recommendations.some((item) => normalizeText(item.skill) === normalizedRecommendation)) return;

      recommendations.push({
        skill: recommendation.skill,
        description: recommendation.description,
        source: entry.label,
        relevance: computeRelevance(recommendation.skill, careerPath)
      });
    });
  });

  if (recommendations.length === 0) {
    return [];
  }

  return recommendations
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 6);
}
