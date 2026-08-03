import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { fetchGitHubProfile } from '../services/githubImporter.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// README Templates — detailed prompt directives based on top GitHub profiles
// ---------------------------------------------------------------------------
const TEMPLATES = {
  minimal: {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Elegant, whitespace-driven layout. Less is more.',
    promptDirective: `Use a MINIMAL CLEAN style inspired by the best minimal GitHub profiles. Structure:

1. HEADER: A single centered line with the developer's name in an <h1> tag, followed by a one-line role/tagline in italics. No banners, no GIFs.

2. ABOUT: A short 2-3 sentence paragraph. No bullet points. Conversational but professional tone. Mention current focus and one personal detail.

3. TECH STACK: A single centered row of shields.io flat-style badges (style=flat-square) for their top 5-6 languages/tools. Use accurate brand colors. Example format:
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

4. SELECTED WORK: A clean markdown table with columns: Project | Description | Tech. List their top 3 repos with one-line descriptions. Link project names to the repo URLs.

5. STATS: A single centered GitHub stats card with the "transparent" theme and hide_border=true:
![Stats](https://github-readme-stats.vercel.app/api?username=USERNAME&theme=transparent&hide_border=true&show_icons=true&count_private=true)

6. FOOTER: A single centered line: "Reach me at" followed by one email badge (style=flat-square, logo=gmail).

Rules: No emojis anywhere. Use <div align="center"> for centering. Use <br> for spacing between sections. Keep total under 50 lines. Maximum whitespace, minimum noise. The aesthetic is "Swiss design" — typography and space do the work.`,
  },
  developer: {
    id: 'developer',
    name: 'Developer Pro',
    description: 'The gold standard: animated header, categorized badges, full stats dashboard.',
    promptDirective: `Use a DEVELOPER PRO style — this is the most popular GitHub profile format. Structure:

1. ANIMATED HEADER (centered):
[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=1000&color=58A6FF&center=true&vCenter=true&width=600&lines=Hi+there+%F0%9F%91%8B+I'm+NAME;FULLSTACK_ROLE;LOCATION_BASED)](https://git.io/typing-svg)
Replace NAME, ROLE, LOCATION with actual data. Use %20 for spaces, %F0%9F%91%8B for 👋.

2. SNAKE/CONTRIBUTION BANNER (optional, centered):
![snake gif](https://github.com/USERNAME/USERNAME/blob/output/github-contribution-grid-snake.svg)
Add an HTML comment: <!-- To enable: add a GitHub Action workflow to generate this -->

3. ABOUT ME section with emoji bullet points:
- 🔭 Currently working on: [project/role]
- 🌱 Currently learning: [tech]
- 👯 Looking to collaborate on: [type]
- 💬 Ask me about: [expertise areas]
- 📫 How to reach me: [email/social]
- ⚡ Fun fact: [something personal]

4. TECH STACK — grouped by category with <h3> subheaders and shields.io for-the-badge style badges:
### Languages
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
### Tools & Platforms
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
Group their actual top languages into appropriate categories. Include 12-18 badges total.

5. GITHUB STATS DASHBOARD (centered, side by side using HTML table or <p> with two <img> tags):
<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=USERNAME&show_icons=true&theme=radical&count_private=true" width="49%" />
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=USERNAME&theme=radical" width="49%" />
</p>
<p align="center">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=USERNAME&layout=compact&theme=radical" width="40%" />
</p>

6. TROPHIES (centered):
![trophy](https://github-profile-trophy.vercel.app/?username=USERNAME&theme=radical&column=7&margin-w=8)

7. VISITOR COUNTER (centered, at the very bottom):
![visitors](https://komarev.com/ghpvc/?username=USERNAME&label=Profile%20views&color=0e75b6&style=flat)

Use emojis for section headers (## 🛠️ Tech Stack, ## 📊 GitHub Stats, etc.). Make it visually rich and information-dense.`,
  },
  creative: {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Bold personality, visual flair, and memorable first impressions.',
    promptDirective: `Use a CREATIVE style that makes people stop scrolling. Structure:

1. BANNER: A large centered header using HTML:
<h1 align="center">Hey there! I'm NAME 🎨</h1>
<h3 align="center">WITTY_TAGLINE_HERE</h3>
Followed by a centered GIF or animated divider:
<img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="25px">

2. INTRO: A short punchy paragraph (2-3 sentences) written in first person with personality. Not corporate. Show voice.

3. WHAT I DO: Use a <table> with emoji icons for visual flair:
| | What I Do |
|---|---|
| 💻 | Build full-stack apps with [tech] |
| 🎨 | Design [things] |
| 📝 | Write about [topics] |

4. FEATURED PROJECTS: For each of their top 3-4 repos, create a mini-card:
### 🚀 ProjectName
> One-line description from the repo

**Stack:** badge1 badge2 badge3 | ⭐ Stars | [Live Demo](link) | [Source](link)

5. TECH ARSENAL: A centered grid of shields.io for-the-badge badges. Group loosely but don't over-categorize. Include 10-15 badges with accurate brand colors.

6. STATS with a fun theme:
<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=USERNAME&show_icons=true&theme=synthwave&count_private=true" width="49%" />
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=USERNAME&theme=synthwave" width="49%" />
</p>

7. LET'S CONNECT: Centered social badges with real URLs:
<p align="center">
<a href="LINKEDIN_URL"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
<a href="TWITTER_URL"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" /></a>
<a href="mailto:EMAIL"><img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>
</p>

8. FOOTER: A fun random quote badge:
![Quote](https://quotes-github-readme.vercel.app/api?type=horizontal&theme=dark)

Use emojis liberally. Be expressive. The vibe is "creative developer who has fun with code."`,
  },
  academic: {
    id: 'academic',
    name: 'Academic / Research',
    description: 'Formal, structured, publication-ready layout for researchers.',
    promptDirective: `Use an ACADEMIC/RESEARCH style. Formal tone, no emojis, structured like a CV. Structure:

1. HEADER:
# Full Name, Ph.D. (or appropriate credentials)
**[Position] | [Institution/Lab]**
[Location] | [Email] | [Website]

2. RESEARCH INTERESTS:
A 2-3 sentence paragraph describing research focus areas. Use formal academic language.

3. PUBLICATIONS:
## Publications
Use a numbered list with proper academic citation format:
1. **Paper Title** — Author1, Author2, Author3. *Venue/Journal*, Year. [Paper](link) | [Code](link) | [DOI](link)

If no publications data available, create 3 placeholder entries with the format shown and add an HTML comment: <!-- Replace with your actual publications -->

4. TEACHING:
## Teaching
- **Course Name** — Role (TA/Instructor/Guest Lecturer), Institution, Semester

5. SKILLS & TOOLS:
## Technical Skills
Use a definition-list style:
- **Languages:** Python, R, MATLAB, LaTeX
- **ML/DL:** PyTorch, TensorFlow, scikit-learn
- **Data:** Pandas, NumPy, SQL, Spark
- **Tools:** Git, Docker, SLURM, Jupyter

6. EDUCATION:
## Education
- **Ph.D. in [Field]** — University, Year
- **M.S. in [Field]** — University, Year
- **B.S. in [Field]** — University, Year

7. STATS (subtle, at the bottom):
<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=USERNAME&show_icons=true&theme=default&hide_border=true&count_private=true" width="45%" />
</p>

8. CONTACT:
## Contact
- Email: [email]
- ORCID: [0000-0000-0000-0000]
- Google Scholar: [Profile](link)
- Lab Website: [URL]

No emojis. Use ## headers. Keep it clean, formal, and scannable. Think "academic CV meets GitHub."`,
  },
  startup: {
    id: 'startup',
    name: 'Startup Founder',
    description: 'Impact-driven, metrics-focused layout for builders and founders.',
    promptDirective: `Use a STARTUP FOUNDER style. Bold, confident, metrics-driven. Structure:

1. HEADER (centered):
<h1 align="center">NAME 🚀</h1>
<p align="center"><strong>ONE_LINE_MISSION_STATEMENT</strong></p>
<p align="center"><em>Building @ CurrentCompany — TAGLINE</em></p>

2. CURRENTLY BUILDING:
## 🏗️ Currently Building
**[Product Name]** — One paragraph pitch (2-3 sentences). What problem it solves, who it's for, and current traction.

3. PREVIOUSLY:
## ⏪ Previously
Use a timeline format:
- **2023-Present** — Founder & CEO @ [Company] | [One-line description]
- **2021-2023** — [Role] @ [Company] | [One-line description]
- **2019-2021** — [Role] @ [Company] | [One-line description]

4. METRICS THAT MATTER:
## 📈 By the Numbers
Use a centered table:
| Metric | Value |
|--------|-------|
| Users Served | [X]+ |
| GitHub Stars | [from data] |
| Repos Built | [from data] |
| Years Coding | [estimate] |

5. TECH STACK (compact, one centered row):
## 🛠️ Tech I Use
A single row of 8-10 shields.io for-the-badge badges for their primary tools.

6. SPEAKING & WRITING:
## 🎤 Speaking & Writing
- 📝 [Blog Post Title](link) — Publication, Year
- 🎙️ [Talk Title](link) — Conference, Year
- 📰 Featured in [Publication](link)

If no data, create 2-3 placeholder entries with HTML comments.

7. STATS:
<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=USERNAME&show_icons=true&theme=dark&count_private=true" width="49%" />
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=USERNAME&theme=dark" width="49%" />
</p>

8. CTA:
## 🤝 Let's Talk
<p align="center">
<a href="mailto:EMAIL"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>
<a href="LINKEDIN"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
<a href="CALENDLY"><img src="https://img.shields.io/badge/Schedule-00A2FF?style=for-the-badge&logo=calendly&logoColor=white" /></a>
</p>

Use 🚀📈🏗️ emojis sparingly for section headers. Tone: confident, builder-energy, ship-fast.`,
  },
  devops: {
    id: 'devops',
    name: 'DevOps / SRE',
    description: 'Terminal aesthetics, infrastructure badges, uptime vibes.',
    promptDirective: `Use a DEVOPS/SRE style with terminal aesthetics. Structure:

1. TERMINAL HEADER:
\`\`\`
$ whoami
NAME — DevOps/SRE Engineer
$ cat /etc/location
LOCATION
$ uptime
KEEP_CODING_SINCE years and counting...
\`\`\`

2. ABOUT (styled as terminal output):
## 🖥️ About Me
\`\`\`yaml
role: DevOps/SRE Engineer
company: COMPANY
focus: [CI/CD, Cloud Infrastructure, Kubernetes, Automation]
philosophy: "Automate everything. Monitor everything. Blame nothing."
\`\`\`

3. INFRASTRUCTURE STACK — grouped with shields.io for-the-badge badges:
### ☁️ Cloud & Platforms
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![GCP](https://img.shields.io/badge/GCP-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
### 🐳 Containers & Orchestration
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
### ⚙️ CI/CD & IaC
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
### 📊 Monitoring & Observability
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)

Include 15-20 badges based on their actual tech. Group into: Cloud, Containers, CI/CD, IaC, Monitoring, Scripting.

4. CERTIFICATIONS:
## 📜 Certifications
A row of badge-style entries:
![AWS SA](https://img.shields.io/badge/AWS-Solutions_Architect-FF9900?style=for-the-badge&logo=amazon-aws)
![CKA](https://img.shields.io/badge/CKA-Certified-326CE5?style=for-the-badge&logo=kubernetes)

5. HOMELAB / SIDE PROJECTS:
## 🔧 Homelab & Projects
For top repos: name, one-line description, tech badges, star count.

6. PHILOSOPHY:
> "Hope is not a strategy. Automation is." — Every SRE ever

7. STATS (dark theme):
<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=USERNAME&show_icons=true&theme=dark&count_private=true" width="49%" />
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=USERNAME&theme=dark" width="49%" />
</p>

8. STATUS FOOTER:
## 🟢 Status
| Service | Status |
|---------|--------|
| Motivation | ✅ Operational |
| Coffee Intake | ⚠️ Elevated |
| Prod Incidents | ✅ Zero this week |

Use monospace code blocks, terminal aesthetics, and 🖥️⚙️🐳 emojis. The vibe is "I keep the lights on."`,
  },
  datascience: {
    id: 'datascience',
    name: 'Data Scientist / ML',
    description: 'Analytics-driven layout with models, notebooks, and research focus.',
    promptDirective: `Use a DATA SCIENTIST/ML ENGINEER style. Structure:

1. HEADER:
<h1 align="center">📊 NAME</h1>
<h3 align="center">Data Scientist | ML Engineer | Turning data into decisions</h3>

2. ABOUT:
## 🧠 About Me
A 3-4 sentence paragraph about their ML/AI focus, current work, and what excites them about data. Mention specific domains if known (NLP, CV, RecSys, etc.).

3. RESEARCH FOCUS:
## 🔬 Research Focus
Bullet points of specific ML/AI areas:
- Natural Language Processing (Transformers, LLMs)
- Computer Vision (Object Detection, Segmentation)
- MLOps & Model Deployment
(Adapt to their actual repos/languages)

4. FEATURED PROJECTS (as cards):
## 🚀 Featured Projects
For each top repo, create:
### [Repo Name](link)
> Description from repo

**Type:** [Model/Pipeline/Tool] | **Stack:** ![Python](badge) ![PyTorch](badge) | ⭐ [stars]

5. TECH STACK — grouped:
## 🛠️ Tech Stack
### Languages
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![R](https://img.shields.io/badge/R-276DC3?style=for-the-badge&logo=r&logoColor=white)
### ML Frameworks
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit_learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
### Data & Visualization
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)
![Matplotlib](https://img.shields.io/badge/Matplotlib-11557C?style=for-the-badge)
### Cloud & MLOps
![AWS SageMaker](https://img.shields.io/badge/SageMaker-FF9900?style=for-the-badge&logo=amazon-aws)
![MLflow](https://img.shields.io/badge/MLflow-0194E2?style=for-the-badge)

6. KAGGLE & COMPETITIONS:
## 🏆 Kaggle & Competitions
- 🥇 [Competition Name] — Rank/Score
- 📊 Kaggle Profile: [link]
(Use placeholders if no data)

7. STATS:
<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=USERNAME&show_icons=true&theme=algolia&count_private=true" width="49%" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=USERNAME&layout=compact&theme=algolia" width="40%" />
</p>

8. CURRENTLY EXPLORING:
## 🔭 Currently Exploring
- [New tech/paper/domain they're learning]

Use 📊🧠🔬🚀 emojis for headers. Tone: analytical, curious, precise.`,
  },
  opensource: {
    id: 'opensource',
    name: 'Open Source Hero',
    description: 'Community-first layout celebrating contributions and collaboration.',
    promptDirective: `Use an OPEN SOURCE HERO style. Warm, welcoming, community-focused. Structure:

1. HEADER:
<h1 align="center">Hey, I'm NAME! 👋</h1>
<p align="center"><em>Open Source Enthusiast | Community Builder | CODE_LANGUAGE Developer</em></p>
<p align="center">
  <img src="https://komarev.com/ghpvc/?username=USERNAME&label=Profile%20views&color=4CAF50&style=flat" />
</p>

2. ABOUT:
## 🌟 About Me
A warm 3-4 sentence paragraph emphasizing love for open source, community, and collaboration. Mention what drives them.

3. MY PROJECTS (table format):
## 💚 My Projects
| Project | Description | Language | Stars |
|---------|-------------|----------|-------|
| [Name](link) | Description | ![Lang](badge) | ⭐ count |

List their top 4-5 repos.

4. CONTRIBUTIONS:
## 🤝 Open Source Contributions
- Contributed to [Notable Project](link) — [what they did]
- Maintainer of [Project](link)
- Active in [Community/Org]

5. HOW TO COLLABORATE:
## 🙌 Let's Collaborate!
> I'm always open to collaborating on open source projects!
> - 🐛 Found a bug? Open an issue!
> - 💡 Have an idea? Start a discussion!
> - 🔧 Want to contribute? Check the CONTRIBUTING.md!

6. STATS DASHBOARD (full width):
<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=USERNAME&show_icons=true&theme=merko&count_private=true" width="49%" />
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=USERNAME&theme=merko" width="49%" />
</p>
<p align="center">
  <img src="https://github-profile-trophy.vercel.app/?username=USERNAME&theme=flat&column=7&margin-w=8" />
</p>

7. ACTIVITY GRAPH:
![Activity](https://github-readme-activity-graph.vercel.app/graph?username=USERNAME&theme=merko)

8. CONNECT:
## 📫 Let's Connect
<p align="center">
<a href="LINKEDIN"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
<a href="TWITTER"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" /></a>
<a href="mailto:EMAIL"><img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>
</p>

Use 🌟🤝💚🙌 emojis. Emphasize community values, collaboration, and giving back. The vibe is "open source is love."`,
  },
  freelancer: {
    id: 'freelancer',
    name: 'Freelancer / Consultant',
    description: 'Client-facing, conversion-focused layout showcasing services.',
    promptDirective: `Use a FREELANCER/CONSULTANT style. Professional, conversion-focused, client-ready. Structure:

1. HEADER:
<h1 align="center">NAME</h1>
<p align="center"><strong>FULL_STACK_ROLE | Available for freelance work</strong></p>
<p align="center">
  <img src="https://img.shields.io/badge/Status-Available_for_hire-brightgreen?style=for-the-badge" />
</p>

2. ABOUT:
## 💼 About
A professional 2-3 sentence pitch. What they do, who they help, and what makes them different. Client-focused language.

3. SERVICES:
## ✨ Services I Offer
| Service | Description |
|---------|-------------|
| 🌐 Web Development | Full-stack web apps with [tech] |
| 🔌 API Design | RESTful & GraphQL APIs |
| 📱 Mobile Apps | Cross-platform with [tech] |
| 🎯 Consulting | Architecture reviews & tech strategy |

4. SELECTED WORK:
## 🏆 Selected Work
For top 3-4 repos:
### [Project Name](link)
> Client/Description — Outcome achieved

**Tech:** badge1 badge2 badge3 | **Result:** [metric if available]

5. TECH STACK (compact):
## 🛠️ Tech Stack
A centered row of 10-12 shields.io for-the-badge badges for their primary tools.

6. TESTIMONIALS:
## 💬 What Clients Say
> "Quote about their work." — **Client Name**, Company

> "Another quote." — **Client Name**, Company

(Use placeholders with HTML comments if no data)

7. PROCESS:
## 🔄 My Process
\`\`\`
Discovery → Design → Build → Test → Ship → Support
\`\`\`
Brief one-line description of each phase.

8. STATS:
<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=USERNAME&show_icons=true&theme=default&count_private=true&hide_border=true" width="45%" />
</p>

9. CTA:
## 📬 Let's Work Together
<p align="center">
<a href="mailto:EMAIL"><img src="https://img.shields.io/badge/Email_Me-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>
<a href="CALENDLY"><img src="https://img.shields.io/badge/Book_a_Call-00A2FF?style=for-the-badge&logo=calendly&logoColor=white" /></a>
<a href="PORTFOLIO"><img src="https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white" /></a>
</p>

Use 💼✨🏆 emojis sparingly. Tone: professional, confident, approachable. Focus on outcomes and client value.`,
  },
  gamer: {
    id: 'gamer',
    name: 'Gamer / Streamer',
    description: 'High-energy, fun layout for game devs and content creators.',
    promptDirective: `Use a GAMER/STREAMER style. High energy, fun, gaming aesthetics. Structure:

1. HEADER (bold, animated):
[![Typing SVG](https://readme-typing-svg.demolab.com?font=Press+Start+2P&size=20&duration=4000&pause=1000&color=FF6B6B&center=true&vCenter=true&width=600&lines=PLAYER+ONE%3A+NAME;CLASS%3A+DEVELOPER;LEVEL%3A+EXPERIENCED;STATUS%3A+ONLINE)](https://git.io/typing-svg)

2. CHARACTER SHEET:
## 🎮 Character Sheet
\`\`\`
┌─────────────────────────────────┐
│  Name:     NAME                 │
│  Class:    Full-Stack Developer │
│  Location: LOCATION             │
│  Guild:    COMPANY              │
│  Level:    YEARS+ XP            │
│  Status:   🟢 Online            │
└─────────────────────────────────┘
\`\`\`

3. QUEST LOG (Projects):
## ⚔️ Quest Log
| Quest | Difficulty | Status | Reward |
|-------|-----------|--------|--------|
| [Repo1](link) | ⭐⭐⭐ | ✅ Complete | Stars stars |
| [Repo2](link) | ⭐⭐⭐⭐ | 🔄 In Progress | — |
| [Repo3](link) | ⭐⭐ | ✅ Complete | Stars stars |

4. SKILL TREE (Tech Stack):
## 🌳 Skill Tree
### Main Class: [Primary Language]
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
### Sub Class: [Secondary]
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
### Support Skills: [Tools]
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

5. ACHIEVEMENTS UNLOCKED:
## 🏆 Achievements Unlocked
- 🥇 First Repository Created
- ⭐ 100+ Stars Earned
- 🔥 365 Day Streak
- 🐛 1000 Bugs Squashed
- 🤝 First PR Merged to OSS

6. STATS (use a fun theme):
<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=USERNAME&show_icons=true&theme=dracula&count_private=true" width="49%" />
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=USERNAME&theme=dracula" width="49%" />
</p>

7. NOW PLAYING:
## 🎵 Now Playing
![Spotify](https://img.shields.io/badge/Spotify-1ED760?style=for-the-badge&logo=spotify&logoColor=white)
<!-- Add spotify-now-playing widget if desired -->

8. SOCIAL LINKS:
## 📡 Multiplayer Links
<p align="center">
<a href="DISCORD"><img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" /></a>
<a href="TWITCH"><img src="https://img.shields.io/badge/Twitch-9146FF?style=for-the-badge&logo=twitch&logoColor=white" /></a>
<a href="YOUTUBE"><img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" /></a>
<a href="TWITTER"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" /></a>
</p>

9. FOOTER:
<!-- ↑↑↓↓←→←→BA — You found the Konami code! 🎉 -->
<p align="center"><em>GG WP! Thanks for visiting my profile 🕹️</em></p>

Use 🎮🕹️⚡🏆🗡️ emojis liberally. Make it feel like a game UI. High energy, fun, nerdy.`,
  },
};

