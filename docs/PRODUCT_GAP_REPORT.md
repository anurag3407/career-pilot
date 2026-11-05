# Product Gap Report — Resume Studio & Portfolio Studio

Date: 5 November 2026
Method: every claim below was read out of the current source tree, not out of the README. Leader
capability data is from primary product/pricing pages as of Nov 2026 (sources in section 7).

---

## 1. Executive verdict

| Pillar | Score vs leader bar | One-line diagnosis |
|---|---|---|
| Resume Studio | **4.5 / 10** | Genuinely broad AI feature set on a markdown data model, and an export pipeline that silently fails the one job an ATS resume must do. |
| Portfolio Studio | **2 / 10** | A template gallery with a deploy button bolted on. There is no editor in the shipping flow, and the artifact that lands on the user's host is a text-only fallback or a fictional stranger's portfolio. |

The gap against leaders is **not missing features** — the AI breadth is ahead of most competitors. It is
that in both pillars the thing the user finally receives is disconnected from the thing that was built:

- The resume editor's work does not survive to the export (markdown blob, rasterised PDF).
- The portfolio gallery's design does not survive to the deploy (255 advertised, 5 wireable, 1 works well).
- The portfolio deploy does not even reliably contain the user's own data.

A separate class of finding is **product integrity**: several surfaces assert something untrue to the
user (section 4). These are more urgent than feature gaps because they cause harm with the user's
knowledge and trust.

---

## 2. Resume Studio — gaps vs leaders

Leader set: Resume.io, Zety, Kickresume, Novorésumé (mass market), Teal + Jobscan (AI/ATS),
Reactive Resume (open-source architecture benchmark).

| Dimension | Leader bar | Current state (verified) | Score |
|---|---|---|---|
| Data model | Reactive Resume: one structured JSON document drives preview, edit and export | Markdown strings (`Resume.originalText` / `enhancedText`, `backend/src/models/Resume.model.js:9-16`). Structure exists only transiently in the wizard and via `location.state`; lost on reload, rehydrated by a lossy 6-alias markdown splitter | 3 |
| Editor | Live side-by-side preview, autosave, undo/redo, inline edit | 6-step wizard, templates on a separate page, Enhance is a read-only dashboard over a textarea. **Zero autosave, zero undo** | 3 |
| Template inventory | Teal ships ~10; Resume.io/Zety ~18-50 real; "500+" claims are SEO fiction | **60 genuinely distinct React templates**, all registered and lazy-loaded. This is legitimately ahead of the market on count | 6 |
| Template customisation | Accent/font pickers actually change output | Pickers are **inert**: the template is rendered with no props (`frontend/src/pages/ResumeTemplates.jsx:748`); accents are hardcoded hex per template file. The "260 gallery entries" figure is 60 designs x cosmetic metadata | 2 |
| Section ordering | Standard | **Works end-to-end** — all 60 templates route through `OrderedSections`, PDF raster follows it, DOCX honours it | 7 |
| PDF export | Selectable-text, ATS-parseable | **Always a JPEG.** `jsPDF.html()` rasterises through html2canvas and embeds images, so both the primary path and the fallback are images (`frontend/src/services/atsPdfExport.js:34`). The server Puppeteer path does produce real text but renders the raw markdown with one generic stylesheet, ignoring template and section order | 2 |
| DOCX export | Often absent or poor | Real, honours `sectionOrder` + `customSections` | 7 |
| Print typography | Page controls, widows, hyphenation | No `@media print`, no page-count control, no widows, no hyphenation anywhere in the resume path | 1 |
| ATS methodology | Jobscan computes keyword overlap and itself concedes a match rate is "a proxy, not the score the employer's ATS secretly assigns" | Case-insensitive **substring** `includes()` over 10 role dictionaries of 14-20 keywords (`backend/src/services/atsScorer.js:119`); `'go'` matches "Google"; unrecognised role returns a hardcoded 70. No test, no validation against real ATS output | 4 |
| Imports | PDF + DOCX + LinkedIn + JSON Resume | **PDF text extraction only.** LinkedIn depends on a paid third-party API and silently falls back to a hardcoded mock profile in dev. GitHub import works but emits a text blob | 4 |
| AI breadth | Per-bullet rewrite + JD tailoring | **Ahead of the market**: per-bullet achievement enhancer, roast, JD tailoring, 14-language translation, streaming enhance | 8 |
| Test coverage | — | 2 frontend files (7 + 2 tests). Nothing tests 59 of 60 templates, PDF export, the ATS scorer, or Enhance | 2 |

