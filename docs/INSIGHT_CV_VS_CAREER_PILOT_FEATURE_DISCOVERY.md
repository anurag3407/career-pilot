# insight.cv vs career-pilot — Feature Discovery Report

> **Date:** 2026-06-23
> **Scope:** Compare insight.cv's navigation/feature mapping against career-pilot's feature surface, with focus on placing each feature correctly in the user flow (standalone vs chained).

---

## ⚠️ Insight.cv Reachability Note

`insight.cv` and `www.insight.cv` do not currently resolve from the build environment (NXDOMAIN). The canonical URL plus 12 mirrors/alternates were attempted:

| Attempted URL | Result |
|---|---|
| `insight.cv` | NXDOMAIN |
| `www.insight.cv` | NXDOMAIN |
| `cv-insight.help` | ✅ Returned full site content |
| `cvinsight.me` | Only `<title>` tag |
| `www.cvinsight.me/about` | Only `<title>` tag |
| `www.cvinsight.me/features` | Only `<title>` tag |
| `www.cvinsight.me/tools` | Only `<title>` tag |
| `www.cvinsight.me/products` | Only `<title>` tag |
| `www.cvinsight.app` | fetch failed |
| `www.cvinsight.io` | Only login page |
| `insightcv.com` / `www.insightcv.com` | empty |
| `insightcv.ai` / `www.insightcv.io` / `tryinsight.cv` | fetch failed |
| `insight.career` / `insighty.io` | fetch failed / unrelated (agency platform) |
| GitHub `anandreddy05/Insight_CV` README | ✅ Returned recruiter+job-seeker pipeline |
| GitHub `anshikaxaa/InsightCV` README | ✅ Returned inline feature list |

Only **two** sources returned usable product surface data:
- `cv-insight.help` (CV Insight — single-product analyzer site)
- GitHub `anshikaxaa/InsightCV` README (inline-only dual-pipeline feature list)

The insight.cv column below is built from these two reachable mirrors. Treat it as a best-effort inference, not a literal mirror of `insight.cv`.

---

## 1. insight.cv — Navigation & Feature Mapping (best-effort)

### 1.1 Navigation menu (from `cv-insight.help`)

| # | Link | Destination |
|---|---|---|
| 1 | `CV Insight` (logo) | `#top` |
| 2 | Product | `#workflow` |
| 3 | Features | `#features` |
| 4 | Get feedback | `#workflow` |

### 1.2 Standalone tools (own landing / entry point)

| # | Tool | Trigger | Output |
|---|---|---|---|
| 1 | **CV Analyzer** | Upload PDF résumé + optional role description → "Generate insights" | Single structured brief (≈5–10s, no signup, not stored) |

### 1.3 Inline features (produced by the analyzer in one pass)

| # | Feature | Notes |
|---|---|---|
| 1 | Fit score & rationale | Score + short explanation |
| 2 | Profile & skills view | Per-axis profile scores, technical + soft skills |
| 3 | Strengths & gaps | Standouts + likely interviewer probes |
| 4 | Interview prep | Practice questions with difficulty hints |
| 5 | Writing signal | Human vs template-like read |
| 6 | Summary & fixes | Overview + same-day improvement tips |

### 1.4 Recruiter pipeline (from `anshikaxaa/InsightCV` README — job-seeker flip side)

| # | Feature | Type |
|---|---|---|
| 1 | Resume Upload | inline |
| 2 | LLM-Based Scoring | inline |
| 3 | Candidate Ranking | inline |
| 4 | Dashboard | inline |
| 5 | Resume Optimization (paste JD) | inline |
| 6 | Skill Enhancement | inline |
| 7 | LLM Suggestions | inline |

**insight.cv's architecture in one sentence:** A single upload → analyzer → outputs multiple feature sections inline. There are essentially **no chained cross-tool flows** — the entire UX is one tool.

---

## 2. career-pilot — Feature Mapping (from the codebase)

### 2.1 Standalone tools (own landing / entry point)

