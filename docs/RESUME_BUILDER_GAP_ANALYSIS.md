# Resume Studio — Workflow & Gap Analysis

> How the current resume builder works end-to-end, where the two independent flows
> (**Build from scratch** / **Enhance**) and the **drag-and-drop section** feature stand,
> and exactly where it lags a "super-premium" resume/portfolio builder
> (Teal, Rezi, Enhancv, Kickresume, Standard Resume).
>
> _Date: 2026-06-22 · Scope: `frontend/src` + `backend/src` resume surfaces only._
>
> **⚠️ Updated 2026-06-22 (post-implementation).** Sections 1–6 describe the **original** state.
> A first vertical slice has since shipped — see **§1A Implementation status** for what's done and
> **§9 Remaining work to ship a complete, polished product** for the full release checklist.

---

## 1. Executive summary

The resume product is **feature-rich but fragmented**. There are **three separate editing
surfaces**, each built on a **different data model**, none of which is a true WYSIWYG editor:

| Surface | File | Data model | DnD? | Live template preview? | Section editing? |
|---|---|---|---|---|---|
| Build from scratch | `pages/ResumeBuilder.jsx` (1999 ln) | Structured React arrays → flattened to **markdown string** | ✅ entries + section order | ❌ (build blind, pick template after) | ✅ 4 fixed sections only |
| Enhance | `pages/Enhance.jsx` (1422 ln) | **Markdown blob** (`originalText`/`enhancedText`) | ❌ none | ❌ | ❌ analysis dashboard only |
| View / edit | `pages/ResumeView.jsx` | Markdown blob + side `customSections` array | ⚠️ custom sections only | ❌ | ⚠️ raw `<textarea>` of the blob |

**The single root cause of the lag:** the resume is persisted as an **unstructured markdown
string** (`Resume.originalText`), while the polished templates render from a **structured
object** produced by `normalizeResumeData()`. There is **no markdown → structured parser** on
the frontend. So structured data only exists transiently, in memory, inside the build wizard.
The moment the resume becomes a string (on save, on upload, or after AI enhancement), it can no
longer flow back into the structured template renderer.

**Three headline consequences:**

1. **Drag-and-drop is cosmetic.** The builder lets you reorder sections, but
   `normalizeResumeData()` (`context/ResumeContext.jsx:164-219`) returns a canonical object with
   **no `sectionOrder` and no `customSections` fields**, and every template renders sections in a
   **hardcoded order** (e.g. `IvyLeague/index.jsx:58-131` → Summary→Education→Experience→Projects→Skills→Certs).
   Your drag only changes the order of the stored markdown text — **the rendered/exported PDF
   ignores it.**
2. **Enhance has no editing at all** — no drag-and-drop, no per-section editing, no add/remove
   sections. It is a read-only analysis dashboard that operates on a text blob.
3. **No autosave** in the 6-step builder (`grep localStorage pages/ResumeBuilder.jsx` → 0). A
   refresh mid-build wipes everything.

A premium builder is the inverse: **one unified canvas**, **one structured data model**, with
live preview + drag-and-drop + inline AI + ATS scoring + autosave all in the same view.

---

## 1A. Implementation status (what shipped in this pass)

Scope delivered: **make drag-and-drop section ordering a real, end-to-end feature in both Build
and Enhance, proven on one reference template (IvyLeague).** Verified by `npm run build` (green) +
6 new unit/render tests (`frontend/src/__tests__/resumeSectionOrder.test.jsx`, all passing,
asserting the rendered `<h2>` order).

**Done ✅**
- `normalizeResumeData()` now carries `sectionOrder` (de-duped) + `customSections` (normalized,
  filtered, order-sorted) into the canonical shape — `context/ResumeContext.jsx`.
- New reusable renderer `components/resume/shared/OrderedSections.jsx` (+ `CustomSectionBlock`):
  emits a template's section nodes in `sectionOrder`, summary fixed-lead, appends custom sections.
  **This is the pattern other templates copy.**