---

## 3. Portfolio Studio — gaps vs leaders

Leader set: Carrd, Framer, Dorik, Linktree (portfolio/one-pager), plus ProfileMe.dev and
maurodesouza/profile-readme-generator as the developer-generator analogue.
Note: Read.cv and Bento.me are both gone (Perplexity acquisition; shutdown 13 Feb 2026), so neither is
a valid benchmark any more.

### 3.1 The inventory funnel

```
262 template folders
  -50  placeholder stubs ("Open an issue to contribute")
= 212 folders with real content
  261 entries registered in frontend/src/data/templates.js  (7 flagged isComplete: true)
    5  present in the deployable templateMap
     1  that renders user data well (and it is the broken one — see 3.2)
```

`frontend/src/standalone/main.jsx:18-24` maps exactly five IDs — Cherry_Blossom, Swiss_Typography,
Liquid_Glass, Midnight_Gradient, Playing_Cards. Anything else falls to `FallbackPortfolio`, a centred
name and title (`main.jsx:115-118`). The `isComplete: true` flag marks seven templates
(MySpace_2005, Macintosh_1984_Classic, Hot_Air_Balloon_Drifting, Stand_up_Comedy_Brick_Wall_Mic,
Swipe_Right_Dating_App, Rubik_s_Cube_3D_Rotate, Jigsaw_Puzzle_Assembly) and **not one of them is in
the deploy map** — the flag tracks the newest contributions, so the honesty signal is itself
meaningless.

### 3.2 Gap table

| Dimension | Leader bar | Current state (verified) | Score |
|---|---|---|---|
| Publishable themes | Dorik ~100-120 all-category, Carrd ~110 portfolio of 324, all deployable | **5 of 255 registered** | 1 |
| Credible solo target | 15-40 genuinely distinct, all deployable | Curating down beats scaling up; design-system diversity, not code diversity, is the scarce input | — |
| Design quality | Paid Framer templates set the bar ($49-59 each) | Swiss_Typography is the only art-directed design; 2 competent-but-generic dark-glass SaaS looks; 2 gimmicks (one uses the U+1F0DF card glyph, missing from most fonts). Skill levels in **all five** are invented with `Math.random()` | 3 |
| Content editing | Framer canvas / Carrd elements, WYSIWYG | **None in the shipping flow.** The only `<input>` in the deploy modal is the provider token. `SectionEditor`, `ColorCustomizer`, `PreviewFrame`, `AccessibilityReport`, `DeployLogs` are orphaned (no importers). `ThemeSelector` renders but `selectedTheme` is never passed to `DeployModal` | 1 |
| Preview-to-deploy fidelity | What you edit is what ships | Inverted: the gallery preview renders the real component, then deploy discards it | 1 |
| Hosting | Free tier hosts with SSL. Carrd free = 3 sites; Framer free = 1 GB; Dorik hosts every plan | BYO token to Netlify / Cloudflare / GitHub Pages. No default hosted URL. Cloudflare path shells out to `npx wrangler` **under the platform's own credential**, so all those users' sites sit in one account as `cp-<slug>` | 3 |
| Custom domains | Carrd $19/yr, Framer Basic $10/mo, Dorik all paid tiers | **Not implemented.** `customDomainDeploy` appears once in the codebase, as a plan boolean with zero consumers (`backend/src/config/plans.js:67`) | 0 |
| SEO / social preview | Per-page title + description + 1200x630 OG image, canonical, favicon, sitemap | `frontend/standalone.html` contains none of it. `document.title` is the only per-user lever. The sitemap/robots generators serve only 7 dead backend templates that no route renders | 1 |
| Performance | Lighthouse 97 desktop / 80 mobile measured on a real Carrd; single page, no app shell | Measured from a real local build: **1.68 MB JS+CSS (~190 kB gzip) for a one-page site.** CSS alone 1,244,976 B / 122.57 kB gzip, because the standalone entry imports the app-wide Tailwind stylesheet with no `@source` scope, so utilities from all 262 template directories ship to every deployed portfolio. Plus a 131 kB chunk for a template that is not even deployable, blocking Google Fonts (9 Inter weights), and 100% client-side render into an empty `#root` | 3 |
| Forms / analytics | Native at Dorik, paid-gated at Carrd/Framer | No form can be received (no endpoint). Visitor analytics component hardcodes `{contactClicks: 124, growth: "+18%"}` and is never imported; the `/:slug/bandwidth` route returns invented constants (500 KB, 1200 views) | 1 |
| Versioning / rollback | Standard | Backend is genuinely solid (snapshot, diff, 50-version prune, restore-as-new). **No frontend caller exists** | 4 |
| Deployers | n/a | Netlify (PAT + digest + polling) and GitHub Pages (batch Tree API commit, Pages enablement, topic-tagged deletion guard) are properly implemented — most solo projects never land these | 6 |
| GitHub sync | — | README claims it "watches a repo and auto-rebuilds on new commits". There is no GitHub webhook receiver; a daily cron writes draft fields and comments **"Do NOT re-deploy automatically"** (`backend/src/services/portfolioGitHubSync.js:82`). The GitHub-built portfolio is one hardcoded layout on an incompatible schema with no deploy call | 1 |
| Build integrity | — | `frontend/dist-portfolio/` is gitignored and **no CI workflow builds it**, so deploy throws on a fresh container | 0 |