| # | Tool | Public landing route | In-app route | Backend |
|---|---|---|---|---|
| 1 | **Resume Builder** | `/resume-builder` (custom design) | `/resume-builder/build` + `/upload` + `/text-to-resume` | `resume.js`, `enhance.js`, `upload.js`, `input.route.js` |
| 2 | **Portfolio Builder** | `/portfolio-builder` | `/portfolio/build` + `/hub/portfolio` | `portfolio.js` |
| 3 | **GitHub Portfolio** | `/github-portfolio` | `/github-portfolio/build` + `/hub/portfolio/github` | `portfolioGithub.js` |
| 4 | **Resume Roast** | `/resume-roast` | `/resume-roast/analyze` + `/hub/roast` | `roast.js` |
| 5 | **Project Visualizer** | `/project-visualizer` | `/project-visualizer` | `projectVisualizer.route.js`, `repoAnalyzer.js` |
| 6 | **Job Finder** | `/job-finder` | `/job-finder/search` + `/hub/jobs` | `jobsRoute.js`, `jobTracker.js`, `jobAlerts.js` |
| 7 | **Mock Interview** | `/mock-interview` | `/mock-interview/practice` + `/interview-prep` + `/hub/interview` | `interview.js` |
| 8 | **Email Generator** | (no landing) | `/email-generator` | `emailTracking.js` |
| 9 | **Fellowship** | (no landing) | `/fellowship` + `/hub/fellowship` | `fellowships.js`, `payments.js` |
| 10 | **Community** | (no landing) | `/community` + `/hub/community` | `community.js` |

### 2.2 Chained / inline features (subordinate to a primary flow)

| # | Feature | Parent flow | Backend |
|---|---|---|---|
| 1 | Cover Letter Generator | Resume Builder / Job Finder | `coverLetter.js` |
| 2 | Cold Outreach | Job Finder | `outreach.route.js` |
| 3 | Email Tracking | Email Generator / Outreach | `emailTracking.js` |
| 4 | LinkedIn Optimizer | Resume (adjacent) + Dashboard | `ai.js`, `enhance.js` |
| 5 | Skill Gap Analyzer | Resume / Career Growth | `enhance.js` |
| 6 | Career Trajectory | Career Growth | `enhance.js` |
| 7 | ATS Score / Enhance / Summary / Tailor / Translate | Resume Builder | `enhance.js` |
| 8 | Resume Importers (Text / GitHub / LinkedIn / File) | Resume Builder | `resume.js`, `upload.js` |
| 9 | Resume Templates | Resume Builder (pre-step) | — |
| 10 | Salary Estimator | Job Finder (companion) | (likely `ai.js`) |
| 11 | ATS Dashboard | Dashboard | `enhance.js` |
| 12 | Dashboard sub-widgets | Dashboard | `Dashboard.jsx` |
| 13 | Interview Replay / History / Prep | Mock Interview | `interview.js` |
| 14 | Job Tracker / Job Alerts | Job Finder | `jobTracker.js`, `jobAlerts.js` |
| 15 | Collaboration (share + comments) | Resume | `collaboration.js` |

### 2.3 Utility / supporting (not user-facing feature surfaces)

Auth, 2FA, Profile, Settings, Payments, GDPR, Bug Reports, Global Search, Admin Console, Bull Board, Recruiter leaderboard.

---

## 3. Side-by-side comparison

| Dimension | insight.cv | career-pilot |
|---|---|---|
| **Total standalone tools** | 1 (CV Analyzer) | 10 (Resume Builder, Portfolio, GitHub Portfolio, Roast, Project Visualizer, Job Finder, Mock Interview, Email Generator, Fellowship, Community) |
| **Total inline feature outputs** | 6 in a single pass | 15+ spread across multiple flows |
| **Navigation links** | 4 (logo + 3 anchors) | Navbar (10+) + Sidebar (8 hubs + 6 AI Tools) + 7 hub pages + Products dropdown |
| **Marketing landings** | 1 single-page site | 7 per-feature landings + 1 mega Home + 1 Jet variant |
| **Recruiter-side product** | Yes (scoring + ranking pipeline) | Yes (`recruiter.routes.js`, admin leaderboard) — but not exposed as marketing surface |
| **Persistence / accounts** | None — not stored | Full auth, profiles, dashboards, persistence |
| **User flow depth** | 1 step: upload → analyze | Multi-step pipeline: roast → build → optimize → find jobs → outreach → mock interview → track |
| **Custom design per tool** | No — one-page tool | Mostly shared template; Resume Builder has custom design |

---

## 4. Standalone vs Chained — Audit Against the "place each feature correctly in the user flow" principle

