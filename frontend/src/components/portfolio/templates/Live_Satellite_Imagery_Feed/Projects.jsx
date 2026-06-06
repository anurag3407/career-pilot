import React, { useState, useEffect, useRef, useContext } from "react";
import { PortfolioContext } from "../../../../context/PortfolioContext";
import {
  Satellite,
  MapPin,
  Calendar,
  Eye,
  Download,
  ExternalLink,
  Grid,
  List,
  Radio,
  ZoomIn,
  Compass,
  Signal,
  Cloud,
  AlertCircle
} from "lucide-react";


export default function Projects({
  satellites: propsSatellites, // Keep this if you want to allow manual overrides
  title = "LIVE SATELLITE FEED",
  subtitle = "REAL-TIME EARTH OBSERVATION DATABASE"
}) {
  const { portfolio } = useContext(PortfolioContext);
const ensureAbsoluteUrl = (url) => {
  if (!url || url === "#") return "#";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
};

export default function Projects({
  satellites = propsSatellites || portfolio?.projects,
  title = "LIVE SATELLITE FEED",
  subtitle = "REAL-TIME EARTH OBSERVATION DATABASE"
}) {
  const [activeRegion, setActiveRegion] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [liveMonitor, setLiveMonitor] = useState(true);
  const [selectedSatellite, setSelectedSatellite] = useState(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Set default selected satellite
  useEffect(() => {
    if (satellites?.length > 0) {
      setSelectedSatellite(satellites[0]);
    }
  }, [satellites]);

  // Extract unique regions
  const regions = ["All", ...new Set(satellites.map((s) => s.region))];

  // Filter satellites
  const filteredSatellites =
    activeRegion === "All"
      ? satellites
      : satellites.filter((s) => s.region === activeRegion);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono&family=IBM+Plex+Mono:wght@400;600&display=swap');

        @keyframes satellite-pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
        }
        @keyframes scan-line {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        @keyframes signal-wave {
          0%, 100% { transform: scaleY(1); opacity: 0.6; }
          50% { transform: scaleY(1.2); opacity: 1; }
        }
        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(0, 240, 255, 0.4)); }
          50% { filter: drop-shadow(0 0 12px rgba(0, 240, 255, 0.8)); }
        }

        .font-tech {
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.05em;
        }
        .font-data {
          font-family: 'IBM Plex Mono', monospace;
        }
        
        .satellite-scanline::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            rgba(0, 0, 0, 0) 50%,
            rgba(0, 240, 255, 0.03) 50%
          );
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 10;
          animation: satellite-pulse 2s infinite;
        }
        
        .satellite-grid {
          background: radial-gradient(circle at 20% 50%, rgba(0, 240, 255, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(100, 200, 255, 0.03) 0%, transparent 50%);
        }
      `}} />

      <section
        id="projects"
        ref={sectionRef}
        className="relative min-h-screen w-full bg-[#0a0e27] py-20 px-4 sm:px-6 lg:px-8 border-t-4 border-b-4 border-cyan-900/40 overflow-hidden"
      >
        {/* Animated background grid */}
        <div className="absolute inset-0 satellite-grid pointer-events-none" />
        
        {/* Tech grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,240,255,0.02)_1px,transparent_1px),linear-gradient(rgba(0,240,255,0.02)_1px,transparent_1px)] [background-size:50px_50px] pointer-events-none" />

        {/* Atmosphere gradient bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-cyan-950/20 to-transparent pointer-events-none" />

        <div className="relative z-20 max-w-7xl mx-auto">
          
          {/* ──────────── SATELLITE CONTROL PANEL HEADER ──────────── */}
          <div className="mb-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-500/30 p-8 rounded-lg backdrop-blur-sm relative overflow-hidden group">
            {/* Live indicator glow */}
            <div className="absolute top-0 right-8 flex items-center gap-2 bg-black/40 px-4 py-2 rounded-b-lg border-b-2 border-l-2 border-r-2 border-cyan-500/50 backdrop-blur-sm">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span className="font-tech text-xs text-cyan-400 tracking-widest">LIVE FEED</span>
            </div>

            {/* Header content */}
            <div className="flex flex-col items-center text-center mb-4">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="relative w-8 h-8">
                  <Satellite className="w-8 h-8 text-cyan-400" style={{ animation: "orbit 4s linear infinite" }} />
                </div>
                <h2 className="font-tech text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300">
                  {title}
                </h2>
                <div className="relative w-8 h-8">
                  <Satellite className="w-8 h-8 text-blue-400" style={{ animation: "orbit 4s linear infinite 2s" }} />
                </div>
              </div>
              <p className="font-data text-sm md:text-base text-slate-300 tracking-wide max-w-2xl">
                {subtitle}
              </p>
            </div>

            {/* Status indicators */}
            <div className="absolute inset-0 border border-dashed border-cyan-500/20 rounded-lg pointer-events-none" />
          </div>

          {/* ──────────── CONTROL & FILTER PANEL ──────────── */}
          <div className="mb-10 bg-slate-900/50 border-2 border-cyan-600/20 p-6 rounded-lg backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              
              {/* Region Filter */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                <span className="font-tech text-xs text-slate-400 tracking-widest whitespace-nowrap">REGION:</span>
                <div className="flex flex-wrap gap-2">
                  {regions.map((region) => (
                    <button
                      key={region}
                      onClick={() => setActiveRegion(region)}
                      className={`font-tech text-xs px-3 py-2 rounded border-2 transition-all cursor-pointer ${
                        activeRegion === region
                          ? "bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.3)]"
                          : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                      }`}
                    >
                      {region.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
                {/* Live Monitor Toggle */}
                <button
                  onClick={() => setLiveMonitor(!liveMonitor)}
                  className={`flex items-center gap-2 px-3 py-2 rounded border-2 font-tech text-xs transition-all cursor-pointer ${
                    liveMonitor
                      ? "bg-red-500/20 border-red-400 text-red-300"
                      : "bg-slate-800/50 border-slate-700 text-slate-400"
                  }`}
                >
                  <Radio className="w-3 h-3" />
                  {liveMonitor ? "MONITORING" : "IDLE"}
                </button>

                {/* View Mode Toggle */}
                <div className="flex rounded-lg border-2 border-slate-700 overflow-hidden bg-slate-800/50">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 transition-all ${
                      viewMode === "grid"
                        ? "bg-cyan-500/30 text-cyan-300 border-r-2 border-slate-700"
                        : "text-slate-400 hover:text-slate-300"
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 transition-all ${
                      viewMode === "list"
                        ? "bg-cyan-500/30 text-cyan-300"
                        : "text-slate-400 hover:text-slate-300"
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ──────────── SATELLITE IMAGERY GRID / LIST ──────────── */}
          {viewMode === "grid" ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredSatellites.map((sat) => (
                <div
                  key={sat.id}
                  onClick={() => setSelectedSatellite(sat)}
                  className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-2 border-cyan-500/20 rounded-lg overflow-hidden cursor-pointer transition-all hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                >
                  {/* Image Container */}
                  <div className="relative h-48 bg-slate-950 overflow-hidden">
                    <img
                      src={sat.imageUrl}
                      alt={sat.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    {/* Cloud cover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    
                    {/* Cloud cover badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 px-2.5 py-1.5 rounded border border-cyan-500/30 backdrop-blur-sm">
                      <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-data text-xs text-cyan-300">{sat.cloudCover}%</span>
                    </div>

                    {/* Featured badge */}
                    {sat.featured && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-blue-600/40 border border-blue-400 rounded font-tech text-[9px] text-blue-300 tracking-wider">
                        FEATURED
                      </div>
                    )}

                    {/* Live indicator */}
                    {liveMonitor && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="font-tech text-[9px] text-red-400">LIVE</span>
                      </div>
                    )}
                  </div>

                  {/* Card content */}
                  <div className="p-4 space-y-3">
                    {/* Title */}
                    <h3 className="font-tech text-sm font-semibold text-cyan-300 group-hover:text-cyan-200 transition-colors line-clamp-2">
                      {sat.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-start gap-2 text-xs text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className="font-data line-clamp-2">{sat.location}</span>
                    </div>

                    {/* Metadata grid */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/50">
                      <div className="space-y-1">
                        <p className="font-data text-[10px] text-slate-500 uppercase">Resolution</p>
                        <p className="font-tech text-xs text-cyan-400">{sat.resolution}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-data text-[10px] text-slate-500 uppercase">Sensor</p>
                        <p className="font-tech text-xs text-blue-400">{sat.sensor.split(" ")[0]}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-700/50 pt-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{sat.stats.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        <span>{sat.stats.downloads.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ZoomIn className="w-3 h-3" />
                        <span>{sat.stats.dataSize}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-3 border-t border-slate-700/50">
                      <a
                        href={ensureAbsoluteUrl(sat.liveUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 rounded text-cyan-300 font-tech text-[9px] transition-all"
                      >
                        <Eye className="w-3 h-3" />
                        VIEW
                      </a>
                      <a
                        href={ensureAbsoluteUrl(sat.downloadUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 rounded text-blue-300 font-tech text-[9px] transition-all"
                      >
                        <Download className="w-3 h-3" />
                        DATA
                      </a>
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {selectedSatellite?.id === sat.id && (
                    <div className="absolute inset-0 border-2 border-cyan-400 rounded pointer-events-none" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* LIST / TABLE VIEW */
            <div className="mb-12 bg-slate-900/40 border-2 border-cyan-500/20 rounded-lg overflow-hidden backdrop-blur-sm">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-4 bg-slate-900/80 p-4 border-b border-cyan-500/20 font-tech text-xs text-cyan-300 tracking-widest sticky top-0 z-10">
                <div className="col-span-3">SATELLITE</div>
                <div className="col-span-2">LOCATION</div>
                <div className="col-span-2">CAPTURE</div>
                <div className="col-span-2">SPECS</div>
                <div className="col-span-2 text-right">ACTIONS</div>
              </div>

              {/* Table rows */}
              <div className="divide-y divide-slate-800/50">
                {filteredSatellites
                  .slice()
                  .sort((a, b) => new Date(b.captureDate) - new Date(a.captureDate))
                  .map((sat, idx) => (
                    <div
                      key={sat.id}
                      onClick={() => setSelectedSatellite(sat)}
                      className={`grid grid-cols-12 gap-4 p-4 items-center cursor-pointer transition-all hover:bg-slate-800/30 ${
                        selectedSatellite?.id === sat.id ? "bg-cyan-500/10 border-l-4 border-cyan-400" : ""
                      }`}
                    >
                      {/* Satellite name */}
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                          <div>
                            <p className="font-tech text-sm text-cyan-300 font-semibold">{sat.name}</p>
                            {sat.featured && (
                              <p className="font-data text-xs text-blue-400 mt-0.5">★ Featured</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="col-span-2">
                        <p className="font-data text-xs text-slate-400 truncate">{sat.region}</p>
                      </div>

                      {/* Capture date */}
                      <div className="col-span-2">
                        <p className="font-data text-xs text-slate-400">
                          {new Date(sat.captureDate).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Specs */}
                      <div className="col-span-2">
                        <p className="font-data text-xs text-cyan-300">{sat.resolution}</p>
                        <p className="font-data text-xs text-slate-500 mt-0.5">☁ {sat.cloudCover}%</p>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <a
                          href={ensureAbsoluteUrl(sat.liveUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 rounded text-cyan-400 transition-all"
                          title="View Live"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={ensureAbsoluteUrl(sat.downloadUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 rounded text-blue-400 transition-all"
                          title="Download Data"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {filteredSatellites.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 bg-slate-900/40 border-2 border-dashed border-slate-700 rounded-lg">
              <AlertCircle className="w-12 h-12 text-slate-500 mb-4" />
              <p className="font-tech text-slate-400 tracking-widest">NO DATA AVAILABLE</p>
              <p className="font-data text-sm text-slate-500 mt-2">Try a different region</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