---

## 4. Product integrity issues (fix before any feature work)

These assert something false to a real user.

1. **The deployed portfolio can be someone else's life.** `DeployModal` sends `sections: aiDraft || {}`,
   and every template falls back wholesale to `dummy_data`. A user who skips the AI step publishes a
   fictional persona: an Unsplash photo of a stranger as their face, "5+ years / 48 projects / 32
   clients", and an invented testimonial from "Sarah Chen, CTO at NeuralDash".
2. **The best template ships none of the user's data.** `Swiss_Typography/index.jsx` never reads its
   `portfolioData` prop and instead calls `usePortfolio()` at 11 sites, while
   `frontend/src/standalone/main.jsx:136` renders `<App />` with **no `PortfolioProvider` mounted** —
   so the context returns its default, which is the dummy dataset
   (`frontend/src/context/PortfolioContext.jsx:4-7`).
3. **The resume PDF is not ATS-safe and the UI says it is.** The success toast claims "text layer
   preserved for ATS" (`frontend/src/pages/ResumeTemplates.jsx:188`) on a file that is provably a
   JPEG. A user can fail automated screening believing their resume was machine-readable.
4. **Two contact forms lie to the visitor.** `Midnight_Gradient/Contact.jsx:36` is
   `onSubmit={(e) => e.preventDefault()}`; `Playing_Cards/Contact.jsx:10-15` shows "Message sent!"
   while dropping the payload.
5. **A recruiter-visible page invents data on every load** — `Math.random()` in five skill-bar
   render paths.

---

## 5. Security findings

| Severity | Finding | Evidence |
|---|---|---|
| High | User content is injected into a `<script>` tag **unescaped**; only `templateId` passes through `escapeForScript`. A `</script>` in a bio breaks out of the tag. The adjacent `html.replace()` also interprets `$&` / `$'` in user text | `backend/src/services/deploy/portfolioHtmlGenerator.js:58-68` |
| Medium | GitHub token encryption key falls back to a value derived from `FIREBASE_PROJECT_ID`, then a static padded string. With the env var unset, stored tokens are decryptable by anyone with DB read access | `backend/src/models/GithubToken.model.js:38-43` |
| Medium | All Cloudflare-hosted portfolios are deployed into the platform's single account via `npx wrangler` using the platform credential; project names are collision-prone slugs | `backend/src/services/deploy/cloudflareDeployer.js:16-24` |
| Info (good) | Deploy-time provider tokens are passed through and **not persisted**; no token appears in deployer logs | `backend/src/routes/portfolio.js:225-253` |
| Info (good) | `accessibilityChecker.js` is genuine axe-core + jsdom, and an HTML sanitizer exists | — |

---

## 6. Where we are genuinely ahead of leaders

- **AI breadth on resumes**: per-bullet enhancement, JD tailoring, 14-language translation, a roast
  mode. Teal charges $29/mo and ships ~10 templates.
- **60 distinct resume template designs** — more than Teal (~10), Zety (~18), Novoresumé (8 free).
- **A real axe-core accessibility auditor** — stricter than anything Carrd or Dorik offers. Currently
  wired to an unused endpoint.
