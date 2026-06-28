import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
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
  FileText
} from 'lucide-react'
import { resumeApi } from '../services/api'
import { toast } from 'react-hot-toast'

export default function GitHubDashboard() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [profile, setProfile] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!username.trim()) return

    try {
      setIsLoading(true)
      setProfile(null)
      const response = await resumeApi.previewGitHub(username.trim())
      setProfile(response.preview)
    } catch (error) {
      toast.error(error.message || 'Failed to fetch GitHub profile. Make sure the username exists.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = async () => {
    if (!profile) return

    try {
      setIsImporting(true)
      const response = await resumeApi.importGitHub(username.trim(), profile)
      toast.success('GitHub profile imported as resume!')
      navigate(`/resume/${response.data._id || response.data.id}`)
    } catch (error) {
      toast.error(error.message || 'Failed to import GitHub profile')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center p-4 bg-[#24292e]/10 dark:bg-[#24292e]/50 rounded-2xl mb-6 ring-1 ring-border shadow-lg">
            <Github className="w-10 h-10 text-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 tracking-tight mb-4">
            GitHub to Resume
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Instantly convert your GitHub profile and top repositories into a professional resume.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="relative max-w-xl mx-auto mb-12"
        >
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-32 py-4 bg-card/50 backdrop-blur-xl border border-border rounded-full text-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="absolute right-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Fetch'}
            </button>
          </div>
        </motion.form>

        <AnimatePresence mode="wait">
          {profile && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              {/* Profile Header */}
              <div className="p-8 md:p-10 border-b border-white/5 flex flex-col md:flex-row items-center md:items-start gap-8">
                <img 
                  src={profile.avatar_url} 
                  alt={profile.name} 
                  className="w-32 h-32 rounded-full border-4 border-background shadow-xl"
                />
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-1">{profile.name}</h2>
                  <a href={profile.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-lg mb-4 inline-block">
                    @{profile.username}
                  </a>
                  {profile.bio && <p className="text-muted-foreground mb-4 text-base">{profile.bio}</p>}
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                    {profile.company && (
                      <span className="flex items-center gap-1.5"><Building className="w-4 h-4" /> {profile.company}</span>
                    )}
                    {profile.location && (
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.location}</span>
                    )}
                    {profile.blog && (
                      <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <LinkIcon className="w-4 h-4" /> Portfolio
                      </a>
                    )}
                    <span className="flex items-center gap-1.5 font-medium px-2.5 py-1 bg-secondary rounded-md text-secondary-foreground">
                      {profile.followers} Followers
                    </span>
                    <span className="flex items-center gap-1.5 font-medium px-2.5 py-1 bg-secondary rounded-md text-secondary-foreground">
                      {profile.public_repos} Repositories
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-10 bg-background/30 space-y-8">
                {/* Languages */}
                {profile.topLanguages?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" /> Top Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.topLanguages.map(lang => (
                        <span key={lang} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-medium">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Repositories */}
                {profile.topRepositories?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <GitFork className="w-5 h-5 text-blue-400" /> Top Repositories
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.topRepositories.map(repo => (
                        <a 
                          key={repo.name} 
                          href={repo.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">{repo.name}</h4>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                              <Star className="w-3 h-3" /> {repo.stars}
                            </span>
                          </div>
                          {repo.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
                              {repo.description}
                            </p>
                          )}
                          {repo.language && (
                            <span className="text-xs font-medium text-primary">
                              {repo.language}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-white/10 flex justify-end">
                  <button type="button"
                    onClick={handleImport}
                    disabled={isImporting}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Importing...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" /> Import as Resume <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}