- **IvyLeague** migrated to it — honors order + renders custom sections (`templates/IvyLeague/index.jsx`).
- Build flow passes `sectionOrder` into the `builderData` payload (`pages/ResumeBuilder.jsx`).
- Enhance flow has a new drag-and-drop **Section Order panel** persisting via the existing
  `reorderSections` API (`pages/Enhance.jsx`).
- `ResumeTemplates` merges the record's `sectionOrder`/`customSections` on `?resumeId=` load — and
  fixed a latent bug there (`res.resume` → `res.data`, which had been loading dummy data).
- Frontend **PDF** export reflects order automatically (it rasterizes the rendered template DOM).

**Critical pre-ship fixes (second pass) ✅**
- ✅ **DOCX export now honors `sectionOrder` + renders custom sections** (`utils/docxExport.js`),
  so Word matches the preview/PDF instead of silently exporting a fixed order.
- ✅ **Safe-ship guard:** `ORDER_AWARE_TEMPLATE_IDS` registry + an amber banner in
  `ResumeTemplates` that warns when the user reordered (or added custom sections) but picked a
  template that still uses a fixed layout — no more silent "my order vanished".
- ✅ **Enhance loop closed:** a **"Preview & export in a template"** CTA routes to the order-aware
  `/resume-templates?resumeId=` page (Enhance previously had no resume-template CTA at all; the
  pre-existing `/templates` nav is the separate *portfolio* flow).
- ✅ Tests extended (7 passing) incl. a DOCX-export smoke test; build green.

**Not yet — needed for full premium parity (detail in §9)**
- 🚫 **59 of 60 templates still render a hardcoded order** — only IvyLeague is migrated (the planned
  "replicate from the reference" work). The guard banner makes this safe to ship in the meantime.
- 🚫 Section *content* editing / custom-section authoring still absent in Build & Enhance.
- 🚫 Enhance→preview rehydration is lossy (`splitMarkdownIntoResume`); backend `/download` PDF
  renders the raw blob and ignores the `sectionOrder` field.
- 🚫 No live click-through/E2E test; verified at build + component level only.

---

## 2. Current architecture & data flow

_Updated to reflect the shipped slice. ✅ = now wired; 🚫 = still outstanding._

```
BUILD FROM SCRATCH                         ENHANCE / UPLOAD
─────────────────                          ────────────────
/resume-builder  (landing)                 /upload  (PDF / LinkedIn)
       │                                          │  pdf-parse → text
/resume-builder/build                             ▼
  ResumeBuilder.jsx                          POST /api/resumes  (originalText = blob)
  • structured state (arrays)                      │
  • DnD reorder (entries + sections)               ▼
  • 6-step wizard                            /enhance/:resumeId  → Enhance.jsx
       │                                      • ATS / comprehensive / bullet analysis
       │                                      • full AI rewrite → enhancedText (BLOB)
       │                                      • ✅ Section Order DnD panel
       │                                      •     → reorderSections (persists sectionOrder)
       │                                      • ✅ "Preview in template" CTA ┐
       ├── "Generate & Enhance"                                             │
       │     generateMarkdown() → BLOB (order applied)                      │
       │     POST /api/resumes (sectionOrder saved) → /enhance/:id          │
       │                                                                    │
       └── "Choose Resume Template"                                         │
             navigate('/resume-templates', state:{ builderData })          │
                ✅ builderData now includes sectionOrder + customSections   │
                      │                                                     │
                      │   /resume-templates?resumeId=  ◄────────────────────┘
                      │      ✅ loads record, merges sectionOrder + customSections
                      ▼                          (✅ fixed res.data load bug)
              ResumeTemplates.jsx
              normalizeResumeData(...)   ✅ now CARRIES sectionOrder + customSections
              ResumeProvider → <Template/>
                 • IvyLeague → <OrderedSections/>   ✅ honors order + custom sections
                 • 59 others → 🚫 fixed order (amber guard banner warns the user)
              exportAtsSafePdf (rasterizes DOM → ✅ order)  ·  buildResumeDocx ✅ order
```

