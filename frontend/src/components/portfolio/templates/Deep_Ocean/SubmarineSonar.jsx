import React, { useState, useEffect, useRef } from 'react';
import './SubmarineSonar.css';
import {
  Compass,
  Radio,
  Waves,
  ShieldAlert,
  Volume2,
  Cpu,
  Layers,
  FolderGit2,
  Activity,
  Info,
  Gauge,
  Terminal,
  ChevronRight,
  Maximize2,
  Anchor,
  HelpCircle,
  Eye,
  GitPullRequest
} from 'lucide-react';

// Sonar data with custom depth bands for rich interactive scanning
const CONTACTS = [
  {
    id: 'react',
    label: 'React & Ecosystem',
    category: 'tech',
    depthMin: 500,
    depthMax: 4000,
    x: 25, 
    y: -30,
    range: '240m',
    bearing: '135°',
    strength: '95%',
    frequency: '48.2 kHz',
    description: 'Building performance-optimized, stateful, single-page application systems with fine-grained UI controls.',
    details: 'Advanced knowledge of concurrent rendering, custom hook synthesis, and server-side components. Expert in state orchestration libraries.',
  },
  {
    id: 'tailwind',
    label: 'Tailwind CSS UI Architecture',
    category: 'tech',
    depthMin: 500,
    depthMax: 3000,
    x: -45,
    y: 20,
    range: '380m',
    bearing: '290°',
    strength: '92%',
    frequency: '42.5 kHz',
    description: 'High-fidelity, responsive typography, custom visual layouts, and responsive fluid motion.',
    details: 'Orchestrating robust layout structures, bespoke micro-interactions, hardware-accelerated animations, and unified design token systems.',
  },
  {
    id: 'nodejs',
    label: 'Node.js & Live WebSockets',
    category: 'tech',
    depthMin: 1500,
    depthMax: 7000,
    x: -20,
    y: -40,
    range: '290m',
    bearing: '315°',
    strength: '88%',
    frequency: '39.8 kHz',
    description: 'High-concurrency servers, socket streams, and lightweight real-time communications.',
    details: 'Specialized in asynchronous execution management, scalable cluster setups, load optimization, and real-time streaming sockets.',
  },
  {
    id: 'databases',
    label: 'PostgreSQL & Realtime SQL',
    category: 'tech',
    depthMin: 2500,
    depthMax: 8500,
    x: 40,
    y: 35,
    range: '410m',
    bearing: '45°',
    strength: '85%',
    frequency: '35.1 kHz',
    description: 'Designing highly reliable data systems, connection pooling, and optimized query plans.',
    details: 'Proficient in complex relational mappings, transaction controls, custom indexing, and high-load database syncing layers.',
  },
  {
    id: 'careerpilot',
    label: 'Career Pilot Platform',
    category: 'projects',
    depthMin: 500,
    depthMax: 5000,
    x: 10,
    y: 50,
    range: '520m',
    bearing: '170°',
    strength: '96%',
    frequency: '50.1 kHz',
    description: 'AI-driven system optimizing user professional profiles and real-time resume modifications.',
    details: 'Engineered high-performance template rendering modules allowing dynamic updates across multiple client viewpoints.',
  },
  {
    id: 'dataconnect',
    label: 'Data Connect Core Gateway',
    category: 'projects',
    depthMin: 5000,
    depthMax: 10000,
    x: -55,
    y: -25,
    range: '620m',
    bearing: '240°',
    strength: '90%',
    frequency: '44.0 kHz',
    description: 'Transactional synchronization mechanism linking cloud structures to local SQL backends.',
    details: 'Constructed query validation modules, schema sync engines, and custom high-availability fallback configurations.',
  },
  {
    id: 'aianalytics',
    label: 'Neural Parse Engine',
    category: 'projects',
    depthMin: 3000,
    depthMax: 9000,
    x: 35,
    y: -50,
    range: '680m',
    bearing: '30°',
    strength: '94%',
    frequency: '46.7 kHz',
    description: 'Semantic data parsing model optimizing contextual alignment for career recommendations.',
    details: 'Engineered advanced query-response embeddings, custom vector-search metrics, and highly tailored semantic indexing.',
  },
  {
    id: 'senior_eng',
    label: 'Principal Engineer Contribution',
    category: 'milestones',
    depthMin: 2000,
    depthMax: 8000,
    x: -30,
    y: 45,
    range: '490m',
    bearing: '210°',
    strength: '98%',
    frequency: '55.2 kHz',
    description: 'Directing technical strategy, system refactoring, and orchestrating reusable components.',
    details: 'Supervised core system re-engineering, established performance baseline metrics, and decreased overall initial load times.',
  },
  {
    id: 'open_source',
    label: 'Open Source Framework Architect',
    category: 'milestones',
    depthMin: 4000,
    depthMax: 10000,
    x: 50,
    y: 15,
    range: '550m',
    bearing: '80°',
    strength: '91%',
    frequency: '41.3 kHz',
    description: 'Authored state management optimizations and visual canvas tools used in the ecosystem.',
    details: 'Created low-latency canvas drawing pipelines, dynamic state distribution nodes, and comprehensive documentation models.',
  }
];

