import { useState } from "react";
import { MapPin, Mail, Phone, Fold, Heart, Star } from "lucide-react";

const FoldDecoration = ({ className = "" }) => (
  <div className={`absolute ${className}`}>
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <path d="M0 0 L60 0 L60 60 Z" fill="rgba(139, 119, 101, 0.12)" />
      <path d="M0 0 L60 60" stroke="rgba(139, 119, 101, 0.2)" strokeWidth="0.5" />
    </svg>
  </div>
);

const CraneFold = ({ className = "" }) => (
  <div className={`absolute ${className} opacity-10`}>
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <polygon points="40,5 75,60 40,45 5,60" fill="rgba(139,119,101,0.4)" />
      <polygon points="40,45 5,60 20,35" fill="rgba(101,85,70,0.3)" />
      <polygon points="40,45 75,60 60,35" fill="rgba(101,85,70,0.2)" />
      <line x1="40" y1="45" x2="40" y2="75" stroke="rgba(101,85,70,0.3)" strokeWidth="1.5" />
      <line x1="40" y1="75" x2="30" y2="80" stroke="rgba(101,85,70,0.3)" strokeWidth="1.5" />
    </svg>
  </div>
);

const SkillTag = ({ skill }) => (
  <div className="relative group">
    <div
      className="px-4 py-2 text-sm font-medium transition-all duration-300 cursor-default"
      style={{
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(139,119,101,0.3)",
        clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
        color: "#5c4d3d",
        fontFamily: "'Noto Serif', Georgia, serif",
        letterSpacing: "0.05em",
        boxShadow: "2px 2px 0 rgba(139,119,101,0.15)",
      }}
    >
      {skill}
    </div>
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{
        background: "rgba(139,119,101,0.1)",
        clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
      }}
    />
  </div>
);

const StatCard = ({ icon: Icon, label, value }) => (
  <div
    className="flex flex-col items-center p-5 relative overflow-hidden"
    style={{
      background: "rgba(255,255,255,0.6)",
      border: "1px solid rgba(139,119,101,0.25)",
      boxShadow: "3px 3px 0 rgba(139,119,101,0.1)",
    }}
  >
    <div
      className="absolute top-0 right-0 w-8 h-8"
      style={{
        background: "rgba(139,119,101,0.08)",
        clipPath: "polygon(100% 0%, 100% 100%, 0% 0%)",
      }}
    />
    <Icon size={20} className="mb-2" style={{ color: "#8b7765" }} />
    <span className="text-2xl font-bold" style={{ color: "#3d2f1f", fontFamily: "'Noto Serif', Georgia, serif" }}>
      {value}
    </span>
    <span className="text-xs mt-1 tracking-widest uppercase" style={{ color: "#8b7765" }}>
      {label}
    </span>
  </div>
);

