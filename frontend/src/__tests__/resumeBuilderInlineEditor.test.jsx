import { describe, test, expect, beforeEach, beforeAll, afterAll, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import JSZip from 'jszip'
import ResumeBuilder from '../pages/ResumeBuilder'
import ResumeTemplates from '../pages/ResumeTemplates'
import { GALLERY } from '../data/resumeTemplates'
import { ResumeProvider } from '../context/ResumeContext'

/**
 * End-to-end interaction tests for the inline resume canvas.
 *
 * These drive the real components through real DOM events — typing into the
 * contentEditable fields, opening the inline month pickers, dragging a block's
 * grip onto another block — and assert on the builder state that results (via
 * the form view, the autosave draft, and the canvas DOM).
 *
 * jsdom has no layout engine, so the paper's height is stubbed to drive the
 * page counter; everything else (React, the real resolver, the real ops, the
 * real PDF/DOCX engines and the real download helper) runs unmodified. jsdom
 * also has no object URLs, so those are provided here and spied on to prove a
 * click on an export button really builds a Blob, names it and saves it.
 */

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'user-1', name: 'Ada Lovelace' }, loading: false }),
}))

/* ── layout stubs (jsdom reports zero height for everything) ──────────────── */
let paperHeight = 1122
let resizeCallbacks = []
const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')

/* ── download capture (jsdom implements neither object URLs nor clicks) ───── */
let createdBlobs = []
let revokedUrls = []
let downloads = []
let anchorClickSpy

const originalCreateObjectURL = URL.createObjectURL
const originalRevokeObjectURL = URL.revokeObjectURL

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get() {
      return this.classList && this.classList.contains('rce-paper') ? paperHeight : 0
    },
  })
  globalThis.ResizeObserver = class {
    constructor(callback) { resizeCallbacks.push(callback) }
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  URL.createObjectURL = vi.fn((blob) => {
    createdBlobs.push(blob)
    return `blob:jsdom/${createdBlobs.length}`
  })
  URL.revokeObjectURL = vi.fn((url) => { revokedUrls.push(url) })
  anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function capture() {
    downloads.push({ href: this.getAttribute('href'), download: this.download })
  })
})

afterAll(() => {
  anchorClickSpy.mockRestore()
  if (originalCreateObjectURL) URL.createObjectURL = originalCreateObjectURL
  else delete URL.createObjectURL
  if (originalRevokeObjectURL) URL.revokeObjectURL = originalRevokeObjectURL
  else delete URL.revokeObjectURL
  if (originalOffsetHeight) {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight)
  }
  delete globalThis.ResizeObserver
})

/* ── helpers ─────────────────────────────────────────────────────────────── */
/** Raw ISO month/year values must never reach a user-visible surface. */
const ISO_DATE = /(19|20)\d\d-(0[1-9]|1[0-2])/

const qa = (root, selector) => Array.from(root.querySelectorAll(selector))

function switchView(container, mode) {
  const tab = container.querySelector(`[data-view-tab="${mode}"]`)
  if (!tab) throw new Error(`No view tab "${mode}"`)
  fireEvent.click(tab)
}

function openInlineEditor(container) {
  switchView(container, 'inline')
}

/** The wizard's Preview step (its stepper button, not the view-switcher tab). */
function openPreviewStep() {
  const matches = screen.getAllByRole('button', { name: /^Preview$/i })
  const stepper = matches.find((button) => !button.hasAttribute('data-view-tab'))
  if (!stepper) throw new Error('No Preview step button')
  fireEvent.click(stepper)
}

function sectionTitles(container) {
  return qa(container, '.rce-section')
    .filter((section) => section.dataset.section !== 'summary')
    .map((section) => (section.querySelector('.rce-section-title')?.textContent || '').trim())
}

function sectionByTitle(container, title) {
  const found = qa(container, '.rce-section').find((section) => {
    const label = section.querySelector('.rce-section-title')
    return label && label.textContent.trim() === title
  })
  if (!found) throw new Error(`No section titled "${title}". Have: ${sectionTitles(container).join(', ')}`)
  return found
}

/** Type into a contentEditable the way a user does (input event, not value set). */
function typeInto(element, text) {
  if (!element) throw new Error('typeInto: element not found')
  fireEvent.input(element, { target: { textContent: text } })
}

