import { ScanLine } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const RepoCard = ({ owner, repo, name, description, language, stars, forks, isPrivate }) => {
  const navigate = useNavigate()
  const [isScanning, setIsScanning] = useState(false)

  if (!owner || !repo) {
    console.error('RepoCard: owner and repo props are required')
    return null
  }

  const handleAnalyze = () => {
    setIsScanning(true)
    navigate(`/github/${owner}/${repo}`)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-3 transition-colors duration-300">

      {/* Repo Name */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground truncate w-3/4">
          {name}
        </h3>
        <span className="text-xs text-muted-foreground">
          {isPrivate ? 'Private' : 'Public'}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2">
        {description || 'No description provided'}
      </p>

      {/* Stats Row */}
      <div className="flex gap-3 mt-auto text-xs text-muted-foreground">
        {language && (
          <span className="rounded-full bg-muted text-foreground px-2 py-1">
            {language}
          </span>
        )}
        {stars !== undefined && <span>⭐ {stars}</span>}
        {forks !== undefined && <span>🍴 {forks}</span>}
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={isScanning}
        aria-busy={isScanning}
        aria-label={isScanning ? 'Scanning repository' : 'Analyze repository'}
        className="mt-2 flex items-center gap-2 px-3 py-1.5 text-sm 
        bg-muted hover:bg-accent text-foreground 
        rounded-lg transition-colors w-fit disabled:opacity-50"
      >
        {isScanning ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 
            border-gray-500 border-t-transparent rounded-full" />
            Scanning...
          </>
        ) : (
          <>
            <ScanLine size={14} />
            Analyze
          </>
        )}
      </button>

    </div>
  )
}

export default RepoCard