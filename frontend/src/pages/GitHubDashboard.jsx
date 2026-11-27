import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Github,
  Search,
  MapPin,
  Building,
  Link as LinkIcon,
  Star,
  GitFork,
  ArrowRight,
  Loader2,
  FileText,
  Globe,
  BookMarked,
  Network,
  Key,
  ExternalLink,
  Clock,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import {
  resumeApi,
  userProfileApi,
  githubPortfolioApi,
  projectVisualizerApi,
} from '../services/api'
import { getGithubUsername } from '../utils/github'
import { useGithubConfigStore } from '../stores/useGithubConfigStore'
import { useProjectVisualizerStore } from '../stores/useProjectVisualizerStore'

const SUITE_TOOLS = [
  {
    id: 'resume',
    label: 'GitHub to Resume',
    desc: 'Import repositories and languages into a structured resume.',
    icon: FileText,
    type: 'inline',
  },
  {
    id: 'portfolio',
    label: 'GitHub Portfolio',
    desc: 'Curate top repositories and generate portfolio sections.',
    icon: Globe,
    to: '/github-portfolio/build',
  },
  {
    id: 'readme',
    label: 'README Generator',
    desc: 'Create a custom GitHub profile README from 10 templates.',
    icon: BookMarked,
    to: '/readme-generator/generate',
  },
  {
    id: 'visualizer',
    label: 'Repo Visualizer',
    desc: 'Generate architecture maps and dependency Q&A for any repo.',
    icon: Network,
    to: '/project-visualizer/analyze',
  },
]