### Disconnects — resolved vs. remaining

- **Disconnect A — section order lost in normalization → ✅ RESOLVED (for IvyLeague).**
  `normalizeResumeData()` now carries `sectionOrder` + `customSections`
  (`context/ResumeContext.jsx`); the shared `OrderedSections.jsx` renders them; **IvyLeague**,
  the **PDF** (DOM rasterization), and the **DOCX** (`utils/docxExport.js`) all honor the order.
  🚫 **Remaining:** the other 59 templates still hardcode order — a registry
  (`ORDER_AWARE_TEMPLATE_IDS`) + an amber guard banner in the gallery prevent a silent wrong
  export until they are migrated.

- **Disconnect B — two template destinations → 🟡 PARTIALLY RESOLVED.**
  The `?resumeId=` path now actually works (was reading `res.resume`, i.e. dummy data; fixed to
  `res.data`) and merges the record's `sectionOrder`/`customSections`, so a saved/enhanced resume
  re-hydrates into `ResumeTemplates`, and Enhance's new CTA routes there.
  🚫 **Remaining:** `/templates` (`TemplateGallery.jsx`) is still a separate page (it serves the
  *portfolio* draft flow); the markdown→structured parser (`splitMarkdownIntoResume`) is still
  lossy; and the backend `/download` PDF (`pdfGenerator.js`) still renders the raw blob and
  ignores `sectionOrder`.

---

## 3. Flow-by-flow current state

### 3a. Build from scratch — `pages/ResumeBuilder.jsx`
- 6-step wizard: Personal → Education → Experience → Projects → Skills → Preview/Generate.
- **Drag-and-drop** via `@hello-pangea/dnd` in 4 places (`onDragEnd` at `:638`): reorder
  Education entries (`:947`), Experience entries (`:1069`), Project entries (`:1213`), and whole
  sections in the preview step (`:1319`, over `sectionOrder`).
- Per-bullet AI help via `AchievementEnhancer`; live local scoring (ATS, readability, tone,
  achievement, profile) computed client-side in `useEffect`s.
- **Output:** `generateMarkdown()` (`:684`) flattens everything to a markdown string (in
  `sectionOrder`), then either `POST /api/resumes` (✅ now persists `sectionOrder`) → `/enhance/:id`,
  or hands `builderData` to `/resume-templates` — ✅ the payload now includes `sectionOrder`, so the
  reorder reaches order-aware templates (IvyLeague).
- **Limits (still open):** only 4 fixed section types + summary in the wizard. **No** certifications
  input, **no** custom-section authoring, **no** photo, **no** live template preview, **no** autosave.

### 3b. Enhance — `pages/Enhance.jsx`
- Loads the resume by id, runs analyses against `resume.originalText`:
  `analyzeATS`, `comprehensiveAnalysis`, `analyzeBullets`, `scoreResume` — surfaced across
  Overview / Bullets / Tips / Score tabs.
- Can run a **full AI rewrite** (streamed) → `enhancedText`.
- ✅ **Section Order panel (new):** a `@hello-pangea/dnd` list (`SectionOrderPanel`) that persists
  the chosen order via `resumeApi.reorderSections`, plus a **"Preview & export in a template"** CTA
  that routes to `/resume-templates?resumeId=` (the order-aware page).
- **Editing model (still open):** apart from section *order* and `jobRole`, the resume body is **not**
  editable here — section *content* can't be edited and custom sections can't be authored in Enhance.

### 3c. View / edit — `pages/ResumeView.jsx`
- Toggle original vs enhanced; edit the resume as a **raw `<textarea>` over the markdown blob**
  (`:446-466`). Separate `customSections` editor (`CustomSection.jsx`, which *does* have a
  `DragHandle`) appended as markdown (`sectionsToMarkdown`, `:497`). Links out to
  `/resume-templates?resumeId=…` and `/enhance/:id`.
