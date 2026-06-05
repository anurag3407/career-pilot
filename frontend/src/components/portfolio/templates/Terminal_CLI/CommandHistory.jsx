import React from "react";
import {
  Terminal,
  GitBranch,
  CheckCircle,
  FolderGit2,
  Rocket,
} from "lucide-react";

export default function CommandHistory() {
  const commands = [
    {
      icon: <FolderGit2 size={16} />,
      command: "git clone career-pilot",
      output: "Repository cloned successfully.",
      status: "success",
    },
    {
      icon: <GitBranch size={16} />,
      command: "git checkout -b feature/command-history",
      output: "Switched to a new branch.",
      status: "success",
    },
    {
      icon: <Terminal size={16} />,
      command: "npm install",
      output: "Dependencies installed successfully.",
      status: "success",
    },
    {
      icon: <Rocket size={16} />,
      command: "npm run dev",
      output: "Development server running on localhost:5173",
      status: "running",
    },
  ];

  return (
    <section className="w-full px-4 py-10 md:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-green-500/30 bg-black shadow-[0_0_30px_rgba(34,197,94,0.15)]">
        
        {/* Terminal Header */}
        <div className="flex items-center gap-2 border-b border-green-500/20 bg-zinc-900 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
          <span className="h-3 w-3 rounded-full bg-green-500"></span>

          <div className="ml-4 flex items-center gap-2 text-sm text-green-400">
            <Terminal size={16} />
            <span>Command History</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="space-y-5 p-5 font-mono text-sm md:text-base">
          {commands.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border border-green-500/10 bg-zinc-950 p-4 transition-all duration-300 hover:border-green-500/40 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)]"
            >
              <div className="flex items-center gap-2 text-green-400">
                <span>$</span>
                {item.icon}
                <span>{item.command}</span>
              </div>

              <div className="mt-2 flex items-center gap-2 pl-6 text-zinc-300">
                {item.status === "success" ? (
                  <CheckCircle size={14} className="text-green-500" />
                ) : (
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
                )}
                <span>{item.output}</span>
              </div>
            </div>
          ))}

          {/* Current Command */}
          <div className="flex items-center gap-2 text-green-400">
            <span>$</span>
            <span className="animate-pulse">█</span>
          </div>
        </div>
      </div>
    </section>
  );
}