/** Drag a block's grip onto another block (drop lands before the target). */
function dragOnto(gripElement, targetElement) {
  if (!gripElement) throw new Error('dragOnto: no drag handle')
  if (!targetElement) throw new Error('dragOnto: no drop target')
  fireEvent.dragStart(gripElement)
  fireEvent.dragOver(targetElement)
  fireEvent.drop(targetElement)
  fireEvent.dragEnd(gripElement)
}

function renderBuilder() {
  return render(
    <MemoryRouter initialEntries={['/resume-builder/build']}>
      <ResumeBuilder />
    </MemoryRouter>
  )
}

function fillBasics(container) {
  typeInto(container.querySelector('.rce-name'), 'Ada Lovelace')
  typeInto(container.querySelector('.rce-title'), 'Principal Engineer')
  typeInto(container.querySelectorAll('.rce-contact .rce-editable')[0], 'ada@analytical.org')
  typeInto(container.querySelector('.rce-section > .rce-editable'), 'Computing pioneer.')
  typeInto(sectionByTitle(container, 'Experience').querySelector('.rce-role'), 'Analyst')
}

/** Open a canvas period field, set its months and close the picker. */
function setPeriod(target, { start, end, current = false }) {
  fireEvent.click(target.querySelector('.rce-period'))
  if (start) fireEvent.change(screen.getByLabelText('Start date'), { target: { value: start } })
  if (current) fireEvent.click(screen.getByLabelText(/Now/i))
  if (end) fireEvent.change(screen.getByLabelText('End date'), { target: { value: end } })
  fireEvent.click(screen.getByTitle('Done'))
}

/** Type ISO months into the resume, the way a user filling the date pickers does. */
function fillDatedResume(container) {
  fillBasics(container)
  const experience = sectionByTitle(container, 'Experience')
  typeInto(experience.querySelector('.rce-bullet-text'), 'Shipped the difference engine')
  setPeriod(experience, { start: '2020-01', current: true })

  const education = sectionByTitle(container, 'Education')
  typeInto(education.querySelector('.rce-role'), 'University of London')
  typeInto(education.querySelector('.rce-company'), 'BSc, Mathematics')
  setPeriod(education, { start: '2008-09', end: '2011-06' })
}

async function openExperienceStep() {
  fireEvent.click(screen.getByRole('button', { name: /^Experience$/i }))
  // the wizard swaps steps inside AnimatePresence — the DOM lands a tick later
  await waitFor(() => expect(screen.getAllByPlaceholderText(/Developed feature X/i).length).toBeGreaterThan(0))
  // one textarea per experience entry; the first is the top-most role
  return screen.getAllByPlaceholderText(/Developed feature X/i)[0]
}

/** DOCX stores XML text, so `&` arrives as `&amp;`. Decode before asserting. */
function unescapeXml(value) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
}

beforeEach(() => {
  localStorage.clear()
  paperHeight = 1122
  resizeCallbacks = []
  createdBlobs = []
  revokedUrls = []
  downloads = []
  vi.clearAllMocks()
})

/* ── tests ───────────────────────────────────────────────────────────────── */

describe('Inline editor — text editing', () => {
  test('edits to name, title, contact, summary and bullets reach builder state', async () => {
    const { container } = renderBuilder()
    openInlineEditor(container)

    typeInto(container.querySelector('.rce-name'), 'Ada Lovelace')
    typeInto(container.querySelector('.rce-title'), 'Principal Engineer')
    typeInto(container.querySelectorAll('.rce-contact .rce-editable')[0], 'ada@analytical.org')
    typeInto(container.querySelector('.rce-section > .rce-editable'), 'Computing pioneer with ten years shipping systems.')

    const experience = sectionByTitle(container, 'Experience')
    typeInto(experience.querySelector('.rce-role'), 'Lead Analyst')
    typeInto(experience.querySelector('.rce-company'), 'Analytical Engine Ltd')
    typeInto(experience.querySelector('.rce-bullet-text'), 'Built the first published algorithm, cutting runtime 40%')

    // Same values, seen through the form
    switchView(container, 'form')
    expect(screen.getByLabelText(/Full Name/i).value).toBe('Ada Lovelace')
    expect(screen.getByLabelText(/Professional Title/i).value).toBe('Principal Engineer')
    expect(screen.getByLabelText(/^Email/i).value).toBe('ada@analytical.org')
    expect(screen.getByLabelText(/Professional Summary/i).value).toBe('Computing pioneer with ten years shipping systems.')

    const description = await openExperienceStep()
    expect(description.value).toContain('first published algorithm')
  }, 20000)

  test('the autosave draft contains what was typed on the page', async () => {
    const { container } = renderBuilder()
    openInlineEditor(container)
    fillBasics(container)

    await waitFor(() => {
      const raw = localStorage.getItem('careerpilot_resume_builder_draft')
      expect(raw).toBeTruthy()
      const draft = JSON.parse(raw)
      expect(draft.personal.name).toBe('Ada Lovelace')
      expect(draft.personal.title).toBe('Principal Engineer')
      expect(draft.personal.email).toBe('ada@analytical.org')
      expect(draft.experience[0].title).toBe('Analyst')
    }, { timeout: 5000 })
  }, 20000)
})