- So custom sections are reorderable **here**, but they live in a side array that's stitched onto
  the blob — disconnected from the structured templates and from the builder/enhance flows.

### 3d. Backend (well-built, under-used by the UI)
- Rich routes exist that the UI doesn't fully exploit: `PUT /api/resumes/:id/reorder`
  (persists `sectionOrder`), `customSections` with `kind`/`order` (max 20), versions
  (`ResumeVersion`), ATS history, sharing + section-level comments (`collaboration.js`),
  tailoring, translation, skill-gap, before/after, streaming enhance.
- Storage is **markdown-first**: `originalText`/`enhancedText` are strings; structure is only
  *inferred* heuristically by `atsScorer.js`. PDF export = Puppeteer (`pdfGenerator.js`).
- Upload supports **PDF only** (`pdf-parse`); **no DOCX, no OCR/image** parsing.

---

## 4. The drag-and-drop section feature — verdict

> **Requirement:** drag-and-drop section reordering should work in **both** Build and Enhance.

| Aspect | Original | Now (after pass) |
|---|---|---|
| Exists in Build (entries + sections) | ✅ markdown only | ✅ + reaches the template via `builderData.sectionOrder` |
| Exists in Enhance | ❌ entirely absent | ✅ Section Order panel, persists via `reorderSections` |
| Reaches the rendered template | ❌ `sectionOrder` dropped | ✅ **IvyLeague only**; 🚫 other 59 templates |
| Reaches exported **PDF** | ❌ | ✅ (rasterizes rendered DOM) — IvyLeague |
| Reaches exported **DOCX** | ❌ | 🚫 still hardcoded (`utils/docxExport.js`) |
| Custom-section reorder | ⚠️ only in `ResumeView` | ⚠️ rendered by `OrderedSections`; authoring still only in `ResumeView` |
| Backend persistence (`/reorder`) | ✅ unused | ✅ now called from Enhance |

**Net:** the feature is now real and end-to-end **on IvyLeague** in both flows. To be
*feature-complete* it must be honored by **all** templates and **all** export paths (DOCX, backend
download), with section/custom-section authoring available in the flows where users reorder. See §9.

---

## 5. Gap analysis vs. a super-premium builder

Ranked by severity / leverage.

### 🔴 P0 — Structural (root causes)
1. **No single structured data model.** Premium builders keep one JSON resume (sections as an
   ordered array of typed blocks) that powers editing, preview, scoring, and export. Here the
   source of truth degrades to a markdown string on save. → **Adopt a structured resume schema
   as the source of truth** (sections array with `id/type/order/visible/data`), keep markdown as
   a derived export only.
2. **Drag-and-drop doesn't affect output.** Make `normalizeResumeData` + every template consume
   `sectionOrder` (and `customSections`). Render via a section-map loop, not hardcoded JSX order.
3. **No unified WYSIWYG editor.** Three surfaces (build/enhance/view) should collapse into **one
   canvas** with a live preview pane. Build vs Enhance become *entry points/modes* of the same
   editor, not separate pages with different data.
4. **No autosave / draft recovery.** Add debounced autosave (local + server) and crash recovery.
   Today a refresh in the wizard = total loss.

### 🟠 P1 — Editing experience
5. **Enhance is read-only.** Bring structured section editing + drag-and-drop into Enhance (same
   editor component as Build).
6. **No inline live template preview while editing.** You build blind, then choose a template on
   a separate page. Premium = edit-and-see-instantly, switch templates without losing data.
7. **Limited section types in the builder.** No certifications, languages, awards, publications,
   volunteering, custom sections — despite the data model (`customSections`) and templates
   (`certifications`) already supporting them.
8. **Two divergent template pages** (`/resume-templates` vs `/templates`). Consolidate to one,
   reachable from every flow, hydratable from a **saved** resume (needs the structured model).