This is the heart of the previous directive. Each feature is checked against whether it currently lives at the **right level** in the user flow.

### ✅ Correctly placed (standalone)

| Feature | Why it's correct |
|---|---|
| **Resume Builder** | Custom landing page; it's the foundational document for everything downstream — must be a top-level entry. |
| **Portfolio Builder** | Own landing page; portfolio is a deliverable artifact, not a sub-step. |
| **GitHub Portfolio** | Own landing page; distinct persona path for developers. |
| **Resume Roast** | Own landing page; marketing top-of-funnel that converts into the builder. |
| **Project Visualizer** | Own landing page; standalone analysis tool. |
| **Job Finder** | Own landing page; primary downstream destination. |
| **Mock Interview** | Own landing page; prep tool with its own flow (JD → warmup → practice → replay). |
| **Fellowship / Community** | Separate offerings outside the resume/job funnel. |

### ✅ Correctly placed (chained / inline)

| Feature | Why it's correct |
|---|---|
| **Cover Letter Generator** | Always generated alongside an application — chained to Resume Builder / Job Finder modal. |
| **ATS Score / Enhance / Summary / Tailor / Translate** | Sub-actions inside the Resume Builder flow once a resume exists. |
| **Resume Importers** (Text / GitHub / LinkedIn / File) | Bootstrap entry into Resume Builder. |
| **Resume Templates** | Pre-builder selection; correctly on the public nav. |
| **Cold Outreach** | Sequences only make sense after saved jobs. Chained inside Job Finder. |
| **Email Tracking** | Analytics layer of Outreach — must be inline. |
| **Interview Replay / History / Prep** | Downstream of Mock Interview practice. |
| **Job Tracker / Job Alerts** | Sub-tools inside Job Finder hub. |
| **Collaboration** | Layer on top of Resume Builder. |

### ⚠️ Misplaced or borderline — needs decision

| Feature | Current placement | Recommended placement | Why |
|---|---|---|---|
| **LinkedIn Optimizer** | Private navbar link `/linkedin-optimizer` + Dashboard card | **Chain into Resume Builder** as a post-build step | Output is profile content that complements a polished resume. Sits next to "Email Generator" as if equal in weight, but it's a sibling of "Enhance", not a peer of "Resume Builder". Should appear inside Resume Builder after the user has a baseline resume. |
| **Skill Gap Analyzer** | Both navbar (`/skill-gap`) AND sidebar (AI Tools) | **Chain into Career Growth hub** as a chained feature; **also** appear inside Resume Builder as a post-optimization action | Currently double-surfaced. The "where am I weak for this role?" question is contextual to either a saved job or a finished resume — not a top-level standalone intent. |
| **Career Trajectory** | Sidebar (AI Tools) + gated Dashboard card | **Chain into Career Growth hub only** | Strategic projection, not an actionable tool. Dashboard gating is correct; sidebar promotion is overkill. |
| **Salary Estimator** | Sidebar (AI Tools) | **Chain into Job Finder** as a panel on each saved job | Estimating salary is only meaningful with a specific role or job description. Standalone UI forces the user to re-enter context that Job Finder already has. |
| **ATS Dashboard** | Top-level sidebar entry (`/ats-dashboard`) | **Reduce to a Dashboard widget**; the dedicated page duplicates info that already lives per-resume | `/ats-dashboard` and per-resume ATS scores compete for the same narrative. Page should be the widget; widget shouldn't need a page. |
| **Email Generator** | Navbar privateLinks `/email-generator` | **Chain into Job Finder hub** as a "Draft email" action on a saved job | Same reasoning as Cold Outreach — emails are always written in the context of a job. Standalone page forces the user to switch contexts. |
| **Project Visualizer** | Landing page + Sidebar (AI Tools) | **Keep both**, but reduce sidebar to a "Recent visualizers" entry that opens the same landing | Currently fine — ensure the sidebar entry is contextual to a repo the user has imported, not a generic "go play with the tool" CTA. |
| **Resume Templates** | Public navbar `/templates` | **Already correct** | Just ensure they are also surfaced inside the builder (not just pre-builder). |
| **Dashboard sub-widgets** (GitHub Overview, Portfolio Performance, Career Growth Insights, LinkedIn Optimizer) | All inline on Dashboard | **Keep inline** but de-duplicate "LinkedIn Optimizer card" with the new chained position | Once LinkedIn Optimizer is chained into Resume Builder, the Dashboard card should summarize state, not re-host the full tool. |
| **Payment escrow** | Hidden in `payments.js` (Fellowship flow) | **Keep hidden** | Not a user-facing feature; plumbing for Fellowship proposal rooms. |