describe('Inline editor — dates', () => {
  test('inline month pickers write start/end dates and the Now toggle clears the end date', async () => {
    const { container } = renderBuilder()
    openInlineEditor(container)
    const experience = sectionByTitle(container, 'Experience')

    fireEvent.click(experience.querySelector('.rce-period'))
    fireEvent.change(screen.getByLabelText('Start date'), { target: { value: '2021-03' } })
    fireEvent.change(screen.getByLabelText('End date'), { target: { value: '2023-07' } })
    fireEvent.click(screen.getByTitle('Done'))

    expect(experience.querySelector('.rce-period').textContent).toBe('Mar 2021 – Jul 2023')

    fireEvent.click(experience.querySelector('.rce-period'))
    fireEvent.click(screen.getByLabelText(/Now/i))
    fireEvent.click(screen.getByTitle('Done'))

    expect(experience.querySelector('.rce-period').textContent).toBe('Mar 2021 – Present')
    // never render raw ISO months on the page
    expect(container.querySelector('.rce-paper').textContent).not.toMatch(/20\d\d-\d\d/)

    switchView(container, 'form')
    await openExperienceStep()
    const months = qa(container, 'input[type="month"]')
    expect(months[0].value).toBe('2021-03')
    expect(months[1].value).toBe('')
  }, 20000)
})

describe('Inline editor — dates on every visible surface', () => {
  test('canvas, form, wizard preview, split and preview all show "Jan 2020 – Present" and never ISO', async () => {
    const { container } = renderBuilder()
    openInlineEditor(container)
    fillDatedResume(container)

    // 1. inline canvas
    expect(sectionByTitle(container, 'Experience').querySelector('.rce-period').textContent).toBe('Jan 2020 – Present')
    expect(sectionByTitle(container, 'Education').querySelector('.rce-period').textContent).toBe('Sep 2008 – Jun 2011')
    expect(container.querySelector('.rce-paper').textContent).not.toMatch(ISO_DATE)

    // 2. form steps (month inputs hold ISO values but render no ISO text)
    switchView(container, 'form')
    expect(container.textContent).not.toMatch(ISO_DATE)

    // 3. the wizard's Preview step renders generateMarkdown() — the text that is
    //    also sent to the backend, so it must not leak "2020-01" either
    openPreviewStep()
    await waitFor(() => expect(container.textContent).toContain('Jan 2020 – Present'))
    expect(container.textContent).toContain('Sep 2008 – Jun 2011')
    expect(container.textContent).not.toMatch(ISO_DATE)

    // 4. split view — the real template, driven by the same resume data
    switchView(container, 'split')
    await waitFor(() => expect(container.textContent).toContain('Jan 2020 – Present'), { timeout: 10000 })
    expect(container.textContent).not.toMatch(ISO_DATE)

    // 5. preview view
    switchView(container, 'preview')
    await waitFor(() => expect(container.textContent).toContain('Jan 2020 – Present'), { timeout: 10000 })
    expect(container.textContent).not.toMatch(ISO_DATE)
  }, 40000)
})

/** Every base template the gallery can open, read off the catalog itself so a
 *  newly registered template is covered without touching this test. */
const GALLERY_TEMPLATE_IDS = [...new Set(GALLERY.map((entry) => entry.baseId || entry.id))]

/** A resume that carries formatted periods AND the raw ISO months the builder
 *  stores, so a template that reads startDate/endDate instead of period leaks
 *  "2020-01" into its own preview. */