9. **AI is a separate destination, not inline.** Enhancement, tailoring, bullet rewrite,
   translation live behind navigation/tabs. Premium = inline "improve this bullet / section" with
   accept/reject diffs right in the editor (the backend endpoints already exist:
   `/enhance/analyze-bullets`, `/tailor`, `/translate`, `/before-after`, `/stream`).

### 🟡 P2 — Polish & parity
10. **Upload parsing is thin.** PDF-only, no DOCX/image OCR, and parsed text isn't mapped into
    structured sections (no field-level import). Premium importers populate the structured editor.
11. **Versions / sharing / comments exist on the backend but are weakly surfaced** in the editor
    (no inline version timeline, no live collaborative cursors/comments in-context).
12. **No real-time ATS-per-section feedback in the editor.** Scoring is computed in separate
    places; premium builders show a live score that updates as you type, per section.
13. **No content blocks / rich formatting / reorder within a section across all sections**
    consistently; bullet-level reorder isn't available everywhere.

---

## 6. Severity-ranked gap table

| # | Gap | Where | Severity | Effort |
|---|---|---|---|---|
| 1 | Markdown blob is the source of truth (no structured model) | whole stack | 🔴 P0 | L |
| 2 | DnD section order ignored by renderer/export | `ResumeContext.jsx`, all templates | 🔴 P0 | M |
| 3 | Three fragmented editors, no unified canvas | build/enhance/view | 🔴 P0 | L |
| 4 | No autosave / draft recovery | `ResumeBuilder.jsx` | 🔴 P0 | S |
| 5 | Enhance has no editing/DnD | `Enhance.jsx` | 🟠 P1 | M |
| 6 | No live template preview while editing | build flow | 🟠 P1 | M |
| 7 | Builder limited to 4 fixed sections | `ResumeBuilder.jsx` | 🟠 P1 | M |
| 8 | Two divergent template pages | `/templates` vs `/resume-templates` | 🟠 P1 | S |
| 9 | AI not inline (accept/reject diffs) | enhance endpoints | 🟠 P1 | M |
| 10 | PDF-only import, no field mapping | `upload.js` | 🟡 P2 | M |
| 11 | Versions/sharing/comments under-surfaced | collaboration backend | 🟡 P2 | M |
| 12 | No live per-section ATS in editor | scoring services | 🟡 P2 | M |

_Effort: S ≈ <1d, M ≈ a few days, L ≈ 1–2 wk._

---

## 7. Recommended path to "premium"

**Phase 0 — Stop the bleeding (days)** — _partially shipped; tracked in detail in §9._
- 🚫 Add debounced autosave + recovery to `ResumeBuilder` (and any editor). _(→ M2.3)_
- 🟡 Make `normalizeResumeData()` read `sectionOrder`/`customSections`; refactor templates to render
  sections from an **ordered map** so DnD affects the output. **Done for normalization + IvyLeague;
  remaining templates + DOCX/server export outstanding.** _(→ M1.1, M1.2, M1.5)_
- 🟡 Consolidate to one template page that can hydrate from `location.state` **and** a saved resume.
  **Load-path bug fixed; pages not yet merged.** _(→ M1.3, M2.6)_

**Phase 1 — One structured model (1–2 wk)**
- Define a canonical structured resume (sections as ordered, typed blocks incl. custom sections).
  Persist it as the source of truth; generate markdown/PDF/DOCX as **derived** outputs.
- Write/import a markdown↔structured mapper so existing saved resumes and PDF uploads hydrate into
  the structured editor.

**Phase 2 — Unified editor + live preview (1–2 wk)**
- Extract one `ResumeEditor` component (structured sections + drag-and-drop at section and bullet
  level + add/remove custom sections) with a side-by-side live template preview.
- Make **Build** and **Enhance** two modes of this editor (Build = empty/seeded; Enhance =
  loaded + analysis rail). DnD now works in both, by construction.

