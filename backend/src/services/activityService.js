import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execFileAsync = promisify(execFile);

// Resolve the backend root regardless of where the Node process is started.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKEND_ROOT = path.resolve(__dirname, '..', '..');
const ANALYZER_PATH = path.join('activity', 'analyzer.py');

const DEFAULT_TIMEOUT_MS = 90_000;
const MAX_BUFFER = 16 * 1024 * 1024; // 16 MB; analyzer can return ~1 year of data

// `runner` is the seam tests use to swap out child_process. Production
// code uses the default, which shells out to `python3` via promisify(execFile).
let runner = (cmd, args, opts) => execFileAsync(cmd, args, opts);

/** Test-only injection point. Pass a function (cmd, args, opts) => Promise. */
export const _setRunner = (fn) => { runner = fn; };

/**
 * Spawn the Python activity analyzer for a locally-cloned repository.
 *
 * The Python script owns the multi-provider AI factory and prints a single
 * JSON object to stdout; this wrapper just shells out and parses.
 *
 * @param {string} repoPath Absolute path to the cloned repo on disk.
 * @param {Object} [opts]
 * @param {string} [opts.provider]   AI provider (gemini|openai|groq|openrouter).
 *                                    Mirrors `X-AI-Provider` header.
 * @param {string} [opts.apiKey]     AI key. Mirrors `X-AI-Key` header.
 * @param {string} [opts.model]      Optional model override. Mirrors `X-AI-Model`.
 * @param {number} [opts.weeks=52]   How many weeks of history to aggregate.
 * @param {boolean} [opts.detail=false] Run the longer structured insight too.
 * @param {number} [opts.timeoutMs]  Override the default 90s timeout.
 * @returns {Promise<Object>} Parsed payload from the Python script.
 */
export const runActivityAnalyzer = async (repoPath, opts = {}) => {
  const {
    provider,
    apiKey,
    model,
    weeks = 52,
    detail = false,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = opts;

  const args = [ANALYZER_PATH, repoPath, '--weeks', String(weeks)];
  if (provider) args.push('--provider', provider);
  if (apiKey) args.push('--api-key', apiKey);
  if (model) args.push('--model', model);
  if (detail) args.push('--detailed');

  const runnerOpts = {
    cwd: BACKEND_ROOT,
    timeout: timeoutMs,
    maxBuffer: MAX_BUFFER,
  };

  let stdout;
  let stderr;
  try {
    ({ stdout, stderr } = await runner('python3', args, runnerOpts));
  } catch (err) {
    const detail = err.stderr?.toString() || err.stdout?.toString() || err.message;
    const wrapped = new Error(`Activity analyzer failed: ${detail}`);
    wrapped.code = err.code;
    wrapped.killed = err.killed;
    throw wrapped;
  }

  let payload;
  try {
    payload = JSON.parse(stdout);
  } catch (parseErr) {
    throw new Error(
      `Activity analyzer returned non-JSON output. ` +
      `stderr=${(stderr || '').toString().slice(0, 500)}`
    );
  }

  if (payload && payload.error) {
    const err = new Error(payload.error);
    err.code = 'ANALYZER_ERROR';
    throw err;
  }

  return payload;
};

export default runActivityAnalyzer;