const DATED_RESUME = {
  personal: {
    name: 'Ada Lovelace',
    title: 'Principal Engineer',
    email: 'ada@analytical.org',
    phone: '+44 20 7946 0958',
    location: 'London, UK',
    website: 'ada.dev',
    linkedin: 'linkedin.com/in/ada',
    github: 'github.com/ada',
    summary: 'Computing pioneer who shipped the first published algorithm.',
  },
  experience: [{
    role: 'Analyst',
    company: 'Analytical Engine Ltd',
    location: 'London',
    period: 'Jan 2020 – Present',
    startDate: '2020-01',
    endDate: '',
    current: true,
    bullets: ['Shipped the difference engine', 'Documented note G'],
  }],
  education: [{
    institution: 'University of London',
    degree: 'BSc, Mathematics',
    field: 'Mathematics',
    location: 'London',
    period: 'Sep 2008 – Jun 2011',
    startDate: '2008-09',
    endDate: '2011-06',
    description: 'First Class Honours',
  }],
  projects: [{
    title: 'Note G',
    link: 'note-g.dev',
    description: 'First published algorithm for computing Bernoulli numbers.',
    techStack: ['Analytical Engine', 'Mathematics'],
  }],
  skills: [{ name: 'Mathematics', level: 'Expert' }, { name: 'Algorithms' }, { name: 'Technical Writing' }],
  certifications: [{ name: 'Chartered Engineer', issuer: 'IET', year: '2021' }],
  sectionOrder: ['experience', 'education', 'projects', 'skills', 'certifications'],
}

describe('Templates gallery — dates', () => {
  test('every template the gallery offers renders formatted periods and no raw ISO', async () => {
    expect(GALLERY_TEMPLATE_IDS.length).toBeGreaterThan(30)

    const problems = []
    const renderedIds = []
    for (const id of GALLERY_TEMPLATE_IDS) {
      const loaded = await import(`../components/resume/templates/${id}/index.jsx`)
      const Template = loaded.default
      const { container, unmount } = render(
        <ResumeProvider value={DATED_RESUME}>
          <Template />
        </ResumeProvider>
      )
      const text = container.textContent

      if (!text.includes('Jan 2020 – Present')) problems.push(`${id}: experience period missing`)
      if (!text.includes('Sep 2008 – Jun 2011')) problems.push(`${id}: education period missing`)
      const iso = text.match(ISO_DATE)
      if (iso) problems.push(`${id}: raw ISO date "${iso[0]}"`)

      unmount()
      renderedIds.push(id)
    }

    // the loop really visited the whole catalog, not a sample of it
    expect(renderedIds).toEqual(GALLERY_TEMPLATE_IDS)
    expect(problems).toEqual([])
  }, 180000)

  test('a resume carrying only ISO months is still rendered with formatted dates', async () => {
    // the shared period helper (ResumeContext.pickPeriod) has to format the
    // builder's month values — templates never see a raw "2020-01" interval
    const rawOnly = {
      ...DATED_RESUME,
      experience: [{ ...DATED_RESUME.experience[0], period: undefined }],
      education: [{ ...DATED_RESUME.education[0], period: undefined }],
    }
    const loaded = await import(`../components/resume/templates/${GALLERY_TEMPLATE_IDS[0]}/index.jsx`)
    const Template = loaded.default
    const { container } = render(
      <ResumeProvider value={rawOnly}>
        <Template />
      </ResumeProvider>
    )

    expect(container.textContent).toContain('Jan 2020 – Present')
    expect(container.textContent).toContain('Sep 2008 – Jun 2011')
    expect(container.textContent).not.toMatch(ISO_DATE)
  }, 30000)

  test('the gallery preview renders formatted periods, never the ISO fields', async () => {
    const builderData = {
      personal: { name: 'Ada Lovelace', title: 'Principal Engineer', email: 'ada@analytical.org' },
      experience: [{
        role: 'Analyst',
        company: 'Analytical Engine Ltd',
        location: 'London',
        period: 'Jan 2020 – Present',
        startDate: '2020-01',
        endDate: '',
        current: true,
        bullets: ['Shipped the difference engine'],
      }],
      education: [{
        institution: 'University of London',
        degree: 'BSc, Mathematics',
        period: 'Sep 2008 – Jun 2011',
        startDate: '2008-09',
        endDate: '2011-06',
      }],
      skills: [{ name: 'Mathematics' }],
      sectionOrder: ['experience', 'education', 'skills'],
    }

    const { container } = render(
      <MemoryRouter initialEntries={[{ pathname: '/resume-templates', state: { builderData } }]}>
        <ResumeTemplates />
      </MemoryRouter>
    )

    // the gallery cards themselves carry no dates
    await waitFor(() => expect(screen.getByText(/Choose your resume style/i)).toBeTruthy())
    expect(container.textContent).not.toMatch(ISO_DATE)

    fireEvent.change(screen.getByPlaceholderText('Search templates…'), { target: { value: 'Ivy League' } })
    const cards = screen.getAllByRole('button', { name: /Ivy League/ })
    fireEvent.click(cards[0])

    // the selected template renders the resume through ResumeProvider
    await waitFor(() => expect(container.textContent).toContain('Jan 2020 – Present'), { timeout: 15000 })
    expect(container.textContent).toContain('Sep 2008 – Jun 2011')
    expect(container.textContent).not.toMatch(ISO_DATE)
  }, 60000)
})

