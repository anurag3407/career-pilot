import { useState } from 'react'
import toast from 'react-hot-toast'
import { Zap, Copy, RefreshCw, Wand2 } from 'lucide-react'

const SAMPLE_HEADLINES = [
  'Frontend Developer | React & Tailwind Enthusiast',
  'Building modern web experiences with React',
  'Full Stack Developer | MERN Stack | Open Source',
  'Turning ideas into scalable digital products',
  'Software Engineer passionate about clean UI/UX',
]

export default function LinkedInHeadlineGenerator() {
  const [headlines, setHeadlines] = useState(SAMPLE_HEADLINES)

  const regenerateHeadlines = () => {
    setHeadlines([
      'Creative Developer crafting modern interfaces',
      'Open Source Contributor | JavaScript Developer',
      'React Developer focused on performance & UX',
      'Frontend Engineer building responsive products',
      'Web Developer | UI Designer | Problem Solver',
    ])
  }

  const copyHeadline = async (headline) => {
    await navigator.clipboard.writeText(headline)
    toast.success('Headline copied!')
  }

  return (
    <div className="p-6 rounded-xl bg-gray-900 text-white space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="text-amber-400" />
          LinkedIn Headline Generator
        </h2>

        <button
          onClick={regenerateHeadlines}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-500/20 transition-colors text-sm font-medium"
        >
          <RefreshCw size={16} />
          Regenerate
        </button>
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all font-medium text-lg">
        <Wand2 size={20} />
        Generate Headlines
      </button>

      <div className="grid gap-4">
        {headlines.map((headline, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-gray-700 bg-gray-800"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-200">
                  {headline}
                </p>

                <span className="text-xs text-gray-400">
                  {headline.length} characters
                </span>
              </div>

              <button
                onClick={() => copyHeadline(headline)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-600 text-sm font-medium transition-colors border border-gray-600 shrink-0"
              >
                <Copy size={14} />
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}