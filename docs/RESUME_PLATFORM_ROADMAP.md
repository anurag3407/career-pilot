# Resume Platform Roadmap — Best of Open Source

**Status:** Current · **Last updated:** 2026-11-28

This document maps the strongest open-source resume projects onto Career Pilot's
own modules, records what shipped in the unification pass, and lists the
remaining phases. The goal is not to fork an OSS builder; it is to make Career
Pilot's resume module the best composite of their ideas while keeping D1, the
gateway Worker, and the existing 60 templates.

## North star

One canonical resume document powers every surface:

```
structured document (schemaVersion + sections + sectionOrder + customSections
                     + template + templateOptions + layout)
        │
        ├── form editor / inline canvas / split view / live template preview
        ├── ATS readability (JSON Resume validator) + keyword/role scoring
        ├── PDF (text layer) / DOCX / Markdown / JSON Resume exports
        ├── versions (D1) · public share links (D1)
        └── AI: structure, improve bullets, tailor, translate (gateway Worker)
```

Markdown, PDF, DOCX and share HTML are **derived outputs**, never the source of
truth. The old markdown-first paths still exist for imported/legacy resumes and
are gradually being hydrated into the structured document.

## Source → capability map

| Capability | Best OSS reference | License | Career Pilot today |
|---|---|---|---|
| Structured document / JSON Resume interop | JSON Resume | MIT | Canonical superset in `context/ResumeContext.jsx`; JSON Resume import/export in `utils/resumeParser.js`. `schemaVersion` now stamped. |
| ATS HTML validation (10 checks, 0–100) | `@jsonresume/ats-validator` | MIT | **Shipped**: `utils/resumeHtml.js` + `utils/atsReadability.js`. Badge in builder preview and template gallery; validator lazy-loaded. |
| Full builder, templates, autosave, live preview | Reactive Resume | MIT | Already present (8 steps, form/inline/split/preview, 60 templates, localStorage autosave). |
| Template/theme choice persisted with the resume | Reactive Resume | MIT | **Shipped**: template + accent + font saved on create/update, restored in the gallery. |
| Public share links | Reactive Resume | MIT | **Shipped**: share toggle in `ResumeView`, D1 `isPublic` + `shareToken`, public `/shared/:token` page (D1-first, Express fallback). Comments remain Express-only. |
| Inline AI with accept/reject | Reactive Resume | MIT | Existing UI; bullet analysis now runs through the gateway Worker (`services/resumeAi.js`) with Express fallback. |
| JD tailoring | Resume-Matcher | Apache-2.0 | **Shipped**: gateway prompt in `resumeAi.tailorResumeToJob`, used by View, application packets, and the old Enhance flow. |
| JD match score / ATS breakdown | Resume-Matcher | Apache-2.0 | Not yet — Phase 2. Current ATS score is keyword/role heuristics + the HTML validator. |
| PDF parseability check | Resume-Matcher / OpenResume | Apache-2.0 / AGPL-3.0 | HTML ATS validator shipped; PDF round-trip extraction test is Phase 2. |
| DOCX import | Reactive Resume | MIT | **Shipped**: `mammoth` (lazy chunk) → text → structured parser in the builder. |
| PDF import | OpenResume | AGPL-3.0 (reference only) | **Fixed**: builder now uses the same browser PDF extraction as `/upload`. |
| Deterministic typographic PDF | RenderCV | MIT | Client `buildResumePdf` writes a real text layer; RenderCV-style server pipeline is Phase 3. |
| Version snapshots | JSON Resume `resume-versions` / Reactive | MIT | **Fixed**: D1 now returns labels + monotonic `versionNumber`; newest-first ordering is deterministic. Builder's fake local version panel removed. |
| Markdown/DOCX/JSON/TXT export | Reactive Resume | MIT | Already present and order-aware (PDF/DOCX tests). |
| Multi-device autosave / draft recovery | Reactive Resume | MIT | localStorage only today; server draft is Phase 4. |
| Collaboration comments | Reactive Resume | MIT | Express-only today; D1 comments + presence is Phase 4. |

## What shipped in the unification pass (2026-11-28)

### Document & validation
- `context/ResumeContext.jsx`
  - `RESUME_DOCUMENT_VERSION` and `schemaVersion` on every normalized document.
  - Carries `template` + `templateOptions` (accent/font) through normalization.
  - **No more dummy-data backfill for partial real resumes** — only a truly empty
    preview falls back to the sample. This prevents ATS checks from passing on
    fake contact details.