describe('Inline editor — rearranging', () => {
  test('sections reorder by drag handle and by arrow buttons, and the order sticks', () => {
    const { container } = renderBuilder()
    openInlineEditor(container)

    expect(sectionTitles(container)).toEqual(['Education', 'Experience', 'Projects', 'Skills'])

    // drag the last section onto the first
    dragOnto(
      sectionByTitle(container, 'Skills').querySelector('.rce-gutter .rce-grip'),
      sectionByTitle(container, 'Education'),
    )
    expect(sectionTitles(container)).toEqual(['Skills', 'Education', 'Experience', 'Projects'])

    // arrow buttons move it again
    fireEvent.click(sectionByTitle(container, 'Education').querySelectorAll('.rce-gutter button')[1])
    expect(sectionTitles(container)).toEqual(['Education', 'Skills', 'Experience', 'Projects'])

    // survives leaving and re-entering the canvas
    switchView(container, 'form')
    openInlineEditor(container)
    expect(sectionTitles(container)).toEqual(['Education', 'Skills', 'Experience', 'Projects'])
  })

  test('roles and bullets reorder within a section', async () => {
    const { container } = renderBuilder()
    openInlineEditor(container)
    const experience = () => sectionByTitle(container, 'Experience')
    const firstEntry = () => qa(experience(), '.rce-entry')[0]
    const roles = () => qa(experience(), '.rce-role').map((el) => el.textContent)
    const bullets = () => qa(firstEntry(), '.rce-bullet-text').map((el) => el.textContent)

    typeInto(experience().querySelector('.rce-role'), 'Engineer')
    fireEvent.click(within(experience()).getByRole('button', { name: /Add role/i }))
    expect(roles()).toEqual(['Engineer', ''])
    typeInto(qa(experience(), '.rce-role')[1], 'Designer')

    dragOnto(
      qa(experience(), '.rce-entry')[1].querySelector('.rce-gutter .rce-grip'),
      qa(experience(), '.rce-entry')[0],
    )
    expect(roles()).toEqual(['Designer', 'Engineer'])

    typeInto(firstEntry().querySelector('.rce-bullet-text'), 'Bullet one')
    fireEvent.click(within(firstEntry()).getByRole('button', { name: /Add bullet/i }))
    typeInto(qa(firstEntry(), '.rce-bullet-text')[1], 'Bullet two')
    expect(bullets()).toEqual(['Bullet one', 'Bullet two'])

    dragOnto(qa(firstEntry(), '.rce-bullet-tools .rce-grip')[1], qa(firstEntry(), '.rce-bullet')[0])
    expect(bullets()).toEqual(['Bullet two', 'Bullet one'])

    // the reordered bullets are what the form (and therefore the exports) see
    switchView(container, 'form')
    const description = await openExperienceStep()
    expect(description.value.split('\n')).toEqual(['Bullet two', 'Bullet one'])
  }, 20000)
})

