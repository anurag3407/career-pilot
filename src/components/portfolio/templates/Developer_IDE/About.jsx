import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  User,
  MapPin,
  Mail,
  Globe,
  Github,
  Linkedin,
  Coffee,
  Code2,
  Braces,
  ChevronRight,
  Circle,
} from "lucide-react";

function useTypingEffect(text, speed = 40, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      intervalRef.current = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(intervalRef.current);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

function Cursor({ visible = true }) {
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(id);
  }, [visible]);
  return (
    <span
      className="inline-block w-2 h-4 ml-0.5 align-middle"
      style={{ backgroundColor: blink && visible ? "#4ade80" : "transparent" }}
    />
  );
}

function LineNumbers({ count }) {
  return (
    <div
      className="select-none pr-4 text-right text-xs font-mono"
      style={{ color: "#4b5563", minWidth: "2.5rem" }}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="leading-6">
          {i + 1}
        </div>
      ))}
    </div>
  );
}

const TOKEN = {
  keyword: { color: "#ff7b72" },
  fn:      { color: "#d2a8ff" },
  string:  { color: "#a5d6ff" },
  number:  { color: "#79c0ff" },
  comment: { color: "#8b949e", fontStyle: "italic" },
  var:     { color: "#ffa657" },
  punct:   { color: "#6e7681" },
  prop:    { color: "#79c0ff" },
  bool:    { color: "#ff7b72" },
  green:   { color: "#4ade80" },
};

