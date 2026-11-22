import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Search, ThumbsUp, Code2 } from 'lucide-react'

const SAMPLE_PROJECTS = []

function ProjectCard({ project, onUpvote }) {
    const [upvoted, setUpvoted] = useState(false)

    const handleUpvote = () => {
        if (!upvoted) {
            setUpvoted(true)
            onUpvote(project._id)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-background border border-border rounded-2xl p-5 flex flex-col gap-4"
        >
            <div className="w-full h-40 bg-muted rounded-xl flex items-center justify-center overflow-hidden">
                {project.screenshot ? (
                    <img
                        src={project.screenshot}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Code2 className="w-10 h-10 text-muted-foreground" />
                )}
            </div>

            <div>
                <h3 className="text-lg font-semibold text-foreground">
                    {project.title}
                </h3>

                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {project.description}
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                    <span
                        key={tech}
                        className="text-xs px-2 py-1 bg-muted rounded-lg text-muted-foreground"
                    >
                        {tech}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3">
                    <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${project.title} GitHub repository`}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Github className="w-4 h-4" />
                    </a>

                    <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${project.title} live demo`}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>

                <button
                    onClick={handleUpvote}
                    aria-label={
                        upvoted
                            ? `Upvoted ${project.title}`
                            : `Upvote ${project.title}`
                    }
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                        upvoted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <ThumbsUp className="w-3 h-3" />
                    {project.upvotes}
                </button>
            </div>

            <p className="text-xs text-muted-foreground">
                by {project.authorName}
            </p>
        </motion.div>
    )
}

export default function ProjectShowcase() {
    const [projects, setProjects] = useState(SAMPLE_PROJECTS)
    const [searchQuery, setSearchQuery] = useState('')

    const handleUpvote = (id) => {
    setProjects((prev) =>
        prev.map((p) =>
            p._id === id
                ? { ...p, upvotes: p.upvotes + 1 }
                : p
        )
    )
}

    const filtered = projects.filter(
        (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.techStack.some((t) =>
                t.toLowerCase().includes(searchQuery.toLowerCase())
            )
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    Project Showcase
                </h1>

                <p className="text-muted-foreground">
                    Explore completed fellowship projects from our community
                </p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <input
                    type="text"
                    placeholder="Search by project name or tech stack..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
                />
            </div>

            {filtered.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((project) => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                            onUpvote={handleUpvote}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
                    <Code2 className="h-12 w-12 text-muted-foreground/80" />

                    <h3 className="mt-4 text-lg font-semibold text-foreground">
                        No projects found
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Try a different search term
                    </p>
                </div>
            )}
        </div>
    )
}