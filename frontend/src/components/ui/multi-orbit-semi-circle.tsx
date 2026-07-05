import React, { useState, useEffect } from "react";
import { 
  Bot, 
  Sparkles, 
  BrainCircuit, 
  Cpu, 
  Github, 
  Gitlab, 
  Trello, 
  Slack, 
  Linkedin, 
  FileText, 
  Briefcase,
  MessagesSquare,
  Globe,
  Share2
} from "lucide-react";

function SemiCircleOrbit({ radius, centerX, centerY, icons, iconSize }) {
  const count = icons.length;
  return (
    <>
      <div className="absolute inset-0 flex justify-center">
        <div
          className="
            w-[1000px] h-[1000px] rounded-full 
            bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05),transparent_70%)]
            dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]
            blur-3xl 
            -mt-40 
            pointer-events-none
          "
          style={{ zIndex: 0 }}
        />
      </div>

      {icons.map((item, index) => {
        const angle = (index / (Math.max(1, count - 1))) * 180;
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);
        const IconComponent = item.icon;
        
        const tooltipAbove = angle > 90;

        return (
          <div
            key={index}
            className="absolute flex flex-col items-center group"
            style={{
              left: `${centerX + x - iconSize / 2}px`,
              top: `${centerY - y - iconSize / 2}px`,
              zIndex: 5,
            }}
          >
            <div 
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-full shadow-lg cursor-pointer transition-transform duration-300 hover:scale-125 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
              style={{ width: iconSize + 20, height: iconSize + 20 }}
            >
               <IconComponent size={iconSize} strokeWidth={1.5} />
            </div>
            
            <div
              className={`absolute ${
                tooltipAbove ? "bottom-[calc(100%+12px)]" : "top-[calc(100%+12px)]"
              } hidden group-hover:block w-32 rounded-lg bg-slate-900 px-2 py-1.5 text-xs font-medium text-white shadow-xl text-center z-50 animate-in fade-in zoom-in duration-200`}
            >
              {item.name}
              <div
                className={`absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-slate-900 ${
                  tooltipAbove ? "top-[calc(100%-5px)]" : "bottom-[calc(100%-5px)]"
                }`}
              ></div>
            </div>
          </div>
        );
      })}
      
      {/* Orbit Line */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
         <path 
           d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
           fill="none"
           stroke="currentColor"
           strokeWidth="1"
           strokeDasharray="4 4"
           className="text-slate-300 dark:text-slate-700 opacity-50"
         />
      </svg>
    </>
  );
}

function OrbitSection({ title, description, orbits }) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const baseWidth = Math.min(size.width * 0.9, 800);
  const centerX = baseWidth / 2;
  const centerY = baseWidth * 0.55;

  const iconSize =
    size.width < 480
      ? Math.max(20, baseWidth * 0.04)
      : size.width < 768
      ? Math.max(24, baseWidth * 0.045)
      : Math.max(28, baseWidth * 0.05);

  return (
    <div className="flex flex-col items-center text-center z-10 w-full mb-32 last:mb-10">
      <div className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-1 text-sm font-medium text-slate-800 dark:text-slate-200 mb-6">
        <Sparkles className="mr-2 h-4 w-4 text-primary" />
        {title}
      </div>
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">{title}</h2>
      <p className="mb-16 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
        {description}
      </p>

      <div
        className="relative flex justify-center"
        style={{ width: baseWidth, height: baseWidth * 0.55 }}
      >
        {orbits.map((orbit, idx) => {
          const radii = [0.25, 0.40, 0.55];
          return (
             <SemiCircleOrbit 
               key={idx} 
               radius={baseWidth * radii[idx % radii.length]} 
               centerX={centerX} 
               centerY={centerY} 
               icons={orbit} 
               iconSize={iconSize} 
             />
          );
        })}
        {/* Core center point */}
        <div 
          className="absolute rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center"
          style={{
            left: `${centerX - (baseWidth * 0.12) / 2}px`,
            top: `${centerY - (baseWidth * 0.12) / 2}px`,
            width: baseWidth * 0.12,
            height: baseWidth * 0.12,
            zIndex: 10
          }}
        >
          <div className="w-1/2 h-1/2 rounded-full bg-primary/20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default function MultiOrbitIntegrations() {
  const aiTools = [
    [
      { name: "OpenAI GPT-4", icon: Bot },
      { name: "Anthropic Claude", icon: Sparkles },
      { name: "Google Gemini", icon: BrainCircuit }
    ],
    [
      { name: "Midjourney", icon: Cpu },
      { name: "Jasper AI", icon: FileText },
      { name: "Copy.ai", icon: MessagesSquare },
      { name: "Perplexity", icon: Globe }
    ]
  ];

  const devTools = [
    [
      { name: "GitHub", icon: Github },
      { name: "GitLab", icon: Gitlab },
      { name: "Bitbucket", icon: Share2 }
    ],
    [
      { name: "Jira", icon: Trello },
      { name: "Linear", icon: Trello },
      { name: "Slack", icon: Slack },
      { name: "Discord", icon: MessagesSquare },
      { name: "Notion", icon: FileText }
    ]
  ];

  const careerTools = [
    [
      { name: "LinkedIn", icon: Linkedin },
      { name: "Indeed", icon: Briefcase },
      { name: "Glassdoor", icon: FileText }
    ],
    [
      { name: "Workday ATS", icon: Cpu },
      { name: "Greenhouse", icon: Sparkles },
      { name: "Lever", icon: Briefcase },
      { name: "Resume Parsers", icon: Bot }
    ]
  ];

  return (
    <section className="py-24 relative w-full overflow-hidden bg-white dark:bg-background border-t border-slate-200 dark:border-slate-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white dark:from-slate-900/20 dark:via-background dark:to-background"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center mb-20 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
            Connect your <span className="text-primary">Ecosystem</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            CareerPilot integrates seamlessly with the tools you already use. From AI generation to version control and professional networks, everything is connected.
          </p>
        </div>

        <OrbitSection 
           title="AI Models & APIs" 
           description="Harness industry-leading language models for generating tailored resumes, customized cover letters, and intelligent mock interviews."
           orbits={aiTools}
        />
        
        <OrbitSection 
           title="Developer Workflow" 
           description="Sync your GitHub repositories, pull requests, and projects to automatically keep your portfolio fresh and up-to-date."
           orbits={devTools}
        />

        <OrbitSection 
           title="Career & Hiring Platforms" 
           description="One-click apply using our optimized resume formats specifically designed to pass ATS screening systems."
           orbits={careerTools}
        />
      </div>
    </section>
  );
}