export default function SubmarineSonar() {
  const [depth, setDepth] = useState(2500);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedContact, setSelectedContact] = useState(CONTACTS[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pingPulseActive, setPingPulseActive] = useState(false);
  const [sysTime, setSysTime] = useState('');
  
  // Update system clock for military telemetry readout
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      setSysTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio API Synthesizer for an authentic submarine sonar "ping"
  const playSonarPing = (customFreq = 880) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(customFreq, ctx.currentTime);
      // Sweep/decay frequency downwards (classic underwater sonar sound)
      osc.frequency.exponentialRampToValueAtTime(customFreq / 2, ctx.currentTime + 0.4);
      
      // Amplitude decay (ping + echo trail)
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.6);
      
      // Trigger visual sweep ping light
      setPingPulseActive(true);
      setTimeout(() => setPingPulseActive(false), 300);
    } catch (e) {
      console.warn('Audio synthesis not allowed or supported by browser:', e);
    }
  };

  // Filter contacts based on category and current active depth
  const filteredContacts = CONTACTS.filter(contact => {
    const matchesCategory = activeCategory === 'all' || contact.category === activeCategory;
    const matchesDepth = depth >= contact.depthMin && depth <= contact.depthMax;
    return matchesCategory && matchesDepth;
  });

  // Automatically select the first visible contact when filtering shifts available items
  useEffect(() => {
    if (filteredContacts.length > 0) {
      const isStillVisible = filteredContacts.some(c => c.id === selectedContact.id);
      if (!isStillVisible) {
        setSelectedContact(filteredContacts[0]);
      }
    }
  }, [depth, activeCategory]);

  const selectContact = (contact) => {
    setSelectedContact(contact);
    // Ping pitch depends on contact range (closer = higher pitch)
    const rangeVal = parseInt(contact.range);
    const pitch = 1200 - (rangeVal * 1.2);
    playSonarPing(pitch);
  };

  // Environment metrics derived from slider depth
  const hydrostaticPressure = Math.round((depth * 0.0987) + 1); // 1 atm per 10 meters roughly
  const waterTemp = Math.max(1.8, (28 - (depth / 320))).toFixed(1);
  const acousticScattering = Math.min(98, Math.round((depth / 105) + 8));

  return (
    <section className="w-full bg-[#020713] text-cyan-100 overflow-hidden relative border-t border-cyan-900/30 font-sans selection:bg-cyan-500/30 selection:text-white">
      


      {/* Atmospheric deep sea grid pattern background overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #22d3ee 1px, transparent 1px),
                            linear-gradient(to right, #0891b2 1px, transparent 1px),
                            linear-gradient(to bottom, #0891b2 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        }}
      />

      {/* Bioluminescent soft glow circles floating in background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-950/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-blue-950/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        
        {/* Terminal Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-cyan-500/20 pb-8 mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-cyan-400 font-bold">Acoustic Passive Detection</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono">
              SUBMARINE <span className="text-cyan-400 glow-cyan-text">SONAR</span>
            </h2>
            <p className="text-sm text-cyan-300/60 mt-1 max-w-xl">
              Interact with the active telemetry grid and depth scanner to discover deep-sea career contacts, technical skills, and milestones.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 border border-cyan-500/20 rounded-xl p-3 backdrop-blur-md self-stretch md:self-auto justify-between">
            <div className="text-left font-mono">
              <div className="text-[10px] text-cyan-500/60 uppercase">SYSTEM CLOCK</div>
              <div className="text-lg font-bold text-cyan-300 tracking-wider">{sysTime || '18:10:02'}</div>
            </div>
            <div className="h-8 w-px bg-cyan-500/20" />
            <button type="button" 
              onClick={() => { setSoundEnabled(!soundEnabled); playSonarPing(soundEnabled ? 440 : 880); }}
              className={`p-2 rounded-lg transition-all border ${
                soundEnabled 
                  ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 hover:bg-cyan-500/20' 
                  : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30'
              }`}
              title={soundEnabled ? "Disable Sonar Audio Pings" : "Enable Sonar Audio Pings"}
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Radar Screen Section (Lanscape Left - 7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-between bg-slate-950/60 border border-cyan-500/15 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
            
            {/* Visual scan feedback indicators */}
            <div className="absolute top-4 left-6 right-6 flex justify-between font-mono text-[10px] text-cyan-500/50 pointer-events-none w-[90%] mx-auto">
              <div className="flex items-center gap-2">
                <Compass className="h-3.5 w-3.5 animate-spin [animation-duration:15s]" />
                <span>HEADING: 324° NW</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-cyan-400 font-bold">SCANNING LAYER: {depth < 2000 ? 'EPIPELAGIC' : depth < 6000 ? 'BATHYPELAGIC' : 'ABYSSAL'}</span>
              </div>
            </div>

            {/* Simulated Grid Target counts */}
            <div className="absolute bottom-4 left-6 font-mono text-[10px] text-cyan-500/50 pointer-events-none">
              GRID SYNC: ACTIVE ({filteredContacts.length} TARGETS FOUND)
            </div>
            
            {/* Big Sonar Circle Outer Wrapper */}
            <div className="w-full flex items-center justify-center my-6 relative aspect-square max-w-[420px] md:max-w-[450px]">
              
              {/* Pulsing overlay that triggers on active manual ping */}
              {pingPulseActive && (
                <div className="absolute inset-0 bg-cyan-500/[0.04] rounded-full transition-all duration-300 pointer-events-none scale-105 border border-cyan-400/20" />
              )}

              {/* Sonar scope grid circles */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/10 pointer-events-none" />
              <div className="absolute inset-[15%] rounded-full border border-cyan-500/20 pointer-events-none" />
              <div className="absolute inset-[30%] rounded-full border border-cyan-500/15 border-dashed pointer-events-none" />
              <div className="absolute inset-[45%] rounded-full border border-cyan-500/20 pointer-events-none" />
              <div className="absolute inset-[60%] rounded-full border border-cyan-500/10 pointer-events-none animate-pulse" />
              <div className="absolute inset-[75%] rounded-full border border-cyan-500/20 pointer-events-none" />
              
              {/* Radar Crosshairs */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-500/15 pointer-events-none -translate-x-1/2" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-500/15 pointer-events-none -translate-y-1/2" />
              
              {/* Sonar sweep gradient spinning line */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none sonar-sweep-line z-0">
                <div className="absolute top-0 left-1/2 right-0 bottom-1/2 bg-gradient-to-tr from-cyan-400/15 to-transparent origin-bottom-left" style={{ transform: 'skewX(-15deg)' }} />
                <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-t from-cyan-400 to-cyan-500/20 shadow-[0_0_10px_#22d3ee]" />
              </div>

              {/* Central Vessel Node */}
              <div className="absolute w-5 h-5 bg-slate-950 border-2 border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_8px_#22d3ee] z-20 cursor-pointer" onClick={() => playSonarPing(880)}>
                <Anchor className="h-2.5 w-2.5 text-cyan-400" />
              </div>

              {/* Target Contacts Blips Mapping */}
              {filteredContacts.map((contact) => {
                const isSelected = selectedContact.id === contact.id;
                
                // Position calculations around the sonar center
                // Coordinates x, y are percentages from center (e.g. -50 to 50)
                const leftPos = `calc(50% + ${contact.x}%)`;
                const topPos = `calc(50% + ${contact.y}%)`;

                return (
                  <div
                    key={contact.id}
                    className="absolute group z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                    style={{ left: leftPos, top: topPos }}
                  >
                    {/* Ring ripple animations */}
                    <div className={`absolute -inset-3 rounded-full border border-cyan-400 bg-cyan-500/5 radar-ping-ring pointer-events-none ${isSelected ? '[animation-duration:1.2s] border-cyan-300 bg-cyan-400/10' : ''}`} />
                    
                    {/* Interactive central blip element */}
                    <button type="button"
                      onClick={() => selectContact(contact)}
                      className={`relative w-3.5 h-3.5 rounded-full border transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'bg-white border-cyan-300 scale-125 shadow-[0_0_12px_#ffffff,0_0_4px_#22d3ee]' 
                          : 'bg-cyan-400 border-cyan-600 hover:bg-white hover:scale-110 shadow-[0_0_6px_#22d3ee]'
                      }`}
                      aria-label={`Select sonar contact ${contact.label}`}
                    >
                      {/* Active target blip status light */}
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-300"></span>
                        </span>
                      )}
                    </button>

                    {/* Label floating above blip */}
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 border border-cyan-500/30 rounded-md px-1.5 py-0.5 text-[9px] font-mono opacity-40 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none">
                      {contact.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Depth Slider & Visual Depth Meter */}
            <div className="w-full mt-4 bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-4 backdrop-blur-md">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Waves className="h-3.5 w-3.5 text-cyan-400" />
                  DEPTH CONTROL: <span className="text-white">{depth.toLocaleString()}m</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-500/60 uppercase">Hydrostatic Pressure</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-cyan-500/50">500m</span>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-cyan-900/50 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <span className="text-[10px] font-mono text-cyan-500/50">10,000m</span>
              </div>
              
              {/* Depth scan notes feedback */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-cyan-500/10 text-center text-[10px] font-mono">
                <div>
                  <div className="text-cyan-500/50 uppercase">TEMPERATURE</div>
                  <div className="text-cyan-300 font-semibold">{waterTemp}°C</div>
                </div>
                <div className="border-x border-cyan-500/10">
                  <div className="text-cyan-500/50 uppercase">PRESSURE</div>
                  <div className="text-cyan-300 font-semibold">{hydrostaticPressure} ATM</div>
                </div>
                <div>
                  <div className="text-cyan-500/50 uppercase">SCATTER DENSITY</div>
                  <div className="text-cyan-300 font-semibold">{acousticScattering}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Details & Telemetry dashboard (Right - 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Target Filter Categories */}
            <div className="grid grid-cols-4 gap-2 bg-slate-950/60 border border-cyan-500/15 p-2 rounded-2xl backdrop-blur-xl">
              {[
                { id: 'all', label: 'ALL', icon: Radio },
                { id: 'tech', label: 'TECH', icon: Cpu },
                { id: 'projects', label: 'PROJ', icon: FolderGit2 },
                { id: 'milestones', label: 'MILE', icon: Layers },
              ].map(({ id, label, icon: Icon }) => (
                <button type="button"
                  key={id}
                  onClick={() => { setActiveCategory(id); playSonarPing(700); }}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3.5 px-1 rounded-xl text-center font-mono transition-all border cursor-pointer ${
                    activeCategory === id
                      ? 'bg-cyan-500/10 border-cyan-400/60 text-white shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                      : 'bg-slate-900/30 border-slate-900 text-cyan-300/50 hover:bg-cyan-950/20 hover:text-cyan-200'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${activeCategory === id ? 'text-cyan-400' : 'text-cyan-500/40'}`} />
                  <span className="text-[10px] font-bold tracking-wider">{label}</span>
                </button>
              ))}
            </div>

            {/* Main Acoustic Analysis Display Terminal */}
            <div className="bg-slate-950/80 border border-cyan-500/20 rounded-3xl p-6 backdrop-blur-xl flex-1 flex flex-col justify-between relative overflow-hidden">
              
              {/* Corner decor telemetry brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/40 pointer-events-none" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/40 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/40 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/40 pointer-events-none" />

              {selectedContact ? (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* ID Readout & Signal Strength */}
                    <div className="flex justify-between items-center border-b border-cyan-500/10 pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-cyan-400" />
                        <span className="text-[11px] font-mono uppercase text-cyan-400 font-semibold">TARGET CONTACT INVENTORY</span>
                      </div>
                      <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-widest font-semibold animate-pulse">
                        Sig-Strength: {selectedContact.strength}
                      </span>
                    </div>

                    {/* Contact Designation Header */}
                    <div className="mb-4">
                      <h3 className="text-[11px] font-mono uppercase text-cyan-500/60 font-semibold tracking-widest mb-1">
                        DESIGNATION: {selectedContact.category}-{selectedContact.id.toUpperCase()}
                      </h3>
                      <h4 className="text-2xl font-bold tracking-tight text-white font-mono leading-tight">
                        {selectedContact.label}
                      </h4>
                    </div>

                    {/* Acoustic Telemetry Readings */}
                    <div className="grid grid-cols-2 gap-3 bg-slate-900/60 border border-cyan-500/10 p-3.5 rounded-xl font-mono text-[10px] text-cyan-400/80 mb-6">
                      <div className="flex flex-col gap-1 border-r border-cyan-500/10 pr-2">
                        <div className="text-cyan-500/40 uppercase">BEARING POSITION</div>
                        <div className="text-white font-semibold text-xs flex items-center gap-1.5">
                          <Compass className="h-3.5 w-3.5 text-cyan-400" />
                          {selectedContact.bearing}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 pl-2">
                        <div className="text-cyan-500/40 uppercase">ACOUSTIC RANGE</div>
                        <div className="text-white font-semibold text-xs flex items-center gap-1.5">
                          <Waves className="h-3.5 w-3.5 text-cyan-400" />
                          {selectedContact.range}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 border-r border-cyan-500/10 pr-2 pt-2 border-t border-cyan-500/10">
                        <div className="text-cyan-500/40 uppercase">PING FREQUENCY</div>
                        <div className="text-cyan-300 font-bold text-xs">{selectedContact.frequency}</div>
                      </div>
                      <div className="flex flex-col gap-1 pl-2 pt-2 border-t border-cyan-500/10">
                        <div className="text-cyan-500/40 uppercase">SCAN BAND</div>
                        <div className="text-cyan-300 font-bold text-xs">{selectedContact.depthMin}m - {selectedContact.depthMax}m</div>
                      </div>
                    </div>

                    {/* Contact Narratives */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-500/60 uppercase block mb-1">Acoustic Intel Summary</span>
                        <p className="text-sm text-cyan-200/90 leading-relaxed font-light">
                          {selectedContact.description}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-cyan-500/60 uppercase block mb-1">Detailed Technical Logs</span>
                        <p className="text-xs text-cyan-300/75 leading-relaxed font-mono bg-slate-900/40 border border-cyan-500/5 p-3 rounded-lg">
                          {selectedContact.details}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pull Request Mock Button */}
                  <div className="mt-8 border-t border-cyan-500/10 pt-6">
                    <button type="button"
                      onClick={() => { 
                        playSonarPing(980); 
                        setTimeout(() => {
                          window.open('https://github.com/anurag3407/career-pilot/compare/main...Yash191220:Yash-career-pilot:feature/submarine-sonar-theme', '_blank');
                        }, 500);
                      }}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 hover:text-black py-3 px-4 rounded-xl font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-[0_0_16px_rgba(34,211,238,0.25)] hover:shadow-[0_0_24px_rgba(34,211,238,0.45)] hover:scale-[1.01] cursor-pointer"
                    >
                      <GitPullRequest className="h-4 w-4 animate-bounce" />
                      CREATE GITHUB PULL REQUEST
                    </button>
                    <p className="text-[9px] text-center text-cyan-500/50 font-mono mt-2">
                      Secured Hydrographic Channel // Node-Link Encrypted
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 flex-1">
                  <ShieldAlert className="h-12 w-12 text-cyan-500/30 animate-pulse mb-4" />
                  <p className="text-cyan-400 font-mono font-bold">NO CONTACT DETECTED</p>
                  <p className="text-xs text-cyan-500/60 mt-1 max-w-xs font-mono">
                    Adjust depth settings or active filters to scan for acoustic contacts in this oceanic zone.
                  </p>
                </div>
              )}
            </div>

            {/* Small Vessel Stats Telemetry Grid */}
            <div className="bg-slate-950/40 border border-cyan-500/15 rounded-2xl p-4 backdrop-blur-xl">
              <h5 className="text-[10px] font-mono text-cyan-500/50 uppercase tracking-widest mb-3 border-b border-cyan-500/10 pb-2">
                Auxiliary Telemetry System
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono text-[9px]">
                <div className="bg-slate-900/30 border border-cyan-500/5 p-2 rounded-xl">
                  <div className="text-cyan-500/40">SYS TEMP</div>
                  <div className="text-cyan-300 font-bold mt-0.5">14.2°C</div>
                </div>
                <div className="bg-slate-900/30 border border-cyan-500/5 p-2 rounded-xl">
                  <div className="text-cyan-500/40">DECAY RATIO</div>
                  <div className="text-cyan-300 font-bold mt-0.5">0.02%</div>
                </div>
                <div className="bg-slate-900/30 border border-cyan-500/5 p-2 rounded-xl">
                  <div className="text-cyan-500/40">SONAR PULSE</div>
                  <div className="text-cyan-300 font-bold mt-0.5">ACTIVE</div>
                </div>
                <div className="bg-slate-900/30 border border-cyan-500/5 p-2 rounded-xl">
                  <div className="text-cyan-500/40">SYS STATUS</div>
                  <div className="text-green-400 font-bold mt-0.5">NOMINAL</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