- **A proper portfolio versioning backend** with diff and prune — leaders treat this as standard, most
  solo builds skip it.
- **Two correctly implemented provider deployers** and three-provider breadth (leaders offer one).
- **A working DOCX export that honours section order** — better than several paid competitors.

---

## 7. Benchmark reference data (Nov 2026)

| Product | Free tier | Custom domain | Real template inventory | Notes |
|---|---|---|---|---|
| Carrd | 3 sites, hosted, branding shown | $19/yr (Pro Standard) | 324 total, ~110 portfolio | Measured PageSpeed 97 desktop / 80 mobile |
| Framer | Subdomain, 1 GB bandwidth | Basic $10/mo | Marketplace, "thousands", paid portfolio templates $49-59 | Framer 3.0 (Jun 2026): AI agents on canvas, prompt to publish |
| Dorik | No $0 tier on pricing page | All paid tiers | ~100-120 first-party | Native cookieless analytics + forms; $249/yr or lifetime |
| Linktree | Unlimited links, 28-day insights | **Never, on any plan** | Dozens, tier-gated | Absorbed Bento.me users after it shut 13 Feb 2026; Pro $14/mo |
| Resume.io | 1 resume, **TXT export only** | n/a | ~50 | ATS checker = 16 checks |
| Kickresume | Never expires, unlimited downloads | n/a | 4 free + 40+ premium | $8/mo, translation into 8 languages |
| Teal | Capped AI (10 bullets, 2 summaries) | n/a | ~10 | $29/mo; strength is the resume-to-job-tracker loop |
| Jobscan | 5 scans/month | n/a | n/a | Match rate = keyword overlap; conceded as a proxy |
| Reactive Resume | Free, self-hostable, no ads | n/a | 18 templates, 54 UI languages | Structured JSON document, TipTap editor, Puppeteer PDF export |

Annual cost of ownership for the user: DIY + GitHub Pages **$10.46** (domain only, SSL free) · Carrd
~$30 · Framer ~$130 · Dorik $249 · Linktree Pro $168 without a custom domain.

**Nobody in this market asks a customer to paste a Netlify/Cloudflare/GitHub personal access token.**
Where tokens appear, the person pasting is the account owner running their own pipeline. Every
competitor either hosts for a $10-30/yr margin or ships files to the user's own Git repo.

Sources: carrd.com/pro, onepagelove.com/carrd-pricing, framer.com/pricing, framer.com/ai,
dorik.com/pricing, linktr.ee/s/pricing, resume.io/pricing, kickresume.com/en/pricing, tealhq.com,
jobscan.co, rxresu.me, docs.github.com (Pages HTTPS), web.dev/articles/vitals.

---

## 8. Focus plan

Ordered by score movement per unit of effort. Nothing here needs new infrastructure.

### P0 — Stop shipping lies (1-2 days, blocks everything else)

1. **Mount `PortfolioProvider` in the standalone entry, or convert all five templates to prop-only.**
   Then **delete dummy-data fallbacks on any deploy/export code path** and let a missing field render
   nothing.
2. **Fix or remove the false claims in UI copy**: the "text layer preserved for ATS" toast; the two
   lying contact forms (make them work or delete them); the `Math.random()` skill bars.
3. **Escape the injected portfolio JSON**, use a function replacement in `html.replace`, and make a
   missing `GITHUB_TOKEN_ENCRYPTION_KEY` fail fast at boot.
4. **README honesty pass** (section 9).

*Exit test:* deploy a portfolio with only a name and one project; assert the rendered HTML contains
that name and contains none of "Alex Rivera", "Sarah Chen", or "NeuralDash".

### P1 — Make the portfolio real (1-2 weeks)

5. **Build `dist-portfolio` in CI** (it is gitignored and currently never built — deploy is broken on a
   fresh container).
6. **Generate `templateMap` from the registry, gated on a deployability test**, and **curate down to
   25-40 templates** rather than scaling to 212. Delete the 50 placeholder stubs, and either add the 7
   `isComplete: true` entries to the deploy map or drop the flag. Add a test that each registered template
   renders user data rather than dummy data.
7. **Make GitHub Pages the default zero-config path** — the deployer already creates the repo and
   enables Pages, and GitHub gives free SSL plus custom domains, so the user's total cost is the
   $10.46 domain. Serve the stored `deployedUrl`/public slug as a hosted preview. Demote BYO-token to
   an opt-in power-user route. Stop using the platform's own Cloudflare credential for user sites.