describe('Inline editor — adding and deleting', () => {
  test('entries, bullets, skill rows and custom sections can be added and removed', () => {
    const { container } = renderBuilder()
    openInlineEditor(container)
    const experience = () => sectionByTitle(container, 'Experience')
    const entryCount = () => qa(experience(), '.rce-entry').length

    // entry
    expect(entryCount()).toBe(1)
    fireEvent.click(within(experience()).getByRole('button', { name: /Add role/i }))
    expect(entryCount()).toBe(2)
    fireEvent.click(within(qa(experience(), '.rce-entry')[1]).getByTitle('Delete'))
    expect(entryCount()).toBe(1)

    // bullet
    typeInto(experience().querySelector('.rce-bullet-text'), 'Keep me')
    fireEvent.click(within(experience()).getByRole('button', { name: /Add bullet/i }))
    expect(qa(experience(), '.rce-bullet').length).toBe(2)
    fireEvent.click(within(qa(experience(), '.rce-bullet')[1]).getByTitle('Delete bullet'))
    expect(qa(experience(), '.rce-bullet').length).toBe(1)
    expect(qa(experience(), '.rce-bullet-text')[0].textContent).toBe('Keep me')

    // skill rows: the empty section starts with one row to type into
    const skillRows = () => qa(container, '.rce-skill-row')
    expect(skillRows().length).toBe(1)
    typeInto(container.querySelector('.rce-skill-value'), 'React, TypeScript')
    fireEvent.click(screen.getByRole('button', { name: /Add skills row/i }))
    expect(skillRows().length).toBe(2)
    fireEvent.click(within(skillRows()[1]).getByTitle('Delete row'))
    expect(skillRows().length).toBe(1)
    expect(container.querySelector('.rce-skill-value').textContent).toBe('React, TypeScript')

    // custom section
    fireEvent.click(screen.getByRole('button', { name: 'Custom section' }))
    expect(sectionTitles(container)).toContain('Additional Information')
    fireEvent.click(within(sectionByTitle(container, 'Additional Information')).getByTitle('Delete section'))
    expect(sectionTitles(container)).not.toContain('Additional Information')

    // an untouched known section is offered as a chip instead of being rendered empty
    expect(sectionTitles(container)).not.toContain('Certifications')
    // scoped to the page: the wizard stepper has a "Certifications" tab too
    fireEvent.click(within(container.querySelector('.rce-paper')).getByRole('button', { name: 'Certifications' }))
    expect(sectionTitles(container)).toContain('Certifications')
    expect(qa(container, '.rce-paper').length).toBe(1)
  })
})

