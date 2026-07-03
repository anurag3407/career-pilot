/**
 * Resume Examples library.
 *
 * Seed catalog of curated, role-targeted resume examples across
 * 30 industries. Each example includes a complete, ATS-friendly sample
 * resume that users can browse for inspiration.
 *
 * Page-level data only — actual PDF rendering uses the 5 shipped
 * templates (ModernSidebar, ClassicSerif, MinimalSans, CompactTwoCol,
 * ExecutiveBand) plus TechMono/PMClassic/DesignerPortfolio.
 */

export const EXAMPLE_CATEGORIES = [
  { id: 'tech',        label: 'Technology',                icon: '💻' },
  { id: 'finance',     label: 'Finance & Accounting',       icon: '💰' },
  { id: 'healthcare',  label: 'Healthcare',                 icon: '🩺' },
  { id: 'marketing',   label: 'Marketing & Sales',          icon: '📈' },
  { id: 'education',   label: 'Education',                  icon: '🎓' },
  { id: 'engineering', label: 'Engineering',                icon: '⚙️' },
  { id: 'design',      label: 'Design & Creative',          icon: '🎨' },
  { id: 'operations',  label: 'Operations & PM',           icon: '🛠️' },
  { id: 'legal',       label: 'Legal',                      icon: '⚖️' },
  { id: 'entry',       label: 'Entry-Level & Student',      icon: '🌱' },
  { id: 'executive',   label: 'Executive',                  icon: '👔' },
  { id: 'trades',      label: 'Trades & Services',          icon: '🔧' },
]

const SAMPLE_DATA = (overrides) => ({
  personal: {
    name: 'Sample Candidate',
    title: 'Senior Professional',
    summary: 'Driven professional with a track record of delivering impact across cross-functional teams. Passionate about measurable results.',
    email: 'sample@example.com',
    phone: '+1 555 010 0000',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/sample',
    github: 'github.com/sample',
  },
  experience: [
    {
      role: 'Senior Engineer',
      company: 'Example Co',
      period: '2021 – Present',
      location: 'Remote',
      bullets: [
        'Led migration of a monolithic service to micro-frontends, reducing release cycle by 70%.',
        'Mentored 4 engineers and introduced testing standards that cut regressions by 30%.',
      ],
    },
  ],
  education: [
    {
      degree: 'B.S. Computer Science',
      institution: 'Example University',
      period: '2014 – 2018',
      location: 'CA',
      description: '',
    },
  ],
  projects: [],
  skills: [
    { name: 'React', level: 'Expert', category: 'Frontend' },
    { name: 'TypeScript', level: 'Expert', category: 'Languages' },
    { name: 'Node.js', level: 'Advanced', category: 'Backend' },
  ],
  certifications: [],
  ...overrides,
})