### ❌ Currently hidden but should be discoverable

| Feature | Current state | Recommendation |
|---|---|---|
| **Recruiter pipeline** | `recruiter.routes.js` + admin leaderboard exist but have no public surface | If insight.cv has a recruiter pipeline and we want parity, expose a minimal **`/recruiters` landing** with ranking + scoring demo. Otherwise, keep it admin-only. |
| **AI Roast / Resume Roast** | Has landing, but funnel ends at analysis | Add explicit CTA chain: Roast → "Build a fixed-up version" → Resume Builder (implied by architecture but not wired in the landing copy). |

---

## 5. Concrete recommendations to align with the "place each feature correctly in the user flow" principle

1. **Resume Builder remains the canonical standalone.** Its custom landing should stay custom; do not merge it into the shared template.
2. **Move LinkedIn Optimizer, Skill Gap Analyzer, Career Trajectory, Salary Estimator out of top-level nav and into their parent flow's hub.** They become chained features rather than standalone entry points.
3. **Email Generator + Cold Outreach collapse into the Job Finder hub.** They become actions on a saved job, not separate pages.
4. **ATS Dashboard becomes a Dashboard widget.** The dedicated page either goes away or becomes a deep-link from the widget.
5. **Resume Roast funnel should explicitly chain into Resume Builder.** Add a "Fix this with the Builder" CTA at the end of every roast.
6. **Cover Letter, ATS Score, Enhance, Summary, Tailor, Translate remain inline in Resume Builder.** No change.
7. **Interview Replay/History/Prep remain chained under Mock Interview.** No change.
8. **Portfolio Builder, GitHub Portfolio, Project Visualizer, Mock Interview, Job Finder stay standalone.** No change.
9. **Add a recruiter-side landing if and only if we want to compete with insight.cv's recruiter pipeline.** Currently we don't market it — decide explicitly.
10. **De-duplicate Sidebar vs Navbar.** Pick one source of truth. Recommendation: Navbar = publicLinks + auth-protected quick-access; Sidebar = hubs + AI Tools. Anything that appears in both should be reconsidered.

---

## 6. Summary scorecard

| Principle | insight.cv | career-pilot | Verdict |
|---|---|---|---|
| Each feature has its own landing if standalone | ✅ (1 tool, 1 landing) | ✅ (7 landings) | Parity |
| Each chained feature is reachable only inside its parent flow | ✅ (single-pass) | ⚠️ Several chained features are double-surfaced (LinkedIn Opt, Skill Gap) | **Fix needed** |
| Marketing funnel ends in a CTA into the next flow | ❌ (terminal) | ⚠️ Roast doesn't chain to Builder | **Fix needed** |
| Sidebar and Navbar don't compete | ✅ (no sidebar) | ⚠️ Drift between the two | **Fix needed** |
| Recruiter pipeline is marketable or hidden, not half-exposed | N/A | ⚠️ `recruiter.routes.js` exists but no surface | **Decide** |
| Recruiter/job-seeker UX is clean and singular | ✅ (one tool, one flow) | ⚠️ (15+ inline features spread across 10 standalone tools) | **Tighten** |

**Bottom line:** career-pilot is significantly more feature-rich than insight.cv but is suffering from **feature-placement drift** — chained features appearing as if standalone, top-level surfaces competing with each other, and missing explicit hand-offs between Roast → Build → Optimize → Apply → Track → Interview. The fix is not new features; it's relocating existing features into the right slots of the user flow.

---

## 7. Next-step options

- [ ] Draft the migration plan: which routes to demote, which surfaces to remove, which CTAs to wire
- [ ] Update `Navbar.jsx` and `AppSidebar.jsx` to remove duplicate entries for chained features
- [ ] Add Roast → Builder CTA in `ResumeRoastLanding.jsx` and `/resume-roast/analyze`
- [ ] Convert `AtsDashboard.jsx` route to a Dashboard widget
- [ ] Fold Email Generator and Outreach into Job Finder hub as actions
- [ ] Decide recruiter-side marketing surface (`/recruiters` landing vs admin-only)