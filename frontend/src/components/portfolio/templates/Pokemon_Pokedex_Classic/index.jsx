import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PokemonPokedexClassic = ({ portfolioData }) => {
  const { portfolioData: data } = usePortfolio();

  /* ── Data Handling ─────────────────────────────────────────────────────── */
  const mergedData = useMemo(() => {
    const projects = portfolioData?.projects || data.projects || [];
    const personal = portfolioData?.personal || data.personal || {};
    return { projects, personal };
  }, [portfolioData]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  /* ── Helper function to format and secure URLs ── */
  // EDIT 1: Added URL Sanitizer function
  const formatUrl = (url) => {
    if (!url || url === "#") return null;
    const cleanUrl = url.trim();
    return cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://") 
      ? cleanUrl 
      : `https://${cleanUrl}`;
  };

  /* ── Project Data Mapping for Pokedex ──────────────────────────────────── */
  const pokedexEntries = useMemo(() => {
    return mergedData.projects.map((project, idx) => {
      // EDIT 2: Comprehensive URL fallback check inside mapping
      const rawLive = project.liveUrl || project.link || project.url;
      const rawGithub = project.githubUrl || project.github || project.sourceCode;

      return {
        id: idx + 1,
        name: project.title || `Project ${idx + 1}`,
        type: project.techStack?.[0] || "Unknown",
        description: project.description || "No description",
        image: project.image || "https://via.placeholder.com/200",
        height: `${150 + Math.floor(Math.random() * 50)}cm`, // Math.floor used for cleaner data display
        weight: `${50 + Math.floor(Math.random() * 100)}kg`,
        techStack: project.techStack || [],
        links: {
          live: formatUrl(rawLive),
          github: formatUrl(rawGithub),
        },
      };
    });
  }, [mergedData.projects]);

  // EDIT 3: Reading directly from sanitized pokedexEntries instead of unformatted array
  const currentEntry = pokedexEntries[selectedIndex] || {};

  /* ── Tailwind Retro Pokedex Layout ─────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4 font-mono">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .pokedex-container {
          perspective: 1200px;
        }
        
        .pokedex-body {
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 50%, #e74c3c 100%);
          border-radius: 60px;
          padding: 24px;
          box-shadow: 
            0 0 0 8px #2c2c2c,
            0 0 0 10px #333333,
            inset -2px -2px 5px rgba(0,0,0,0.3),
            inset 2px 2px 5px rgba(255,255,255,0.1);
          max-width: 420px;
          position: relative;
        }
        
        .pokedex-top {
          background: linear-gradient(180deg, #c0392b 0%, #e74c3c 100%);
          border-radius: 45px 45px 20px 20px;
          padding: 16px;
          margin-bottom: 8px;
        }
        
        .pokedex-screen {
          background: linear-gradient(135deg, #1a472a 0%, #0d2818 100%);
          border-radius: 8px;
          padding: 12px;
          border: 3px solid #000;
          box-shadow: inset 0 0 8px rgba(0,0,0,0.8), inset 0 0 20px rgba(100,255,100,0.1);
          min-height: 240px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .screen-display {
          background: linear-gradient(180deg, rgba(100,255,100,0.05), rgba(50,200,50,0.02));
          border-radius: 4px;
          padding: 8px;
          border: 1px solid rgba(100,255,100,0.2);
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow: hidden;
        }
        
        .screen-image {
          height: 120px;
          background: rgba(0,0,0,0.4);
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid rgba(100,255,100,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .screen-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: cover;
          filter: brightness(1.1) contrast(1.2);
        }
        
        .screen-info {
          font-size: 9px;
          color: #64ff64;
          text-shadow: 0 0 8px rgba(100,255,100,0.5);
          line-height: 1.3;
          font-weight: bold;
          letter-spacing: 0.5px;
        }
        
        .screen-info-line {
          display: flex;
          justify-content: space-between;
          padding: 2px 0;
        }
        
        .dpad {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 4px;
          margin-bottom: 12px;
          background: #e74c3c;
          padding: 8px;
          border-radius: 8px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .dpad-btn {
          background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
          border: 2px solid #1a252f;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.1s;
          box-shadow: inset -1px -1px 2px rgba(0,0,0,0.5);
          min-height: 32px;
        }
        
        .dpad-btn:hover {
          background: linear-gradient(135deg, #3d5a7d 0%, #354656 100%);
          box-shadow: inset -1px -1px 2px rgba(0,0,0,0.5), 0 0 12px rgba(100,255,100,0.4);
        }
        
        .dpad-btn:active {
          box-shadow: inset 1px 1px 2px rgba(0,0,0,0.5);
          transform: translateY(1px);
        }
        
        .dpad-center {
          grid-column: 2;
          grid-row: 2;
          background: radial-gradient(circle at 30% 30%, #2c3e50, #1a252f);
          cursor: default;
        }
        
        .dpad-center:hover {
          box-shadow: inset -1px -1px 2px rgba(0,0,0,0.5);
        }
        
        .button-section {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .pokedex-btn {
          flex: 1;
          padding: 8px 12px;
          border: 2px solid #2c2c2c;
          border-radius: 6px;
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
          font-size: 7px;
          font-weight: bold;
          cursor: pointer;
          text-transform: uppercase;
          transition: all 0.2s;
          box-shadow: inset -1px -1px 2px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.3);
          letter-spacing: 0.5px;
        }
        
        .pokedex-btn:hover {
          background: linear-gradient(135deg, #3aa3e3 0%, #2a8dbb 100%);
          box-shadow: inset -1px -1px 2px rgba(0,0,0,0.3), 0 6px 12px rgba(52,152,219,0.4);
        }
        
        .pokedex-btn:active {
          box-shadow: inset 1px 1px 2px rgba(0,0,0,0.3);
          transform: translateY(1px);
        }
        
        .bottom-row {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: space-between;
        }
        
        .red-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          border: 3px solid #8b0000;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(231,76,60,0.4), inset -2px -2px 4px rgba(0,0,0,0.3);
          transition: all 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 8px;
          text-align: center;
        }
        
        .red-btn:hover {
          box-shadow: 0 6px 16px rgba(231,76,60,0.6), inset -2px -2px 4px rgba(0,0,0,0.3);
          transform: translateY(-2px);
        }
        
        .red-btn:active {
          box-shadow: inset 1px 1px 3px rgba(0,0,0,0.5);
          transform: translateY(0);
        }
        
        .entry-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
          gap: 6px;
          background: rgba(0,0,0,0.3);
          padding: 8px;
          border-radius: 6px;
          border: 1px solid rgba(100,255,100,0.2);
          max-height: 180px;
          overflow-y: auto;
        }
        
        .entry-btn {
          padding: 6px;
          background: rgba(100,255,100,0.1);
          border: 1px solid rgba(100,255,100,0.3);
          border-radius: 3px;
          color: #64ff64;
          font-size: 7px;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
          text-transform: uppercase;
          font-weight: bold;
          word-break: break-word;
          text-shadow: 0 0 4px rgba(100,255,100,0.5);
        }
        
        .entry-btn:hover {
          background: rgba(100,255,100,0.2);
          box-shadow: 0 0 8px rgba(100,255,100,0.4);
        }
        
        .entry-btn.active {
          background: rgba(100,255,100,0.3);
          box-shadow: inset 0 0 8px rgba(100,255,100,0.3), 0 0 12px rgba(100,255,100,0.5);
          border-color: rgba(100,255,100,0.6);
        }
        
        .tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 4px;
        }
        
        .tech-badge {
          font-size: 6px;
          background: rgba(100,100,255,0.3);
          border: 1px solid rgba(100,100,255,0.5);
          padding: 2px 4px;
          border-radius: 2px;
          color: #8888ff;
          text-shadow: 0 0 4px rgba(100,100,255,0.4);
        }
        
        .screen-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        
        .glitch-animation {
          animation: pokedex-glitch 0.3s ease-out;
        }
        
        @keyframes pokedex-glitch {
          0% { transform: translateX(-2px); }
          25% { transform: translateX(2px); }
          50% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }
        
        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(100,255,100,0.03),
            rgba(100,255,100,0.03) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          border-radius: 8px;
        }
      `}</style>

      <motion.div
        className="pokedex-container"
        initial={{ rotateY: -15, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="pokedex-body">
          {/* Top Section */}
          <div className="pokedex-top">
            <div className="screen-grid">
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "#000", fontWeight: "bold", fontSize: "10px" }}>
                  POKé
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "#000", fontWeight: "bold", fontSize: "10px" }}>
                  DEXT
                </div>
              </div>
            </div>
          </div>

          {/* Main Screen */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              className="pokedex-screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="screen-display">
                <div className="screen-image">
                  <motion.img
                    src={currentEntry.image}
                    alt={currentEntry.name}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <div className="screen-info">
                  <motion.div
                    className="screen-info-line"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span>#{ currentEntry.id }</span>
                    <span>{currentEntry.name}</span>
                  </motion.div>

                  <motion.div
                    className="screen-info-line"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <span>TYPE:</span>
                    <span>{currentEntry.type}</span>
                  </motion.div>

                  <motion.div
                    className="screen-info-line"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span style={{ fontSize: "7px" }}>
                      {currentEntry.description?.substring(0, 45)}...
                    </span>
                  </motion.div>

                  <motion.div
                    className="tech-stack"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    {currentEntry.techStack?.slice(0, 3).map((tech, idx) => (
                      <div key={idx} className="tech-badge">
                        {tech}
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* D-Pad Navigation */}
          <div className="dpad">
            <button
              className="dpad-btn"
              onClick={() =>
                setSelectedIndex((prev) =>
                  prev > 0 ? prev - 1 : pokedexEntries.length - 1
                )
              }
              title="Previous"
            />
            <button className="dpad-btn" title="Up" />
            <button className="dpad-btn" title="Right" />
            <button className="dpad-btn" title="Left" />
            <div className="dpad-center" />
            <button className="dpad-btn" title="Right" />
            <button
              className="dpad-btn"
              onClick={() =>
                setSelectedIndex((prev) =>
                  prev < pokedexEntries.length - 1 ? prev + 1 : 0
                )
              }
              title="Down"
            />
            <button className="dpad-btn" title="Right" />
            <button className="dpad-btn" title="Right" />
          </div>

          {/* Buttons */}
          {/* EDIT 4: Changed click triggers to use fully sanitized, absolute links safely */}
          <div className="button-section">
            <button 
              className="pokedex-btn" 
              onClick={() => {
                if (currentEntry.links?.github) {
                  window.open(currentEntry.links.github, "_blank", "noopener,noreferrer");
                } else {
                  alert("No GitHub link available for this project!");
                }
              }}
            >
              GitHub
            </button>
            <button 
              className="pokedex-btn" 
              onClick={() => {
                if (currentEntry.links?.live) {
                  window.open(currentEntry.links.live, "_blank", "noopener,noreferrer");
                } else {
                  alert("No Live deployment link available!");
                }
              }}
            >
              Live
            </button>
          </div>

          {/* Entry Grid */}
          <motion.div
            className="entry-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {pokedexEntries.map((entry, idx) => (
              <motion.button
                key={entry.id}
                className={`entry-btn ${idx === selectedIndex ? "active" : ""}`}
                onClick={() => setSelectedIndex(idx)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                #{entry.id}
              </motion.button>
            ))}
          </motion.div>

          {/* Power Button */}
          <div className="bottom-row" style={{ marginTop: "12px" }}>
            <div style={{ color: "#000", fontSize: "8px", fontWeight: "bold" }}>
              PORTFOLIO
            </div>
            <button className="red-btn" title="View All Projects">
              PROJ
            </button>
          </div>

          {/* Scan Line Effect */}
          <div className="scan-line"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default PokemonPokedexClassic;