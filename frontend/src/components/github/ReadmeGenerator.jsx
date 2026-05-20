import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Download, Sparkles } from "lucide-react";

const SAMPLE_README = `# Career Pilot

AI-powered career development platform helping students with:

- Resume optimization
- AI mock interviews
- Portfolio generation
- Job tracking
- GitHub analysis

## Tech Stack

- React
- Node.js
- Express
- MongoDB

## Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- AI-powered tools
- Clean UI
- Open source contributions
`;

const ReadmeGenerator = () => {
  const [markdown, setMarkdown] = useState("");

  const handleGenerate = () => {
    setMarkdown(SAMPLE_README);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      alert("Markdown copied!");
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], {
      type: "text/markdown",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "README.md";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">

      <div className="flex flex-wrap gap-3">

        <button
          type="button"
          onClick={handleGenerate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition"
        >
          <Sparkles size={18} />
          Generate
        </button>

        <button
          type="button"
          onClick={handleCopy}
          disabled={!markdown}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50"
        >
          <Copy size={18} />
          Copy Markdown
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={!markdown}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50"
        >
          <Download size={18} />
          Download README.md
        </button>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Editor */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 flex flex-col">

          <h2 className="text-lg font-semibold mb-4">
            Markdown Editor
          </h2>

          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Generate or write your README markdown here..."
            className="w-full min-h-[600px] resize-none rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent p-4 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />

        </div>

        {/* Preview */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 overflow-auto">

          <h2 className="text-lg font-semibold mb-4">
            Live Preview
          </h2>

          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>
              {markdown || "# README Preview"}
            </ReactMarkdown>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ReadmeGenerator;