describe('Inline editor — formats', () => {
  function pickFormat(currentName, nextName) {
    fireEvent.click(screen.getByRole('button', { name: currentName }))
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${nextName}`) }))
  }

  test('switching formats re-typesets the page and leaves the content alone', () => {
    const { container } = renderBuilder()
    openInlineEditor(container)
    typeInto(container.querySelector('.rce-name'), 'Ada Lovelace')
    typeInto(sectionByTitle(container, 'Experience').querySelector('.rce-role'), 'Analyst')

    const paper = () => container.querySelector('.rce-paper')
    expect(paper().dataset.head).toBe('left')
    expect(paper().style.fontFamily).toContain('Helvetica')

    pickFormat('Modern Clean', 'Compact')
    expect(paper().dataset.head).toBe('left')
    expect(paper().dataset.headings).toBe('underline')
    expect(paper().style.fontFamily).toContain('Arial')
    expect(container.querySelector('.rce-name').textContent).toBe('Ada Lovelace')

    pickFormat('Compact', 'Classic ATS')
    expect(paper().dataset.head).toBe('center')
    expect(paper().dataset.headings).toBe('underline')
    expect(paper().style.fontFamily).toContain('Georgia')
    expect(container.querySelector('.rce-name').textContent).toBe('Ada Lovelace')

    pickFormat('Classic ATS', 'Editorial')
    expect(paper().dataset.headings).toBe('bar')
    expect(parseFloat(paper().style.fontSize)).toBeGreaterThan(13)
    expect(sectionByTitle(container, 'Experience').querySelector('.rce-role').textContent).toBe('Analyst')

    // the chosen format survives a tab round-trip
    switchView(container, 'form')
    openInlineEditor(container)
    expect(container.querySelector('.rce-paper').dataset.headings).toBe('bar')
  })
})

describe('Inline editor — page fit', () => {
  test('the page counter follows the document and Fit closer compresses the page', () => {
    paperHeight = 1400 // 1.25 A4 pages
    const { container } = renderBuilder()
    openInlineEditor(container)
    typeInto(container.querySelector('.rce-name'), 'Ada Lovelace')

    const paper = container.querySelector('.rce-paper')
    expect(screen.getByText('2 pages')).toBeTruthy()
    const initialFontSize = parseFloat(paper.style.fontSize)
    const initialPadding = paper.style.padding

    fireEvent.click(screen.getByRole('button', { name: /Fit closer/i }))
    expect(parseFloat(paper.style.fontSize)).toBeLessThan(initialFontSize)
    expect(paper.style.padding).not.toBe(initialPadding)
    expect(screen.getByText('2 pages')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Reset spacing/i })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /Reset spacing/i }))
    expect(parseFloat(paper.style.fontSize)).toBeCloseTo(initialFontSize, 5)
    expect(paper.style.padding).toBe(initialPadding)

    // a document that fits is reported as a single page and offers no fit control
    paperHeight = 900
    act(() => { resizeCallbacks.forEach((callback) => callback()) })
    expect(screen.getByText('1 page')).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Fit closer/i })).toBeNull()
  })
})

describe('Inline editor — one source of truth across views', () => {
  test('Inline, Form, Split and Preview show the same resume', () => {
    const { container } = renderBuilder()
    openInlineEditor(container)
    fillBasics(container)

    switchView(container, 'form')
    expect(screen.getByLabelText(/Full Name/i).value).toBe('Ada Lovelace')

    switchView(container, 'split')
    expect(screen.getByLabelText(/Full Name/i).value).toBe('Ada Lovelace')
    expect(screen.getByTitle(/Download ATS-Friendly PDF/i)).toBeTruthy()

    switchView(container, 'preview')
    expect(screen.getByTitle(/Download ATS-Friendly PDF/i)).toBeTruthy()
    expect(container.querySelector('.rce-paper')).toBeNull()

    openInlineEditor(container)
    expect(container.querySelector('.rce-name').textContent).toBe('Ada Lovelace')
    expect(container.querySelector('.rce-title').textContent).toBe('Principal Engineer')
    expect(sectionByTitle(container, 'Experience').querySelector('.rce-role').textContent).toBe('Analyst')
  })
})

describe('Inline editor — exports', () => {
  test('the PDF button downloads a real, named PDF and releases its object URL', async () => {
    const { container } = renderBuilder()
    openInlineEditor(container)
    fillDatedResume(container)

    fireEvent.click(screen.getByRole('button', { name: 'PDF' }))

    await waitFor(() => expect(downloads).toHaveLength(1), { timeout: 10000 })

    // a real PDF Blob, handed to the real object-URL + anchor download path
    expect(createdBlobs).toHaveLength(1)
    const blob = createdBlobs[0]
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('application/pdf')
    expect(blob.size).toBeGreaterThan(1000)
    expect(downloads[0]).toEqual({ href: 'blob:jsdom/1', download: 'Ada_Lovelace_Resume.pdf' })

    // …whose bytes carry the resume, with human dates and no ISO
    const raw = Buffer.from(await blob.arrayBuffer()).toString('latin1')
    expect(raw.startsWith('%PDF-')).toBe(true)
    expect(raw).toContain('Ada Lovelace')
    expect(raw).toContain('EXPERIENCE')
    expect(raw).toContain('Shipped the difference engine')
    expect(raw).toContain('Jan 2020')
    expect(raw).toContain('Present')
    expect(raw).not.toMatch(ISO_DATE)

    await waitFor(() => expect(revokedUrls).toEqual(['blob:jsdom/1']), { timeout: 5000 })
  }, 40000)

  test('the .docx button downloads a real, named Word document and releases its object URL', async () => {
    const { container } = renderBuilder()
    openInlineEditor(container)
    fillDatedResume(container)

    fireEvent.click(screen.getByRole('button', { name: '.docx' }))

    await waitFor(() => expect(downloads).toHaveLength(1), { timeout: 15000 })

    expect(createdBlobs).toHaveLength(1)
    const blob = createdBlobs[0]
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    expect(blob.size).toBeGreaterThan(1000)
    expect(downloads[0].download).toBe('Ada_Lovelace_Resume.docx')
    expect(downloads[0].href).toMatch(/^blob:jsdom\/\d+$/)

    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    const xml = await zip.file('word/document.xml').async('string')
    const text = unescapeXml(xml.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ')

    expect(text).toContain('Ada Lovelace')
    expect(text).toContain('EXPERIENCE')
    expect(text).toContain('Shipped the difference engine')
    expect(text).toContain('Jan 2020 – Present')
    expect(text).toContain('Sep 2008 – Jun 2011')
    expect(text).not.toMatch(ISO_DATE)

    await waitFor(() => expect(revokedUrls).toEqual([downloads[0].href]), { timeout: 5000 })
  }, 40000)
})