export default function About() {
  const [activeTab, setActiveTab] = useState("story");

  const skills = [
    "React", "TypeScript", "Node.js", "Python",
    "Figma", "Tailwind CSS", "PostgreSQL", "GraphQL",
  ];

  const tabs = [
    { id: "story", label: "My Story" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <section
      className="relative min-h-screen py-16 px-4 md:px-8 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #faf7f2 0%, #f0e9dc 40%, #e8ddd0 100%)",
        fontFamily: "'Noto Serif', Georgia, serif",
      }}
    >
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 28px,
              rgba(139,119,101,0.04) 28px,
              rgba(139,119,101,0.04) 29px
            )
          `,
        }}
      />

      {/* Decorative fold corners */}
      <FoldDecoration className="top-0 left-0" />
      <FoldDecoration className="top-0 right-0 rotate-90" />
      <FoldDecoration className="bottom-0 left-0 -rotate-90" />
      <FoldDecoration className="bottom-0 right-0 rotate-180" />

      {/* Origami cranes */}
      <CraneFold className="top-12 right-16" />
      <CraneFold className="bottom-24 left-10 rotate-12" />
      <CraneFold className="top-1/3 left-4 -rotate-6" />

      <div className="relative max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block relative mb-6">
            <div
              className="w-32 h-32 mx-auto relative"
              style={{
                background: "linear-gradient(135deg, #d4b896 0%, #c4a07a 100%)",
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                boxShadow: "4px 4px 0 rgba(139,119,101,0.2), 8px 8px 0 rgba(139,119,101,0.1)",
              }}
            >
              <div
                className="absolute inset-2"
                style={{
                  background: "linear-gradient(135deg, #e8d5bc 0%, #d4b896 100%)",
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl" style={{ color: "#5c4030" }}>折</span>
                </div>
              </div>
            </div>

            {/* Fold shadow */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 blur-sm"
              style={{ background: "rgba(139,119,101,0.2)" }}
            />
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{
              color: "#2c1f0e",
              textShadow: "2px 2px 0 rgba(139,119,101,0.15)",
              letterSpacing: "-0.02em",
            }}
          >
            Yuki Tanaka
          </h1>

          <div
            className="inline-flex items-center gap-2 px-6 py-2 mt-3"
            style={{
              background: "rgba(139,119,101,0.12)",
              border: "1px solid rgba(139,119,101,0.3)",
              clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
            }}
          >
            <span className="text-sm tracking-widest uppercase" style={{ color: "#8b7765" }}>
              Creative Developer & Designer
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg mx-auto">
          <StatCard icon={Star} label="Projects" value="42" />
          <StatCard icon={Heart} label="Clients" value="18" />
          <StatCard icon={Fold} label="Years" value="5+" />
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-0 mb-8">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-6 py-3 text-sm tracking-wider uppercase transition-all duration-200 relative"
              style={{
                background: activeTab === tab.id
                  ? "rgba(139,119,101,0.2)"
                  : "rgba(255,255,255,0.4)",
                border: "1px solid rgba(139,119,101,0.25)",
                borderLeft: i > 0 ? "none" : "1px solid rgba(139,119,101,0.25)",
                color: activeTab === tab.id ? "#3d2f1f" : "#8b7765",
                fontFamily: "'Noto Serif', Georgia, serif",
                fontWeight: activeTab === tab.id ? "600" : "400",
              }}
            >
              {activeTab === tab.id && (
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: "#8b7765" }}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          className="relative p-8 md:p-10"
          style={{
            background: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(139,119,101,0.2)",
            boxShadow: "6px 6px 0 rgba(139,119,101,0.08), 12px 12px 0 rgba(139,119,101,0.04)",
            backdropFilter: "blur(4px)",
          }}
        >
          {/* Corner fold */}
          <div
            className="absolute top-0 right-0 w-12 h-12"
            style={{
              background: "linear-gradient(225deg, rgba(139,119,101,0.15) 50%, transparent 50%)",
            }}
          />

          {activeTab === "story" && (
            <div className="space-y-5">
              <h2
                className="text-2xl font-semibold mb-6 pb-3"
                style={{
                  color: "#2c1f0e",
                  borderBottom: "1px solid rgba(139,119,101,0.2)",
                }}
              >
                Folded from curiosity, unfolded with code
              </h2>
              <p className="leading-relaxed text-base" style={{ color: "#5c4d3d" }}>
                Like origami, I believe the most beautiful things emerge from simple foundations
                transformed with intention and care. My journey in software began with a single
                fold — a curiosity about how interfaces could feel as tactile and deliberate as
                paper in skilled hands.
              </p>
              <p className="leading-relaxed text-base" style={{ color: "#5c4d3d" }}>
                I craft digital experiences that breathe — interfaces where every interaction has
                purpose, where complexity is folded away to reveal elegant simplicity. My work
                sits at the intersection of thoughtful engineering and considered design.
              </p>
              <p className="leading-relaxed text-base" style={{ color: "#5c4d3d" }}>
                When I'm not writing code, you'll find me folding paper cranes, practicing
                calligraphy, or wandering through quiet libraries in search of ideas waiting
                to be unfolded.
              </p>

              {/* decorative divider */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex-1 h-px" style={{ background: "rgba(139,119,101,0.2)" }} />
                <span style={{ color: "#8b7765", fontSize: "20px" }}>折</span>
                <div className="flex-1 h-px" style={{ background: "rgba(139,119,101,0.2)" }} />
              </div>

              <div className="flex flex-wrap gap-4 text-sm" style={{ color: "#8b7765" }}>
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> Kyoto, Japan
                </span>
                <span className="flex items-center gap-1">
                  <Mail size={14} /> yuki@paper.dev
                </span>
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div>
              <h2
                className="text-2xl font-semibold mb-6 pb-3"
                style={{
                  color: "#2c1f0e",
                  borderBottom: "1px solid rgba(139,119,101,0.2)",
                }}
              >
                Crafted capabilities
              </h2>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <SkillTag key={skill} skill={skill} />
                ))}
              </div>

              <div className="mt-8 space-y-4">
                {[
                  { label: "Frontend Development", value: 90 },
                  { label: "UI/UX Design", value: 78 },
                  { label: "Backend Systems", value: 70 },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1 text-sm" style={{ color: "#5c4d3d" }}>
                      <span>{label}</span>
                      <span style={{ color: "#8b7765" }}>{value}%</span>
                    </div>
                    <div
                      className="h-2 relative overflow-hidden"
                      style={{
                        background: "rgba(139,119,101,0.12)",
                        clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)",
                      }}
                    >
                      <div
                        className="h-full"
                        style={{
                          width: `${value}%`,
                          background: "linear-gradient(90deg, #c4a07a, #8b7765)",
                          clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div>
              <h2
                className="text-2xl font-semibold mb-6 pb-3"
                style={{
                  color: "#2c1f0e",
                  borderBottom: "1px solid rgba(139,119,101,0.2)",
                }}
              >
                Send a paper crane my way
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "yuki@paper.dev" },
                  { icon: Phone, label: "Phone", value: "+81 90-1234-5678" },
                  { icon: MapPin, label: "Location", value: "Kyoto, Japan" },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 p-4"
                    style={{
                      background: "rgba(255,255,255,0.5)",
                      border: "1px solid rgba(139,119,101,0.2)",
                      boxShadow: "2px 2px 0 rgba(139,119,101,0.08)",
                    }}
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(139,119,101,0.1)",
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      }}
                    >
                      <Icon size={16} style={{ color: "#8b7765" }} />
                    </div>
                    <div>
                      <div className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "#8b7765" }}>
                        {label}
                      </div>
                      <div className="text-sm font-medium" style={{ color: "#3d2f1f" }}>
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}