**Phase 3 — Inline AI + live ATS (ongoing)**
- Inline "improve / tailor / translate" with accept-reject diffs (wire existing endpoints).
- Live per-section ATS score, in-context version timeline, in-context comments.

**Phase 4 — Import & parity polish**
- DOCX + image/OCR import mapped to structured fields; richer template switching.

---

## 8. Key file reference

| Concern | File |
|---|---|
| Build wizard + DnD + `generateMarkdown` | `frontend/src/pages/ResumeBuilder.jsx` |
| Enhance dashboard (no editing/DnD) | `frontend/src/pages/Enhance.jsx` |
| View/edit + custom sections (`DragHandle`) | `frontend/src/pages/ResumeView.jsx`, `components/CustomSection.jsx` |
| Normalization (drops order/custom) | `frontend/src/context/ResumeContext.jsx:164` |
| Template renderer (hardcoded order) | `frontend/src/components/resume/templates/*/index.jsx` |
| Template gallery / preview / export (build) | `frontend/src/pages/ResumeTemplates.jsx` |
| Template gallery (enhance) | `frontend/src/pages/TemplateGallery.jsx` |
| PDF / DOCX export | `frontend/src/services/atsPdfExport.js`, `utils/docxExport.js` |
| Resume model (`sectionOrder`, `customSections`) | `backend/src/models/Resume.model.js` |
| Reorder / CRUD / versions routes | `backend/src/routes/resume.js` |
| Enhance / tailor / translate / ATS | `backend/src/routes/enhance.js`, `config/langchain.js`, `services/atsScorer.js` |
| Upload (PDF only) | `backend/src/routes/upload.js` |
| **Shipped this pass** | `components/resume/shared/OrderedSections.jsx`, `templates/IvyLeague/index.jsx`, `__tests__/resumeSectionOrder.test.jsx` |

---

## 9. Remaining work to ship a complete, polished product

This section is the **release checklist**. It is split into three milestones. Only **M1** is
required to ship the drag-and-drop feature as a general (non-pilot) release; **M2/M3** raise it to
"super-premium" parity. Effort: S ≈ <1d, M ≈ a few days, L ≈ 1–2 wk.

### Status legend
✅ done · 🟡 partial · 🚫 not started

---

### M1 — Ship-blockers for the drag-and-drop feature (must-have before general release)

| # | Task | File(s) | Status | Effort | Why it blocks ship |
|---|---|---|---|---|---|
| M1.2 | **DOCX export honors `sectionOrder` + custom sections** | `utils/docxExport.js` | ✅ done | M | DOCX no longer exports a different order than preview/PDF. |
| M1.3 | **Enhance routes to the order-aware template page** via a "Preview & export" CTA → `/resume-templates?resumeId=` | `pages/Enhance.jsx` | ✅ done | S | Enhance had no resume-template CTA; the old `/templates` nav is the *portfolio* flow. |
| M1.9 | **Safe-ship guard** — `ORDER_AWARE_TEMPLATE_IDS` registry + amber banner when a non-order-aware template is chosen after reordering | `OrderedSections.jsx`, `ResumeTemplates.jsx` | ✅ done | S | Prevents the silent "my order vanished" on un-migrated templates. |
| M1.1 | **Migrate the remaining 59 templates** to `OrderedSections` | `components/resume/templates/*/index.jsx` | 🚫 | L | Highest-impact gap; guard banner makes it safe to ship incrementally. **Add each id to `ORDER_AWARE_TEMPLATE_IDS` as you migrate.** |
| M1.4 | **Two-column templates: define reorder semantics** (which column each section lives in; reorder within column) | 41 two-col templates | 🚫 | M | "Order" is ambiguous in 2-col layouts; needs a rule before bulk migration. |
| M1.5 | **Backend `/download` PDF honors `sectionOrder`** (currently renders the raw markdown blob) | `backend/src/services/pdfGenerator.js`, `routes/resume.js` | 🚫 | M | Server-side PDF (secondary path) ignores the user's order. |
| M1.6 | **Enhance panel: only list sections that exist** (hide empty "Certifications", etc.) | `pages/Enhance.jsx` (`buildSectionItems`) | 🟡 | S | Polish — currently shows all standard sections; note already tells users empty ones are skipped. |
| M1.7 | **Live E2E click-through** against a running backend (Mongo + Firebase): drag → persist → reload → export | — | 🚫 | S | Only build + component-render tested so far; the HTTP round-trip is unverified live. |
| M1.8 | **Regression sweep**: confirm un-migrated templates + order-less resumes render identical to before | all templates | 🟡 | S | Additive change; default order reproduces prior output (covered by render tests). |