// ---------------------------------------------------------------------------
// GET /api/readme-generator/templates
// ---------------------------------------------------------------------------
router.get('/templates', (req, res) => {
  res.json({
    success: true,
    templates: Object.values(TEMPLATES).map(({ id, name, description }) => ({ id, name, description })),
  });
});

// ---------------------------------------------------------------------------
// POST /api/readme-generator/fetch-profile
// Fetches GitHub profile data for preview
// ---------------------------------------------------------------------------
router.post('/fetch-profile', verifyToken, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ success: false, error: 'GitHub username is required' });
    }

    // Clean username (handles full URLs, @, trailing paths)
    let cleanUsername = username.trim();
    cleanUsername = cleanUsername.replace(/^https?:\/\/(www\.)?github\.com\//i, '').replace(/^@/, '');
    cleanUsername = cleanUsername.split('/')[0].trim();

    if (!cleanUsername) {
      return res.status(400).json({ success: false, error: 'Invalid GitHub username' });
    }

    const githubToken = req.headers['x-github-token'] || null;
    const profile = await fetchGitHubProfile(cleanUsername, githubToken);

    res.json({ success: true, profile });
  } catch (error) {
    console.error('README Generator - Fetch Profile Error:', error);
    const statusCode = error.status || error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to fetch GitHub profile'
    });
  }
});