- `utils/resumeHtml.js` — semantic, single-column, table-free HTML serializer.
- `utils/atsReadability.js` — lazy `@jsonresume/ats-validator` integration with
  score/grade/issues/recommendations.
- ATS badge/panel in `components/resume/LiveResumePreview.jsx` and the template
  gallery preview.

### Builder
- PDF import fixed (`uploadApi.uploadPdf`, browser extraction).
- DOCX import added (`mammoth`, lazy).
- Template, accent and font are owned by the builder, autosaved with the draft,
  sent on create, and restored.
- `Save Resume` validates all required steps before creating, and lands on
  `/resume/:id` (always available) instead of the Express-only Enhance page.
- Fake local "Save Version / Restore" UI removed.
- Post-save/upload/text flows now land on the View page; Enhance is an explicit
  action with clear errors when its backend is absent.

### Saved resume
- Client-side text-layer PDF fallback when `/api/resumes/:id/download` is not
  deployed; the misleading font/size export toast is gone; font/size controls
  now affect the preview.
- Custom sections persist to D1 (with a one-time localStorage migration).
- Share toggle (D1 `isPublic` + `shareToken`) with copyable link.
- Public share page renders the semantic document in a sandboxed iframe and
  falls back to Express for comments.

### AI
- `services/resumeAi.js` ports these prompts to the gateway Worker with an
  Express fallback: text→resume, tailor, translate, bullet improvement.
- Enhance fails loudly if `/api` serves the SPA shell instead of JSON/SSE; it can
  no longer overwrite `enhancedText` with an empty stream.

### Verification
- Frontend: 244 tests passing (40 files), including new document/ATS tests and a
  Save-validation test.
- Worker: 14 E2E tests passing, including template persistence, public share,
  version numbering and tenant isolation.
- `npm run build` green; validator/cheerio and mammoth are lazy chunks.

## Phase 2 — Resume-Matcher parity (next)

1. **JD match score** in the builder/View: paste a JD, get a 0–100 match with
   keyword/skills/title/section/date breakdown computed in plain code, plus
   missing-keyword chips. Keep AI only for rewriting.
2. **Per-section ATS feedback** in the structured editor (score each section as
   the user types; no AI call).
3. **PDF round-trip parseability**: extract text from the exported PDF with
   pdf.js and run the ATS validator on the extracted text, not just the source
   HTML.
4. **Inline AI everywhere**: summary, experience bullets, projects and custom
   sections get the same accept/reject panel; all through `resumeAi`.
5. **JSON Resume schema validation** on import/export, with field-level errors
   and a one-click "fix" for missing contact fields.
6. **Version diff** (side-by-side, word-level) and restore-with-preview.

## Phase 3 — RenderCV-grade output

1. A server-side (or Worker-compatible) deterministic renderer with named
   themes, page-size/margin/typography tokens and strict validation.
2. Keep the current 60 React templates for on-screen preview; add a
   "print-perfect" export path for the most ATS-sensitive templates.
3. Accessibility and print QA: heading hierarchy, contrast, selectable text,
   no raster fallback for the default path.
4. Template/theme tokens shared between resume and portfolio (same accent/font
   vocabulary).

## Phase 4 — collaboration & platform

1. D1-native resume comments + section anchors; keep Express as an optional
   realtime provider.
2. Server-side draft autosave (debounced) with conflict resolution and
   multi-device recovery.
3. Share analytics (views/downloads) and expiring/password links.
4. Plan entitlements: enforce the free resume limit in the D1 create path
   (today `backend/src/middleware/planLimits.js` is unused).
5. Playwright E2E: build → save → reload → template → share → PDF/DOCX.

## Acceptance criteria for "best of all"

- A new user can import PDF/DOCX/JSON/Markdown, edit in the canvas, see a live
  template, get an ATS score with actionable issues, save, reopen on another
  device, share a public link, and export PDF/DOCX without touching `/api`.
- Every resume path uses the canonical document; no surface silently drops
  section order, custom sections, template or contact fields.
- ATS validator score ≥ 80 on the default template for a complete resume, and
  the PDF text layer passes the same check after extraction.
- All resume AI actions work through the gateway with BYOK/platform keys, and
  fail with a clear message (not a false success) when no AI backend is present.
- Frontend, Worker and build gates stay green; new behavior has tests.

## Licensing notes

- MIT: JSON Resume, `@jsonresume/ats-validator`, Reactive Resume, RenderCV.
- Apache-2.0: Resume-Matcher.
- AGPL-3.0: OpenResume — reference only; do not embed its code in a proprietary
  build. `mammoth` is BSD-2-Clause; `pdf.js` is Apache-2.0.