**M1 exit criteria:** every template a user can pick either honors the chosen order in **preview,
PDF, and DOCX**, or is clearly flagged as fixed-layout (✅ done via the guard); verified live
end-to-end (M1.7). The remaining hard gate for a *full* (non-flagged) release is **M1.1**.

---

### M2 — Editing parity (makes both flows genuinely usable, not just reorderable)

| # | Task | File(s) | Status | Effort | Maps to gap |
|---|---|---|---|---|---|
| M2.1 | **Custom-section authoring in Build & Enhance** (add/edit/remove Languages, Awards, etc.) — backend already supports 20 via `customSections` | `ResumeBuilder.jsx`, `Enhance.jsx`, reuse `CustomSection.jsx` | 🚫 | M | §5 #7 |
| M2.2 | **Section-content editing in Enhance** (not just order) — make Enhance more than a read-only dashboard | `Enhance.jsx` | 🚫 | M | §5 #5 |
| M2.3 | **Autosave + draft recovery** in the builder (debounced local + server; restore on return) | `ResumeBuilder.jsx` | 🚫 | S | §5 P0 #4 — refresh currently wipes the wizard |
| M2.4 | **Live template preview while editing** (side-by-side, switch templates without losing data) | new `ResumeEditor` shell | 🚫 | M | §5 #6 |
| M2.5 | **Add missing builder section types** (certifications, languages, awards) to the wizard | `ResumeBuilder.jsx` | 🚫 | M | §5 #7 |
| M2.6 | **Consolidate the two template pages** into one reachable from every flow | `ResumeTemplates.jsx`, `TemplateGallery.jsx` | 🟡 | S | §5 #8 (load-path bug already fixed) |

---

### M3 — Structural & "super-premium" parity (the long game from §7)

| # | Task | Status | Effort | Maps to gap |
|---|---|---|---|---|
| M3.1 | **Single structured data model** as source of truth (sections as ordered typed blocks); markdown/PDF/DOCX become derived outputs | 🚫 | L | §5 P0 #1 |
| M3.2 | **Markdown ↔ structured mapper** so saved resumes + PDF uploads hydrate losslessly into the editor (replaces the lossy `splitMarkdownIntoResume`) | 🚫 | M | §2 Disconnect B |
| M3.3 | **Unified WYSIWYG `ResumeEditor`**; Build & Enhance become modes of it (DnD works in both by construction) | 🚫 | L | §5 P0 #3 |
| M3.4 | **Inline AI** (improve / tailor / translate) with accept-reject diffs — endpoints already exist | 🚫 | M | §5 #9 |
| M3.5 | **Live per-section ATS** that updates as you type | 🚫 | M | §5 #12 |
| M3.6 | **Import polish**: DOCX + image/OCR mapped to structured fields | 🚫 | M | §5 #10 |
| M3.7 | **Surface versions / sharing / comments** inline in the editor | 🚫 | M | §5 #11 |

---

### Recommended next step
**Do M1 first** — it converts the IvyLeague pilot into a shippable feature. M1.1 (migrate
templates) is the bulk of it and is exactly the "replicate from the reference" work; M1.2/M1.3/M1.5
close the silent export/route mismatches that would otherwise ship inconsistent resumes. M2 and M3
are independent follow-on releases and do **not** block shipping drag-and-drop.