export default function About({
  name = "Alex Chen",
  title = "Senior Full-Stack Engineer",
  since = 2019,
  yearsOfExp = 6,
  bio = "I build things for the web. Currently deep into Rust, WebAssembly, and making my PRs actually readable.",
  email = "alex@devmail.io",
  location = "San Francisco, CA",
  website = "alexdev.io",
  github = "github.com/alexdev",
  linkedin = "linkedin.com/in/alexdev",
  skills = [
    { cat: "Languages", items: ["TypeScript", "Python", "Rust", "Go"] },
    { cat: "Frontend",  items: ["React", "Next.js", "Tailwind", "Framer"] },
    { cat: "Backend",   items: ["Node.js", "FastAPI", "PostgreSQL", "Redis"] },
    { cat: "DevOps",    items: ["Docker", "K8s", "GitHub Actions", "AWS"] },
  ],
}) {
  const [activeTab, setActiveTab] = useState("about.js");
  const [mounted, setMounted] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 1200);
    return () => clearInterval(id);
  }, []);

  const { displayed: typedBio, done: bioDone } = useTypingEffect(bio, 28, 800);

  const tabs = ["about.js", "skills.json", "contact.ts"];

  const contactLines = [
    { key: "email",    value: email,    icon: <Mail size={12} /> },
    { key: "location", value: location, icon: <MapPin size={12} /> },
    { key: "website",  value: website,  icon: <Globe size={12} /> },
    { key: "github",   value: github,   icon: <Github size={12} /> },
    { key: "linkedin", value: linkedin, icon: <Linkedin size={12} /> },
  ];

  const sideIcons = [Code2, User, Braces, Coffee];

  return (
    <section
      className="min-h-screen w-full flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: "#0d1117", fontFamily: "'Fira Code', 'JetBrains Mono', monospace" }}
    >
      <div
        className="w-full max-w-5xl rounded-xl overflow-hidden"
        style={{
          background: "#0d1117",
          border: "1px solid #30363d",
          boxShadow: "0 0 0 1px #21262d, 0 8px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Window chrome */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ background: "#161b22", borderBottom: "1px solid #30363d" }}
        >
          <Circle size={12} fill="#ff5f57" stroke="none" />
          <Circle size={12} fill="#febc2e" stroke="none" />
          <Circle size={12} fill="#28c840" stroke="none" />
          <span className="ml-2 text-xs" style={{ color: "#6e7681" }}>
            career-pilot / portfolio / Developer_IDE / about.js
          </span>
          <div className="flex-1" />
          <Terminal size={14} style={{ color: "#4ade80" }} />
          <span className="text-xs" style={{ color: "#4ade80" }}>node v20.11.0</span>
        </div>

        {/* Tab bar */}
        <div
          className="flex items-end px-2"
          style={{ background: "#161b22", borderBottom: "1px solid #21262d" }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs transition-all duration-150"
                style={{
                  color: isActive ? "#e6edf3" : "#6e7681",
                  background: isActive ? "#0d1117" : "transparent",
                  borderBottom: isActive ? "2px solid #4ade80" : "2px solid transparent",
                }}
              >
                {tab.endsWith(".js")   && <span style={{ color: "#ffd700", fontSize: 10 }}>JS</span>}
                {tab.endsWith(".json") && <span style={{ color: "#4ade80", fontSize: 10 }}>{"{ }"}</span>}
                {tab.endsWith(".ts")   && <span style={{ color: "#3b82f6", fontSize: 10 }}>TS</span>}
                {tab}
              </button>
            );
          })}
        </div>

        {/* Editor body */}
        <div className="flex" style={{ minHeight: 520 }}>
          {/* Activity bar */}
          <div
            className="hidden md:flex flex-col items-center gap-5 py-6 px-2"
            style={{ background: "#161b22", borderRight: "1px solid #21262d", width: 48 }}
          >
            {sideIcons.map((Icon, i) => (
              <button
                key={i}
                className="p-1.5 rounded transition-colors"
                style={{ color: i === 0 ? "#4ade80" : "#6e7681" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#adbac7")}
                onMouseLeave={(e) => (e.currentTarget.style.color = i === 0 ? "#4ade80" : "#6e7681")}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>

          {/* Code pane */}
          <div className="flex-1 overflow-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#30363d transparent" }}>

            {/* ── about.js ── */}
            {activeTab === "about.js" && (
              <div className="p-6 text-sm leading-6">
                <div className="flex gap-4">
                  <LineNumbers count={22} />
                  <div className="flex-1 min-w-0">
                    <div style={TOKEN.comment}>{"/**"}</div>
                    <div style={TOKEN.comment}>{` * @author  ${name}`}</div>
                    <div style={TOKEN.comment}>{` * @role   ${title}`}</div>
                    <div style={TOKEN.comment}>{` * @since  ${since}`}</div>
                    <div style={TOKEN.comment}>{" */"}</div>

                    <div className="mt-2">
                      <span style={TOKEN.keyword}>const </span>
                      <span style={TOKEN.var}>developer</span>
                      <span style={TOKEN.punct}>{" = {"}</span>
                    </div>

                    {[
                      ["name",            `"${name}"`,    "string"],
                      ["title",           `"${title}"`,   "string"],
                      ["yearsOfExp",      yearsOfExp,     "number"],
                      ["openToWork",      "true",         "bool"],
                    ].map(([key, val, type]) => (
                      <div key={key} className="pl-6">
                        <span style={TOKEN.prop}>{key}</span>
                        <span style={TOKEN.punct}>: </span>
                        <span style={TOKEN[type]}>{val}</span>
                        <span style={TOKEN.punct}>,</span>
                      </div>
                    ))}

                    <div className="pl-6 flex flex-wrap items-start gap-1">
                      <span style={TOKEN.prop}>bio</span>
                      <span style={TOKEN.punct}>: </span>
                      <span style={TOKEN.string}>
                        "{mounted ? typedBio : bio}"
                      </span>
                      {mounted && !bioDone && <Cursor visible />}
                      <span style={TOKEN.punct}>,</span>
                    </div>

                    <div style={TOKEN.punct}>{"}"}</div>
                    <div style={TOKEN.punct}>;</div>

                    <div className="mt-4">
                      <span style={TOKEN.keyword}>export default </span>
                      <span style={TOKEN.var}>developer</span>
                      <span style={TOKEN.punct}>;</span>
                    </div>

                    <div className="mt-8 flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{
                          background: "#4ade80",
                          opacity: blink ? 1 : 0.3,
                          transition: "opacity 0.4s",
                        }}
                      />
                      <span className="text-xs" style={TOKEN.green}>
                        Available for new projects
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── skills.json ── */}
            {activeTab === "skills.json" && (
              <div className="p-6 text-sm leading-6">
                <div className="flex gap-4">
                  <LineNumbers count={skills.length * 6 + 4} />
                  <div className="flex-1">
                    <div style={TOKEN.punct}>{"{"}</div>
                    {skills.map((group, gi) => (
                      <div key={gi} className="pl-4">
                        <div>
                          <span style={TOKEN.prop}>"{group.cat}"</span>
                          <span style={TOKEN.punct}>: [</span>
                        </div>
                        <div className="pl-6 flex flex-wrap gap-2 py-2">
                          {group.items.map((item) => (
                            <span
                              key={item}
                              className="cursor-default transition-all duration-150"
                              style={{
                                background: "#161b22",
                                border: "1px solid #30363d",
                                color: "#a5d6ff",
                                borderRadius: 4,
                                padding: "2px 8px",
                                fontSize: "0.72rem",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#4ade80";
                                e.currentTarget.style.color = "#4ade80";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#30363d";
                                e.currentTarget.style.color = "#a5d6ff";
                              }}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                        <div>
                          <span style={TOKEN.punct}>]</span>
                          {gi < skills.length - 1 && <span style={TOKEN.punct}>,</span>}
                        </div>
                      </div>
                    ))}
                    <div style={TOKEN.punct}>{"}"}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── contact.ts ── */}
            {activeTab === "contact.ts" && (
              <div className="p-6 text-sm leading-6">
                <div className="flex gap-4">
                  <LineNumbers count={contactLines.length + 10} />
                  <div className="flex-1">
                    <div>
                      <span style={TOKEN.keyword}>interface </span>
                      <span style={TOKEN.fn}>ContactInfo</span>
                      <span style={TOKEN.punct}>{" {"}</span>
                    </div>
                    {contactLines.map((c) => (
                      <div key={c.key} className="pl-6">
                        <span style={TOKEN.prop}>{c.key}</span>
                        <span style={TOKEN.punct}>: </span>
                        <span style={TOKEN.keyword}>string</span>
                        <span style={TOKEN.punct}>;</span>
                      </div>
                    ))}
                    <div style={TOKEN.punct}>{"}"}</div>

                    <div className="mt-4">
                      <span style={TOKEN.keyword}>const </span>
                      <span style={TOKEN.var}>contact</span>
                      <span style={TOKEN.punct}>: </span>
                      <span style={TOKEN.fn}>ContactInfo</span>
                      <span style={TOKEN.punct}>{" = {"}</span>
                    </div>
                    {contactLines.map((c, i) => (
                      <div key={c.key} className="pl-6 flex items-center gap-2 group cursor-pointer">
                        <span style={{ color: "#6e7681" }}>{c.icon}</span>
                        <span style={TOKEN.prop}>{c.key}</span>
                        <span style={TOKEN.punct}>: </span>
                        <span
                          style={TOKEN.string}
                          className="group-hover:underline"
                        >
                          "{c.value}"
                        </span>
                        {i < contactLines.length - 1 && <span style={TOKEN.punct}>,</span>}
                      </div>
                    ))}
                    <div style={TOKEN.punct}>{"}"}</div>
                    <div style={TOKEN.punct}>;</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status bar */}
        <div
          className="flex items-center justify-between px-4 py-1 text-xs"
          style={{ background: "#1a7f4b", color: "#e6edf3", borderTop: "1px solid #21262d" }}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ChevronRight size={12} />
              main
            </span>
            <span>0 errors · 0 warnings</span>
          </div>
          <div className="flex items-center gap-4">
            <span>
              {activeTab.endsWith(".json")
                ? "JSON"
                : activeTab.endsWith(".ts")
                ? "TypeScript"
                : "JavaScript"}
            </span>
            <span>UTF-8</span>
            <span>Spaces: 2</span>
          </div>
        </div>
      </div>
    </section>
  );
}
