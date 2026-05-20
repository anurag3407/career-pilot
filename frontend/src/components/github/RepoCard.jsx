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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm flex flex-col gap-3">

      {/* Repo Name */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate w-3/4">
          {name}
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {isPrivate ? 'Private' : 'Public'}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
        {description || 'No description provided'}
      </p>

      {/* Stats Row */}
      <div className="flex gap-3 mt-auto text-xs text-gray-500 dark:text-gray-400">
        {language && (
          <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-1">
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
        bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 
        dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 
        rounded-lg transition-colors w-fit"
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