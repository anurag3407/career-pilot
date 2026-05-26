import { Star, GitFork, ScanLine } from "lucide-react";
import { useNavigate } from "react-router-dom";

const languageColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

const RepoCard = ({ repo }) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        group
        bg-white dark:bg-gray-800
        rounded-xl
        p-5
        shadow-sm
        border border-gray-200 dark:border-gray-700
        hover:border-cyan-400
        hover:shadow-lg
        hover:scale-[1.02]
        transition-all duration-300
        flex flex-col gap-3
      "
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {repo.name}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
        {repo.description || "No description available."}
      </p>

      <div className="flex items-center gap-4 text-sm mt-2 text-gray-500 dark:text-gray-400">
        
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor:
                languageColors[repo.language] || "#8b949e",
            }}
          />
          <span>{repo.language}</span>
        </div>

        <div className="flex items-center gap-1">
          <Star size={14} />
          <span>{repo.stargazers_count}</span>
        </div>

        <div className="flex items-center gap-1">
          <GitFork size={14} />
          <span>{repo.forks_count}</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-1">
        Updated {new Date(repo.updated_at).toLocaleDateString()}
      </p>

      <button
        onClick={() => console.log("Analyze clicked")}
        className="
          mt-auto
          flex items-center justify-center gap-2
          bg-cyan-500 hover:bg-cyan-400
          text-black font-medium
          py-2 px-4
          rounded-lg
          transition
        "
      >
        <ScanLine size={16} />
        Analyze
      </button>
    </div>
  );
};

export default RepoCard;