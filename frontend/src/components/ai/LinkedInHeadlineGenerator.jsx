import { useState } from 'react'
import toast from 'react-hot-toast'

const SAMPLE_HEADLINES = [
  'Frontend Developer | React & Tailwind Enthusiast',
  'Building modern web experiences with React ⚡',
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
        <h2 className="text-2xl font-bold">
          LinkedIn Headline Generator
        </h2>

        <button type="button"
          onClick={regenerateHeadlines}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
        >
          Regenerate
        </button>
      </div>

      <button type="button" className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-medium">
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

              <button type="button"
                onClick={() => copyHeadline(headline)}
                className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}