8. **Pre-render each portfolio to static HTML at deploy time** (Puppeteer is already a dependency) and
   scope Tailwind with `@source` per template. This is the change that actually moves the user-visible
   number: it fixes empty-`#root` crawlers, enables OG/canonical/favicon, and attacks the 122 kB-gzip
   CSS. Target: **< 200 kB gzip total, Lighthouse mobile >= 85** against Carrd's measured 80.

*Exit test:* a deployed portfolio scores >= 85 mobile in Lighthouse, passes the axe audit already in
the repo, and is crawlable with JS disabled.

### P2 — Resume parity (3-6 weeks, the structural work)

9. **Replace markdown storage with a structured JSON document** and adopt **`resume.json`** as the
   format. This is the single architectural change the whole pillar is waiting on, it is what Reactive
   Resume does, and it buys free interoperability with the JSON Resume ecosystem (67 themes).
10. **Unified canvas editor**: live preview beside the form, autosave, undo/redo. The step wizard is why
    Enhance ended up read-only.
11. **Bind server-side Puppeteer PDF to the chosen template and `sectionOrder`** — this is the only
    real-text export path in the codebase.
    *Exit test:* a round-trip assertion that `pdftotext` recovers the user's name and three skills from
    an exported PDF. That test would fail today and would have caught this.
12. **Fix the ATS scorer**: word-boundary matching instead of `includes()`, larger role dictionaries,
    and rename the output "keyword and format analysis modelled on ATS best practice". Jobscan itself
    will not call this an ATS score.
13. Wire the existing version/rollback UI; add DOCX upload parsing.

### Explicit non-goals

Do not attempt to match: managed hosting with SSL/CDN/uptime SLA at $10-19/yr; real ATS-vendor
predictive parity; 100+ professionally designed templates; human resume-writer content libraries;
paid search distribution. These are what a solo build structurally cannot win, and each one is a trap
that would consume a quarter.

---

## 9. Claims to correct in README

| Line | Claim | Reality |
|---|---|---|
| 143, 279 | "60+ templates" | 60 designs is fine to claim; add "customisable colours/fonts" only after the picker is wired |
| 146 | "250+ themes" | 5 deployable today; 25-40 after P1 |
| 146 | "custom domains" | Not implemented |
| 350 | "AI extracts … education" | No education in the extractor schema; no template renders it |
| 353 | "Resume ↔ Portfolio Compare" | 0-byte file, zero importers |
| 354-355 | Section Editor / Social Links Editor / Theme + Colour customiser | Orphaned components, unreachable |
| 357, 361 | Image optimisation, screenshot service | Not imported by any route |
| 358 | "Deploy to Netlify/Cloudflare/GitHub with the same UI … rollback in one click" | Deploy is real; rollback has no UI; no zero-config host |
| 359 | "watches a connected repo, auto-rebuilds on new commits" | Daily cron that explicitly refuses to re-deploy |
| 360 | SEO: robots.txt, sitemap.xml, OpenGraph, Twitter cards | Nothing of it reaches the deployed artifact |
| 363 | "Snapshot every publish, roll back in one click" | Backend only |
| — | "Download as PDF (ATS-safe)" | Raster image; not ATS-safe |

Also stale in the opposite direction: `docs/RESUME_BUILDER_GAP_ANALYSIS.md:128` still says 59 of 60
templates hardcode section order. All 60 now go through `OrderedSections`. That document should be
updated so nobody re-does finished work.

---

## 10. Suggested tracking metrics

| Metric | Today | Target |
|---|---|---|
| Registered templates that actually deploy | 5 / 261 | 25-40 / same set, 100% |
| Deployed portfolios containing dummy content | Any field left blank | 0 |
| Resume PDF text-extraction round trip | Fails | Passes in CI |
| Deployed portfolio JS+CSS (gzip) | ~190 kB | < 200 kB with pre-rendered HTML |
| Lighthouse mobile (deployed portfolio) | Unmeasured, CSR by construction | >= 85 |
| Custom-domain support | Not implemented | GitHub Pages path, documented |
| Resume editor autosave / undo | 0 | Both present |
| Portfolio components with zero importers | 6 | 0 (wired or deleted) |
| Resume + portfolio test files | 5 total | Every deployable template + both exporters |