export default function GitHubDashboard() {
  const navigate = useNavigate()
  const oauthConnected = useGithubConfigStore((s) => s.oauthConnected)
  const oauthLogin = useGithubConfigStore((s) => s.oauthLogin)
  const { setStatus, setAnalysisData, setRepoUrl } = useProjectVisualizerStore()

  const [username, setUsername] = useState('')
  const [connectedUsername, setConnectedUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [profile, setProfile] = useState(null)

  const [portfolioHistory, setPortfolioHistory] = useState([])
  const [visualizerHistory, setVisualizerHistory] = useState([])
  const [repoUrlInput, setRepoUrlInput] = useState('')
  const [analyzingRepo, setAnalyzingRepo] = useState(false)

  useEffect(() => {
    userProfileApi
      .getMyProfile()
      .then((res) => {
        const gh = getGithubUsername(res?.profile?.github || res?.data?.github || res?.github)
        if (gh) {
          setConnectedUsername(gh)
          setUsername((prev) => prev || gh)
        }
      })
      .catch(() => {})

    githubPortfolioApi
      .getHistory(4)
      .then((res) => {
        const list = res?.data || []
        setPortfolioHistory(Array.isArray(list) ? list : [])
      })
      .catch(() => {})

    projectVisualizerApi
      .getHistory()
      .then((res) => {
        if (Array.isArray(res)) setVisualizerHistory(res.slice(0, 4))
      })
      .catch(() => {})
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!username.trim()) return

    try {
      setIsLoading(true)
      setProfile(null)
      const response = await resumeApi.previewGitHub(username.trim())
      setProfile(response.preview)
    } catch (error) {
      toast.error(error.message || 'Failed to fetch GitHub profile. Verify the username and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = async () => {
    if (!profile) return

    try {
      setIsImporting(true)
      const response = await resumeApi.importGitHub(username.trim(), profile)
      toast.success('GitHub profile imported as resume')
      navigate(`/resume/${response.data._id || response.data.id}`)
    } catch (error) {
      toast.error(error.message || 'Failed to import GitHub profile')
    } finally {
      setIsImporting(false)
    }
  }

  const handleQuickVisualize = async (e) => {
    e.preventDefault()
    const targetUrl = repoUrlInput.trim()
    if (!targetUrl || !targetUrl.includes('github.com')) {
      toast.error('Enter a valid GitHub repository URL (https://github.com/owner/repo)')
      return
    }
    try {
      setAnalyzingRepo(true)
      setStatus('analyzing')
      setRepoUrl(targetUrl)
      toast.loading('Analyzing repository architecture...', { id: 'gh-suite-viz' })
      const result = await projectVisualizerApi.analyze(targetUrl)
      setAnalysisData(result)
      toast.success('Architecture map ready', { id: 'gh-suite-viz' })
      navigate(`/project-visualizer/dashboard/${result.sessionId}`)
    } catch (err) {
      setStatus('error')
      toast.error(err.message || 'Repository analysis failed', { id: 'gh-suite-viz' })
    } finally {
      setAnalyzingRepo(false)
    }
  }

  return (
    <div className="cp-flight min-h-full bg-background text-foreground antialiased">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/85">
              04 Presence &amp; Network
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-foreground">
              GitHub Suite
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
              Turn your repositories into resumes, developer portfolios, profile READMEs, and interactive codebase architecture maps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
              <Github className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {oauthConnected && oauthLogin
                ? `OAuth: @${oauthLogin}`
                : connectedUsername
                  ? `Profile: @${connectedUsername}`
                  : 'Public GitHub mode'}
            </span>
            <Link
              to="/settings"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Key className="h-3.5 w-3.5" aria-hidden="true" />
              GitHub token
            </Link>
          </div>
        </header>

        {/* Suite Tools Directory */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SUITE_TOOLS.map((tool) => {
            const cardInner = (
              <div className="group flex h-full flex-col justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-background">
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground group-hover:border-primary/30 group-hover:text-primary">
                    <tool.icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </div>
                  <h2 className="text-[15px] font-semibold text-foreground group-hover:text-primary">
                    {tool.label}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {tool.desc}
                  </p>
                </div>
                <p className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  {tool.type === 'inline' ? 'Active below' : 'Open tool'}
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </p>
              </div>
            )

            if (tool.type === 'inline') {
              return (
                <a key={tool.id} href="#github-to-resume" className="block h-full">
                  {cardInner}
                </a>
              )
            }

            return (
              <Link key={tool.id} to={tool.to} className="block h-full">
                {cardInner}
              </Link>
            )
          })}
        </section>

        {/* Main Workspace Split: GitHub-to-Resume + Quick Repo Visualizer */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">

          {/* Left: GitHub to Resume */}
          <section id="github-to-resume" className="rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                  Resume generator
                </p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  GitHub to Resume
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Fetch any public GitHub profile, preview top repositories, and import them as a structured resume.
                </p>
              </div>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Enter GitHub username (e.g. torvalds)"
                  aria-label="GitHub username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !username.trim()}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-xs font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : 'Fetch profile'}
              </button>
            </form>

            <AnimatePresence mode="wait">
              {profile && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 overflow-hidden rounded-xl border border-border bg-background"
                >
                  <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-start">
                    <img
                      src={profile.avatar_url}
                      alt={profile.name || profile.username}
                      width={64}
                      height={64}
                      className="h-16 w-16 shrink-0 rounded-full border border-border object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{profile.name || profile.username}</h3>
                      <a
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        @{profile.username}
                      </a>
                      {profile.bio && (
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{profile.bio}</p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {profile.company && (
                          <span className="inline-flex items-center gap-1">
                            <Building className="h-3.5 w-3.5" aria-hidden="true" /> {profile.company}
                          </span>
                        )}
                        {profile.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {profile.location}
                          </span>
                        )}
                        {profile.blog && (
                          <a
                            href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-primary"
                          >
                            <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" /> Website
                          </a>
                        )}
                        <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-foreground">
                          {profile.followers} followers
                        </span>
                        <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-foreground">
                          {profile.public_repos} repos
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 p-5">
                    {profile.topLanguages?.length > 0 && (
                      <div>
                        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          Top technologies
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.topLanguages.map((lang) => (
                            <span
                              key={lang}
                              className="rounded-md border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.topRepositories?.length > 0 && (
                      <div>
                        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          Top repositories
                        </p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {profile.topRepositories.slice(0, 4).map((repo) => (
                            <a
                              key={repo.name}
                              href={repo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group block rounded-lg border border-border bg-card p-3.5 transition-colors hover:border-primary/40"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                                  {repo.name}
                                </h4>
                                <span className="inline-flex shrink-0 items-center gap-1 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                                  <Star className="h-3 w-3" aria-hidden="true" /> {repo.stars}
                                </span>
                              </div>
                              {repo.description && (
                                <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                                  {repo.description}
                                </p>
                              )}
                              {repo.language && (
                                <p className="mt-2 font-mono text-[10px] text-primary">{repo.language}</p>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end border-t border-border pt-4">
                      <button
                        type="button"
                        onClick={handleImport}
                        disabled={isImporting}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
                      >
                        {isImporting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Importing...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4" aria-hidden="true" /> Import as Resume{' '}
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Right: Quick Repo Visualizer & Recent Activity */}
          <div className="space-y-6">
            <section className="rounded-xl border border-border bg-card p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                Codebase intelligence
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                Analyze a repository
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Paste a public GitHub repository URL to inspect module architecture, risks, and interview questions.
              </p>

              <form onSubmit={handleQuickVisualize} className="mt-4 space-y-2.5">
                <input
                  type="url"
                  value={repoUrlInput}
                  onChange={(e) => setRepoUrlInput(e.target.value)}
                  placeholder="https://github.com/owner/repository"
                  aria-label="GitHub repository URL"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={analyzingRepo || !repoUrlInput.trim()}
                  className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background text-xs font-semibold text-foreground transition hover:border-primary/40 hover:text-primary disabled:opacity-50"
                >
                  {analyzingRepo ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Parsing repository...
                    </>
                  ) : (
                    <>
                      <Network className="h-3.5 w-3.5" aria-hidden="true" /> Generate architecture map
                    </>
                  )}
                </button>
              </form>

              {visualizerHistory.length > 0 && (
                <div className="mt-5 border-t border-border pt-4">
                  <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Recent analyses
                  </p>
                  <ul className="space-y-2">
                    {visualizerHistory.map((item) => (
                      <li key={item._id || item.sessionId}>
                        <Link
                          to={`/project-visualizer/dashboard/${item.sessionId}`}
                          className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs transition hover:border-primary/40"
                        >
                          <span className="truncate font-medium text-foreground">
                            {item.repoOwner}/{item.repoName}
                          </span>
                          <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] text-muted-foreground">
                            <GitFork className="h-3 w-3" aria-hidden="true" />
                            {item.stats?.totalFiles ?? 0} files
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Recent GitHub Portfolio Builds */}
            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-foreground">Recent GitHub Portfolios</h2>
                <Link
                  to="/hub/portfolio/github"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  View all <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
              {portfolioHistory.length === 0 ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  No GitHub portfolio builds yet. Launch the builder to curate repositories into a portfolio.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {portfolioHistory.map((b, i) => (
                    <li key={b._id || b.id || i}>
                      <Link
                        to={`/github-portfolio/build?build=${b._id || b.id}`}
                        className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs transition hover:border-primary/40"
                      >
                        <span className="truncate font-medium text-foreground">@{b.username}</span>
                        <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {b.repoCount || 0} repos
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
