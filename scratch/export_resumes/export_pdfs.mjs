#!/usr/bin/env node
/**
 * SSR + html2canvas + jspdf PDF export pipeline.
 *
 * For each base resume template:
 *   1. Use esbuild to compile the template module + its imports into a
 *      self-contained ES module that exports a default React component
 *      reading from useResume().
 *   2. SSR the template into HTML using react-dom/server.
 *   3. Use puppeteer headless Chrome with html2canvas + jspdf to render the
 *      HTML to a multi-page A4 PDF (using the same code path the production
 *      app uses for its ATS-safe export).
 *
 * Output: one PDF per template, named `<TemplateId>.pdf`.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pathToFileURL } from 'url'
import * as esbuild from '/Users/jarvis/Downloads/career-pilot/frontend/node_modules/esbuild/lib/main.js'
import puppeteer from '/Users/jarvis/Downloads/career-pilot/frontend/node_modules/puppeteer/lib/puppeteer/puppeteer.js'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const FRONTEND = '/Users/jarvis/Downloads/career-pilot/frontend'
const TEMPLATE_DIR = path.join(FRONTEND, 'src/components/resume/templates')
const CONTEXT_FILE = path.join(FRONTEND, 'src/context/ResumeContext.jsx')
const SHARED_DIR = path.join(FRONTEND, 'src/components/resume/shared')
const DUMMY_DATA = path.join(FRONTEND, 'src/data/dummy_resume.json')
const RESUME_DATA_JSON = path.join(__dirname, 'resume_data.json')
const OUTPUT_DIR = __dirname
const CHROME_PATH = '/Users/jarvis/.cache/puppeteer/chrome-headless-shell/mac_arm-149.0.7827.22/chrome-headless-shell-mac-arm64/chrome-headless-shell'

// Local node_modules to require React/ReactDOM
const NODE_MODULES = path.join(FRONTEND, 'node_modules')
const require = createRequire(import.meta.url)

// We build a tiny wrapper per template that takes `data` and renders the
// template via react-dom/server into HTML. The wrapper also exports the
// required imports.

function listTemplates() {
  return fs.readdirSync(TEMPLATE_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort()
}

// Build the entry point for a template: a JSX file that exports a default
// function accepting `data` and returning rendered HTML.
function buildEntryFor(templateId) {
  const entryDir = path.join('/tmp', 'resume_entries', templateId)
  fs.mkdirSync(entryDir, { recursive: true })
  const entryPath = path.join(entryDir, 'entry.mjs')

  // Use react-dom/server.renderToStaticMarkup
  const entrySrc = `
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ResumeProvider, normalizeResumeData } from '${CONTEXT_FILE}'
import Template from '${path.join(TEMPLATE_DIR, templateId, 'index.jsx')}'

export function render(data) {
  const normalized = normalizeResumeData(data)
  const html = renderToStaticMarkup(
    React.createElement(ResumeProvider, { value: normalized },
      React.createElement(Template)),
  )
  return html
}
`
  fs.writeFileSync(entryPath, entrySrc)
  return entryPath
}

async function renderHtmlFor(templateId, resumeData) {
  const entry = buildEntryFor(templateId)
  const outFile = path.join('/tmp', `resume_${templateId}.mjs`)

  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'es2020',
    loader: { '.js': 'jsx', '.jsx': 'jsx', '.json': 'json' },
    jsx: 'automatic',
    write: false,
    alias: { '@': path.join(FRONTEND, 'src') },
    external: ['react', 'react-dom', 'react-dom/server', 'react/jsx-runtime'],
  })

  const code = result.outputFiles[0].text
  // Write the bundle to the frontend's node_modules parent so Node can
  // resolve 'react' from its own node_modules.
  const tmpFile = path.join('/Users/jarvis/Downloads/career-pilot/frontend/.cache', `resume_bundle_${templateId}.mjs`)
  fs.mkdirSync(path.dirname(tmpFile), { recursive: true })
  fs.writeFileSync(tmpFile, code)
  // Force fresh import per template so module identity isn't reused
  const fileUrl = pathToFileURL(tmpFile).href + '?v=' + Date.now()
  const mod = await import(fileUrl)
  return mod.render(resumeData)
}

// Build a self-contained HTML doc that wraps the SSR'd template HTML in a
// printable page, then load it in puppeteer and export as PDF using
// the same ATS-safe export used in the production app.
function wrapHtmlForPdf(templateHtml) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Georgia&family=Iowan+Old+Style:wght@400;700&family=SF+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; padding: 0; background: #ffffff; }
  body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
  .resume-export-root {
    /* Make sure the template width matches A4 for proper PDF sizing. */
    width: 210mm !important;
    min-height: 297mm !important;
    margin: 0 !important;
    box-shadow: none !important;
    background: #ffffff !important;
  }
</style>
</head>
<body>
${templateHtml}
</body>
</html>`
}

async function exportTemplate(page, templateId, resumeData, outPath) {
  const tplHtml = await renderHtmlFor(templateId, resumeData)
  const fullHtml = wrapHtmlForPdf(tplHtml)

  // Use page.setContent with a base URL pointing to the vite dev server so
  // that relative URLs (fonts) still resolve. This avoids vite's SPA
  // fallback (_redirects) that would otherwise hijack the navigation and
  // return the index.html for unknown paths.
  await page.setContent(fullHtml, { waitUntil: 'load', timeout: 30000 })
  // Wait for fonts to load before measuring
  await page.evaluate(() => document.fonts && document.fonts.ready)
  await new Promise(r => setTimeout(r, 600))

  const root = await page.$('.resume-export-root')
  if (!root) {
    const hasRootCheck = await page.evaluate(() => !!document.querySelector('.resume-export-root'))
    const bodySample = await page.evaluate(() => document.body && document.body.innerHTML.slice(0, 300))
    throw new Error(`.resume-export-root not found in rendered HTML (DOM check=${hasRootCheck}, body=${(bodySample || '').slice(0, 100)})`)
  }

  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
    preferCSSPageSize: false,
  })
}

async function main() {
  const args = process.argv.slice(2)
  const onlyArg = args.find(a => a.startsWith('--only='))
  const only = onlyArg ? onlyArg.replace('--only=', '').split(',') : null

  const templates = listTemplates()
  const queue = only ? templates.filter(t => only.includes(t)) : templates
  console.log(`Exporting ${queue.length} templates…`)

  const resumeData = JSON.parse(fs.readFileSync(RESUME_DATA_JSON, 'utf-8'))

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 900, height: 1280, deviceScaleFactor: 1 })
  page.setDefaultTimeout(30000)
  page.setDefaultNavigationTimeout(30000)

  let success = 0
  let failed = 0
  const failures = []

  for (const t of queue) {
    const outPath = path.join(OUTPUT_DIR, `${t}.pdf`)
    process.stdout.write(`  ${t} … `)
    try {
      await exportTemplate(page, t, resumeData, outPath)
      const sz = fs.statSync(outPath).size
      process.stdout.write(`ok (${(sz / 1024).toFixed(1)}KB)\n`)
      success += 1
    } catch (err) {
      process.stdout.write(`FAIL: ${err.message}\n`)
      failed += 1
      failures.push({ template: t, error: err.message })
    }
  }

  await browser.close()
  console.log(`\nDone. Success: ${success}, Failed: ${failed}.`)
  if (failures.length) {
    console.log('Failures:')
    failures.forEach(f => console.log(`  - ${f.template}: ${f.error}`))
  }
}

main().catch(err => { console.error(err); process.exit(1) })
