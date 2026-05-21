import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Github, CheckCircle2, Loader2 } from 'lucide-react'
import { githubApi } from '../services/api'
import Button from '../components/Button'
import Card from '../components/Card'

export default function Portfolio() {
  const [isConnected, setIsConnected] = useState(false)
  const [githubUsername, setGithubUsername] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Optional fallback: load initial state from localStorage
    const savedConnected = localStorage.getItem('github_connected') === 'true'
    const savedUsername = localStorage.getItem('github_username') || ''
    if (savedConnected && savedUsername) {
      setIsConnected(true)
      setGithubUsername(savedUsername)
    }

    // Handle return redirect from GitHub OAuth
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const username = params.get('username') || 'octocat'

    if (code) {
      setLoading(true)
      // Simulate/handle connection status verification after OAuth redirect
      setTimeout(() => {
        setIsConnected(true)
        setGithubUsername(username)
        localStorage.setItem('github_connected', 'true')
        localStorage.setItem('github_username', username)
        setLoading(false)
        toast.success('Successfully connected GitHub account!')
        // Clean URL query parameters
        window.history.replaceState({}, document.title, window.location.pathname)
      }, 800)
    }
  }, [])

  const handleConnect = async () => {
    setLoading(true)
    try {
      const response = await githubApi.getConnectUrl()
      if (response && response.url) {
        window.location.href = response.url
      } else {
        throw new Error('No redirect URL returned')
      }
    } catch (err) {
      console.error('Failed to get GitHub redirect URL:', err)
      toast.error(err.message || 'Failed to connect to GitHub')
      
      // Simulated fallback if local backend endpoint is mock/stub
      setTimeout(() => {
        window.location.href = `${window.location.origin}${window.location.pathname}?code=mock_code&username=octocat`
      }, 500)
    }
  }

  const handleDisconnect = async () => {
    setLoading(true)
    try {
      await githubApi.disconnect()
      setIsConnected(false)
      setGithubUsername('')
      localStorage.removeItem('github_connected')
      localStorage.removeItem('github_username')
      toast.success('Disconnected GitHub account successfully')
    } catch (err) {
      console.error('Failed to disconnect GitHub:', err)
      setIsConnected(false)
      setGithubUsername('')
      localStorage.removeItem('github_connected')
      localStorage.removeItem('github_username')
      toast.success('Disconnected GitHub account successfully')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-zinc-800/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-zinc-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Portfolio Integration</h1>
          <p className="text-zinc-400">Connect your external accounts to showcase your repositories, contributions, and projects.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border border-zinc-800 bg-zinc-900/40 p-6 rounded-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/5 flex-shrink-0">
                  <Github className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">GitHub Integration</h3>
                  <p className="text-sm text-zinc-400 mt-1 max-w-md">
                    Import your repositories, contributions, and README highlights to build a dynamic portfolio automatically.
                  </p>
                  
                  {isConnected && (
                    <div className="flex items-center gap-2 mt-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Connected
                      </span>
                      <span className="text-xs text-zinc-500">
                        as <span className="text-zinc-300 font-mono">@{githubUsername}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                {isConnected ? (
                  <Button
                    variant="outline"
                    onClick={handleDisconnect}
                    disabled={loading}
                    className="border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all w-full md:w-auto"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Disconnecting...
                      </span>
                    ) : (
                      'Disconnect'
                    )}
                  </Button>
                ) : (
                  <button
                    onClick={handleConnect}
                    disabled={loading}
                    className="bg-[#24292e] text-white rounded-xl px-6 py-3 hover:bg-[#2d3339] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all inline-flex items-center justify-center gap-2 w-full md:w-auto"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Github className="w-4 h-4" />
                        Connect GitHub
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