// ---------------------------------------------------------------------------
// POST /api/readme-generator/generate
// Generates README.md using AI
// ---------------------------------------------------------------------------
router.post('/generate', verifyToken, extractAIProvider, async (req, res) => {
  try {
    const { username, templateId, customInstructions } = req.body;

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ success: false, error: 'GitHub username is required' });
    }
    if (!templateId || !TEMPLATES[templateId]) {
      return res.status(400).json({ success: false, error: 'Valid templateId is required' });
    }

    // Clean username
    let cleanUsername = username.trim();
    cleanUsername = cleanUsername.replace(/^https?:\/\/(www\.)?github\.com\//i, '').replace(/^@/, '');
    cleanUsername = cleanUsername.split('/')[0].trim();

    if (!cleanUsername) {
      return res.status(400).json({ success: false, error: 'Invalid GitHub username' });
    }

    // Fetch GitHub profile
    const githubToken = req.headers['x-github-token'] || null;
    const profile = await fetchGitHubProfile(cleanUsername, githubToken);

    // Build AI prompt
    const template = TEMPLATES[templateId];
    const profileSummary = [
      `Name: ${profile.name}`,
      `Username: ${profile.username}`,
      `Bio: ${profile.bio || 'N/A'}`,
      `Company: ${profile.company || 'N/A'}`,
      `Location: ${profile.location || 'N/A'}`,
      `Blog: ${profile.blog || 'N/A'}`,
      `Public Repos: ${profile.public_repos}`,
      `Followers: ${profile.followers}`,
      `Total Stars: ${profile.totalStars}`,
      `Top Languages: ${profile.topLanguages.join(', ')}`,
      `Top Repositories:`,
      ...profile.topRepositories.map(r =>
        `  - ${r.name} (${r.language || 'N/A'}, ${r.stars}★): ${r.description || 'No description'}`
      ),
    ].join('\n');

    const prompt = `You are a world-class GitHub profile README designer. You craft visually stunning, information-rich profile READMEs that make developers stand out. You study the best profiles on GitHub (like those featured in "awesome-github-profile-readme" repos) and replicate their quality.

DEVELOPER PROFILE DATA:
${profileSummary}

TEMPLATE STYLE INSTRUCTIONS:
${template.promptDirective}

${customInstructions ? `ADDITIONAL USER INSTRUCTIONS:\n${customInstructions}\n` : ''}
CRITICAL RULES FOR OUTPUT QUALITY:

1. OUTPUT FORMAT: Output ONLY the raw markdown content. No explanations, no wrapping code fences, no commentary before or after.

2. SHIELDS.IO BADGES — Use REAL, working badge URLs with accurate brand colors:
   - Format: https://img.shields.io/badge/LABEL-COLOR?style=for-the-badge&logo=LOGO&logoColor=white
   - Use correct hex colors: Python=#3776AB, JavaScript=#F7DF1E, TypeScript=#3178C6, React=#20232A, Node.js=#43853D, Docker=#2496ED, AWS=#232F3E, Git=#F05032, Linux=#FCC624, etc.
   - Use correct logo slugs from simple-icons (e.g., logo=react, logo=node.js, logo=python, logo=docker, logo=kubernetes)
   - Include 10-20 badges for tech stack sections. Never use fake/invented badge URLs.

3. GITHUB WIDGETS — Use these EXACT URLs (replace USERNAME with "${cleanUsername}"):
   - Stats: https://github-readme-stats.vercel.app/api?username=${cleanUsername}&show_icons=true&count_private=true&theme=THEME
   - Streak: https://github-readme-streak-stats.herokuapp.com/?user=${cleanUsername}&theme=THEME
   - Top Languages: https://github-readme-stats.vercel.app/api/top-langs/?username=${cleanUsername}&layout=compact&theme=THEME
   - Trophies: https://github-profile-trophy.vercel.app/?username=${cleanUsername}&theme=THEME&column=7&margin-w=8
   - Typing SVG: https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=1000&color=COLOR&center=true&vCenter=true&width=600&lines=LINE1;LINE2;LINE3
   - Visitor counter: https://komarev.com/ghpvc/?username=${cleanUsername}&label=Profile%20views&color=COLOR&style=flat
   - Activity graph: https://github-readme-activity-graph.vercel.app/graph?username=${cleanUsername}&theme=THEME

4. HTML ALIGNMENT — Use proper HTML for centering and layout:
   - <div align="center"> or <p align="center"> for centered content
   - <img src="..." width="49%" /> for side-by-side stat cards
   - <br> for vertical spacing between sections
   - <table> for structured data when appropriate
   - <details><summary> for collapsible sections if content is long

5. REAL DATA ONLY — Use the developer's ACTUAL repos, languages, stars, and stats from the profile data above. NEVER invent fake repositories, fake star counts, or fake metrics. If data is missing, use tasteful placeholders with HTML comments like <!-- Replace with your actual data -->.

6. VISUAL HIERARCHY:
   - Use ## for main sections, ### for subsections
   - Add horizontal rules (---) between major sections for breathing room
   - Use > blockquotes for highlights/philosophy
   - Use **bold** for emphasis, *italics* for subtitles
   - Keep consistent spacing: one blank line between elements

7. PERSONALITY: Match the tone to the template style. Make it feel like a real human wrote it, not a generic template. Reference their actual projects, languages, and bio.

8. SETUP INSTRUCTIONS: Include this HTML comment at the very TOP of the output:
<!--
  📋 SETUP INSTRUCTIONS:
  1. Create a new repository named "${cleanUsername}/${cleanUsername}" (same as your username)
  2. Add this content as README.md in that repository
  3. GitHub will automatically display it on your profile!
  4. For the snake animation, add a GitHub Action workflow (see: github.com/Platane/snk)
-->

Generate the complete, production-ready README.md now:`;

    const provider = req.aiProvider;
    const result = await provider.generateContent(prompt);

    // Clean the response (remove wrapping code fences if present)
    let readme = result.text || '';
    readme = readme.replace(/^```markdown\n?/i, '').replace(/\n?```$/i, '').trim();

    res.json({
      success: true,
      readme,
      profile: {
        username: profile.username,
        name: profile.name,
        avatar_url: profile.avatar_url,
      },
      template: { id: template.id, name: template.name },
    });
  } catch (error) {
    console.error('README Generator - Generate Error:', error);
    const statusCode = error.status || error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to generate README'
    });
  }
});

export default router;
