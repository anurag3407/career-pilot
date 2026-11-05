import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const backendDir = path.resolve(__dirname, '..')

const getFiles = (dirName) => {
  const fullDir = path.join(backendDir, dirName)
  if (!fs.existsSync(fullDir)) return []
  return fs.readdirSync(fullDir, { recursive: true })
    .filter((f) => f.endsWith('.test.js'))
    .map((f) => path.relative(process.cwd(), path.join(fullDir, f)))
}

const testFiles = [...getFiles('src'), ...getFiles('tests')]

if (testFiles.length === 0) {
  console.log('No test files found.')
  process.exit(0)
}

const result = spawnSync(process.execPath, ['--test', ...testFiles], {
  stdio: 'inherit',
  env: process.env,
})

process.exit(result.status ?? 1)
