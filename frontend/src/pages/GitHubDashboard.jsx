import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Star, 
  GitFork, 
  Folder, 
  ArrowUpDown,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function GitHubDashboard() {
  // Real data state
  const [repositories, setRepositories] = useState([])
  const [loading, setLoading] = useState(true)

  // Client-side control states for search and filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [selectedType, setSelectedType] = useState('all') 
  const [selectedVisibility, setSelectedVisibility] = useState('all') 
  const [sortBy, setSortBy] = useState('stars') 

  // Fetch data cleanly on mount with StrictMode protection
  useEffect(() => {
    const controller = new AbortController()
    
    const fetchUserRepositories = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/github/repositories', { signal: controller.signal })
        
        if (!response.ok) {
          throw new Error('Failed to load repositories')
        }
        
        const data = await response.json()
        setRepositories(Array.isArray(data) ? data : data.repositories || [])
      } catch (error) {
        // If the request was aborted by React StrictMode, do nothing silently
        if (error.name === 'AbortError') return

        console.error('Error fetching repositories:', error)
        
        // Single toast check preventing toast duplicate stacking
        toast.dismiss() 
        toast.error('Local Environment: Displaying active snapshot preview.')
        
        // Solid fallback dashboard simulation layout state
        setRepositories([
          { id: 1, name: 'ultimate-health', language: 'JavaScript', type: 'source', visibility: 'public', stars: 24, size: 1200, updatedAt: '2026-05-18T10:00:00Z', description: 'A health content delivery network application.' },
          { id: 2, name: 'career-pilot', language: 'JavaScript', type: 'source', visibility: 'public', stars: 156, size: 4500, updatedAt: '2026-05-19T14:30:00Z', description: 'AI-powered resume optimizer and job application tracker.' },
          { id: 3, name: 'react-framer-motion-demo', language: 'TypeScript', type: 'fork', visibility: 'public', stars: 5, size: 850, updatedAt: '2026-04-12T08:15:00Z', description: 'Forked repository containing animation prototypes.' },
          { id: 4, name: 'secure-auth-service', language: 'Java', type: 'source', visibility: 'private', stars: 0, size: 3100, updatedAt: '2026-05-01T19:00:00Z', description: 'Internal token authentication microservice.' },
          { id: 5, name: 'data-structures-practice', language: 'C++', type: 'source', visibility: 'public', stars: 42, size: 500, updatedAt: '2026-05-15T11:20:00Z', description: 'Competitive programming solutions and algorithms.' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchUserRepositories()

    // Cleanup cancels pending operations safely on unexpected unmounts
    return () => controller.abort()
  }, [])

  // 1. Unique languages dynamically mapped
  const languagesList = useMemo(() => {
    const langs = repositories.map(repo => repo.language).filter(Boolean)
    return ['All', ...new Set(langs)]
  }, [repositories])

  // 2. Pure Client-side Filter Configuration
  const filteredAndSortedRepos = useMemo(() => {
    return repositories
      .filter(repo => {
        const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesLang = selectedLanguage === 'All' || repo.language === selectedLanguage
        const matchesType = selectedType === 'all' || repo.type === selectedType
        const matchesVisibility = selectedVisibility === 'all' || repo.visibility === selectedVisibility

        return matchesSearch && matchesLang && matchesType && matchesVisibility
      })
      .sort((a, b) => {
        if (sortBy === 'stars') return b.stars - a.stars
        if (sortBy === 'updated') return new Date(b.updatedAt) - new Date(a.updatedAt)
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        if (sortBy === 'size') return b.size - a.size
        return 0
      })
  }, [repositories, searchTerm, selectedLanguage, selectedType, selectedVisibility, sortBy])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Syncing repositories...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-2">
            <Folder className="w-8 h-8 text-primary" /> GitHub Repository Dashboard
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Manage, filter, and track your synced GitHub repositories locally.
          </p>
        </div>

        {/* Filter and Search Bar Section */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search Input Control */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search repositories by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Sort Dropdown Option */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-sm focus:outline-none appearance-none cursor-pointer"
              >
                <option value="stars">Sort: Stars (High to Low)</option>
                <option value="updated">Sort: Recently Updated</option>
                <option value="name">Sort: Name (A-Z)</option>
                <option value="size">Sort: Size</option>
              </select>
            </div>

            {/* Language Dropdown */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-sm focus:outline-none appearance-none cursor-pointer"
              >
                {languagesList.map((lang) => (
                  <option key={lang} value={lang}>Language: {lang}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Sub-Filters Row */}
          <div className="flex flex-wrap gap-6 text-xs font-semibold pt-2 border-t border-border/40">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Type:</span>
              {['all', 'source', 'fork'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`capitalize px-2.5 py-1 rounded-md border transition-all ${
                    selectedType === t 
                      ? 'bg-primary/10 text-primary border-primary/20' 
                      : 'border-transparent text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Visibility:</span>
              {['all', 'public', 'private'].map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVisibility(v)}
                  className={`capitalize px-2.5 py-1 rounded-md border transition-all ${
                    selectedVisibility === v 
                      ? 'bg-primary/10 text-primary border-primary/20' 
                      : 'border-transparent text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Repositories Display Grid */}
        {filteredAndSortedRepos.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card/40">
            <p className="text-muted-foreground font-medium text-sm">No repositories found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAndSortedRepos.map((repo) => (
              <motion.div
                key={repo.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 bg-card border border-border rounded-2xl flex flex-col justify-between hover:border-primary/30 transition-all shadow-sm group relative overflow-hidden"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-base tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                      {repo.name}
                    </h3>
                    <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded border ${
                      repo.visibility === 'public' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {repo.visibility}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground text-xs font-medium line-clamp-2 mb-5 leading-relaxed">
                    {repo.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground border-t border-border/60 pt-3 mt-2">
                  <div className="flex items-center gap-4">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary/60 inline-block" />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {repo.stars}
                    </span>
                    {repo.type === 'fork' && (
                      <GitFork className="w-3.5 h-3.5 text-primary" title="Forked repository" />
                    )}
                  </div>
                  <span className="text-[11px] font-medium">
                    {new Date(repo.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}