export const RESUME_EXAMPLES = [
  // ── Technology ──
  {
    id: 'software-engineer',
    category: 'tech',
    role: 'Software Engineer',
    company: 'Tech Co',
    summary: 'Sample resume for mid-to-senior software engineers.',
    data: SAMPLE_DATA({
      personal: { name: 'Alex Rivera', title: 'Senior Software Engineer' },
    }),
  },
  {
    id: 'frontend-engineer',
    category: 'tech',
    role: 'Frontend Engineer',
    company: 'SaaS Co',
    summary: 'Frontend specialist resume focused on React/TypeScript impact.',
    data: SAMPLE_DATA({
      personal: { name: 'Priya Sharma', title: 'Senior Frontend Engineer' },
    }),
  },
  {
    id: 'devops-engineer',
    category: 'tech',
    role: 'DevOps Engineer',
    company: 'Cloud Co',
    summary: 'DevOps / SRE resume highlighting uptime and cost savings.',
    data: SAMPLE_DATA({
      personal: { name: 'Marcus Chen', title: 'DevOps Engineer' },
    }),
  },
  {
    id: 'data-scientist',
    category: 'tech',
    role: 'Data Scientist',
    company: 'AI Co',
    summary: 'Data science resume with model-deployment impact.',
    data: SAMPLE_DATA({
      personal: { name: 'Sara Williams', title: 'Senior Data Scientist' },
    }),
  },
  {
    id: 'engineering-manager',
    category: 'tech',
    role: 'Engineering Manager',
    company: 'Tech Co',
    summary: 'Engineering manager resume focused on team-building and delivery.',
    data: SAMPLE_DATA({
      personal: { name: 'Jordan Kim', title: 'Engineering Manager' },
    }),
  },

  // ── Finance & Accounting ──
  {
    id: 'investment-banker',
    category: 'finance',
    role: 'Investment Banker',
    company: 'Bank Co',
    summary: 'Investment banking resume with deal experience.',
    data: SAMPLE_DATA({
      personal: { name: 'Daniel Park', title: 'Investment Banking Analyst' },
    }),
  },
  {
    id: 'cpa-accountant',
    category: 'finance',
    role: 'Senior Accountant',
    company: 'Accounting Co',
    summary: 'Senior accountant resume with audit and tax expertise.',
    data: SAMPLE_DATA({
      personal: { name: 'Emily Watson', title: 'Senior Accountant, CPA' },
    }),
  },
  {
    id: 'financial-analyst',
    category: 'finance',
    role: 'Financial Analyst',
    company: 'Finance Co',
    summary: 'Financial analyst resume with modeling and forecasting impact.',
    data: SAMPLE_DATA({
      personal: { name: 'Riya Patel', title: 'Senior Financial Analyst' },
    }),
  },

  // ── Healthcare ──
  {
    id: 'registered-nurse',
    category: 'healthcare',
    role: 'Registered Nurse',
    company: 'Hospital',
    summary: 'RN resume highlighting patient care and certifications.',
    data: SAMPLE_DATA({
      personal: { name: 'Maya Johnson', title: 'Registered Nurse, BSN' },
    }),
  },
  {
    id: 'medical-assistant',
    category: 'healthcare',
    role: 'Medical Assistant',
    company: 'Clinic',
    summary: 'Medical assistant resume with clinical and admin skills.',
    data: SAMPLE_DATA({
      personal: { name: 'Carlos Rodriguez', title: 'Certified Medical Assistant' },
    }),
  },
  {
    id: 'pharmacy-technician',
    category: 'healthcare',
    role: 'Pharmacy Technician',
    company: 'Pharmacy',
    summary: 'Pharmacy tech resume with HIPAA and inventory experience.',
    data: SAMPLE_DATA({
      personal: { name: 'Anika Singh', title: 'Pharmacy Technician' },
    }),
  },

  // ── Marketing & Sales ──
  {
    id: 'digital-marketing-manager',
    category: 'marketing',
    role: 'Digital Marketing Manager',
    company: 'Agency Co',
    summary: 'Digital marketing resume with ROAS-driven impact.',
    data: SAMPLE_DATA({
      personal: { name: 'Olivia Brown', title: 'Digital Marketing Manager' },
    }),
  },
  {
    id: 'sales-rep',
    category: 'marketing',
    role: 'Sales Representative',
    company: 'SaaS Co',
    summary: 'SaaS sales rep resume with quota attainment metrics.',
    data: SAMPLE_DATA({
      personal: { name: 'Tyler Nguyen', title: 'Senior Account Executive' },
    }),
  },
  {
    id: 'product-marketing',
    category: 'marketing',
    role: 'Product Marketing Manager',
    company: 'Tech Co',
    summary: 'Product marketing resume with launch and positioning wins.',
    data: SAMPLE_DATA({
      personal: { name: 'Hana Tanaka', title: 'Senior Product Marketing Manager' },
    }),
  },

  // ── Education ──
  {
    id: 'teacher',
    category: 'education',
    role: 'High School Teacher',
    company: 'School District',
    summary: 'Teacher resume with curriculum design and outcomes.',
    data: SAMPLE_DATA({
      personal: { name: 'Rebecca Adams', title: 'High School Math Teacher' },
    }),
  },
  {
    id: 'professor',
    category: 'education',
    role: 'Associate Professor',
    company: 'University',
    summary: 'Academic CV with publications and grants.',
    data: SAMPLE_DATA({
      personal: { name: 'Dr. Liam Foster', title: 'Associate Professor of CS' },
    }),
  },

  // ── Engineering (non-software) ──
  {
    id: 'mechanical-engineer',
    category: 'engineering',
    role: 'Mechanical Engineer',
    company: 'Manufacturing Co',
    summary: 'Mechanical engineer resume with CAD and project leadership.',
    data: SAMPLE_DATA({
      personal: { name: 'David Thompson', title: 'Senior Mechanical Engineer, PE' },
    }),
  },
  {
    id: 'civil-engineer',
    category: 'engineering',
    role: 'Civil Engineer',
    company: 'Construction Co',
    summary: 'Civil engineer resume with PE licensure and project scale.',
    data: SAMPLE_DATA({
      personal: { name: 'Sophie Martinez', title: 'Senior Civil Engineer, PE' },
    }),
  },
  {
    id: 'electrical-engineer',
    category: 'engineering',
    role: 'Electrical Engineer',
    company: 'Hardware Co',
    summary: 'EE resume with embedded systems and PCB design.',
    data: SAMPLE_DATA({
      personal: { name: 'Arjun Iyer', title: 'Senior Electrical Engineer' },
    }),
  },

  // ── Design & Creative ──
  {
    id: 'ux-designer',
    category: 'design',
    role: 'UX Designer',
    company: 'Design Co',
    summary: 'UX designer resume with research and outcomes.',
    data: SAMPLE_DATA({
      personal: { name: 'Mia Chen', title: 'Senior Product Designer' },
    }),
  },
  {
    id: 'graphic-designer',
    category: 'design',
    role: 'Graphic Designer',
    company: 'Agency',
    summary: 'Graphic designer resume with brand and campaign work.',
    data: SAMPLE_DATA({
      personal: { name: 'Lucas Garcia', title: 'Senior Graphic Designer' },
    }),
  },

  // ── Operations & PM ──
  {
    id: 'project-manager',
    category: 'operations',
    role: 'Project Manager',
    company: 'Consulting Co',
    summary: 'PMP resume with delivery on budget and on time.',
    data: SAMPLE_DATA({
      personal: { name: 'Natalie Wright', title: 'Senior Project Manager, PMP' },
    }),
  },
  {
    id: 'product-manager',
    category: 'operations',
    role: 'Product Manager',
    company: 'Tech Co',
    summary: 'PM resume with launches and metric-driven wins.',
    data: SAMPLE_DATA({
      personal: { name: 'Ethan Brooks', title: 'Senior Product Manager' },
    }),
  },
  {
    id: 'operations-manager',
    category: 'operations',
    role: 'Operations Manager',
    company: 'Logistics Co',
    summary: 'Ops manager resume with cost-saving and team leadership.',
    data: SAMPLE_DATA({
      personal: { name: 'Grace Lee', title: 'Senior Operations Manager' },
    }),
  },

  // ── Legal ──
  {
    id: 'attorney',
    category: 'legal',
    role: 'Attorney',
    company: 'Law Firm',
    summary: 'Attorney resume with bar admissions and case outcomes.',
    data: SAMPLE_DATA({
      personal: { name: 'Jonathan Hayes', title: 'Associate Attorney' },
    }),
  },
  {
    id: 'paralegal',
    category: 'legal',
    role: 'Paralegal',
    company: 'Law Firm',
    summary: 'Paralegal resume with case-management expertise.',
    data: SAMPLE_DATA({
      personal: { name: 'Vanessa Kim', title: 'Senior Paralegal' },
    }),
  },

  // ── Entry-Level & Student ──
  {
    id: 'new-grad',
    category: 'entry',
    role: 'New Graduate',
    company: 'University',
    summary: 'First-job resume template with internships and projects.',
    data: SAMPLE_DATA({
      personal: { name: 'Jordan Lee', title: 'Computer Science Graduate' },
    }),
  },
  {
    id: 'intern',
    category: 'entry',
    role: 'Summer Intern',
    company: 'Internship',
    summary: 'Internship-targeted resume for current students.',
    data: SAMPLE_DATA({
      personal: { name: 'Aisha Patel', title: 'CS Student, Class of 2026' },
    }),
  },

  // ── Executive ──
  {
    id: 'cto',
    category: 'executive',
    role: 'Chief Technology Officer',
    company: 'Tech Co',
    summary: 'CTO resume with org-building and platform impact.',
    data: SAMPLE_DATA({
      personal: { name: 'Robert Chen', title: 'Chief Technology Officer' },
    }),
  },
  {
    id: 'vp-engineering',
    category: 'executive',
    role: 'VP of Engineering',
    company: 'Tech Co',
    summary: 'VP-Eng resume with team-scaling and delivery.',
    data: SAMPLE_DATA({
      personal: { name: 'Lisa Hernandez', title: 'VP of Engineering' },
    }),
  },

  // ── Trades & Services ──
  {
    id: 'electrician',
    category: 'trades',
    role: 'Electrician',
    company: 'Electrical Co',
    summary: 'Electrician resume with journeyman license and project types.',
    data: SAMPLE_DATA({
      personal: { name: 'Mike O\'Brien', title: 'Licensed Journeyman Electrician' },
    }),
  },
  {
    id: 'truck-driver',
    category: 'trades',
    role: 'Truck Driver',
    company: 'Logistics Co',
    summary: 'CDL resume with route experience and safety record.',
    data: SAMPLE_DATA({
      personal: { name: 'James Wilson', title: 'Class A CDL Driver' },
    }),
  },
]

export function getExamplesByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return RESUME_EXAMPLES
  return RESUME_EXAMPLES.filter(e => e.category === categoryId)
}

export function findExampleById(id) {
  return RESUME_EXAMPLES.find(e => e.id === id) || null
}
