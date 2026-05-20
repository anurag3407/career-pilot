import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { generateRepoReport } from '../services/github/reportGenerator.js';

const router = express.Router();

/**
 * Allowed characters for a GitHub owner/repo name.
 * GitHub allows alphanumerics, hyphens, underscores, and dots.
 * This pattern deliberately rejects slashes and other path-traversal chars.
 */
const GITHUB_NAME_RE = /^[a-zA-Z0-9._-]{1,100}$/;

/**
 * GET /api/github/repos/:owner/:repo/report
 *
 * Generate and download a PDF analysis report for a GitHub repository.
 *
 * Authentication:
 *   - Requires a valid CareerPilot session token in the Authorization header
 *     (Bearer <firebase-id-token>) — enforced by verifyToken middleware.
 *   - Requires a GitHub personal access token passed in the X-GitHub-Token
 *     request header. The GitHub API is called with this token, so access is
 *     automatically scoped to what the user can actually read. If the user
 *     cannot access the repository, GitHub returns 404/403 which is forwarded
 *     to the client — no server-side master token is used.
 *
 * Params:
 *   owner {string} - GitHub username or organisation name
 *   repo  {string} - Repository name
 *
 * Headers:
 *   Authorization   : Bearer <firebase-id-token>   (required)
 *   X-GitHub-Token  : <github-personal-access-token> (required)
 *
 * Response:
 *   200 application/pdf  - Downloadable PDF file
 *   400                  - Missing / invalid parameters or headers
 *   403                  - GitHub token lacks access to the repository
 *   404                  - Repository not found
 *   500                  - PDF generation failed
 */
router.get(
  '/repos/:owner/:repo/report',
  verifyToken,
  asyncHandler(async (req, res) => {
    const { owner, repo } = req.params;

    // ── Validate path parameters ──────────────────────────────────────────
    if (!GITHUB_NAME_RE.test(owner)) {
      throw new ApiError(
        400,
        'Invalid owner name. Only alphanumerics, hyphens, underscores, and dots are allowed.'
      );
    }

    if (!GITHUB_NAME_RE.test(repo)) {
      throw new ApiError(
        400,
        'Invalid repository name. Only alphanumerics, hyphens, underscores, and dots are allowed.'
      );
    }

    // ── Validate GitHub token header ──────────────────────────────────────
    const githubToken = req.headers['x-github-token'];

    if (!githubToken || typeof githubToken !== 'string' || !githubToken.trim()) {
      throw new ApiError(
        400,
        'GitHub personal access token is required. Pass it in the X-GitHub-Token request header.'
      );
    }

    // ── Generate PDF ──────────────────────────────────────────────────────
    let pdfBuffer;
    try {
      pdfBuffer = await generateRepoReport(owner, repo, githubToken.trim());
    } catch (err) {
      // Rethrow well-known GitHub API errors with appropriate HTTP codes
      if (err.statusCode === 404) {
        throw new ApiError(
          404,
          `Repository "${owner}/${repo}" was not found or is not accessible with the provided GitHub token.`
        );
      }

      if (err.statusCode === 403) {
        throw new ApiError(
          403,
          `Access denied. Your GitHub token does not have permission to read "${owner}/${repo}".`
        );
      }

      // 502 from GitHub API or any unexpected error
      console.error(`[github/report] PDF generation failed for ${owner}/${repo}:`, err);
      throw new ApiError(
        500,
        'Failed to generate the repository report. Please try again.'
      );
    }

    // ── Stream PDF to client ──────────────────────────────────────────────
    const safeOwner = owner.replace(/[^a-zA-Z0-9._-]/g, '_');
    const safeRepo = repo.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${safeOwner}_${safeRepo}_report.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-store'); // reports contain live data
    res.send(pdfBuffer);
  })
);

export default router;
