import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gauge, 
  Zap, 
  Flag, 
  Timer, 
  Cpu, 
  Globe, 
  Award, 
  TrendingUp, 
  ChevronsRight, 
  RotateCcw, 
  Code, 
  Globe, 
  Zap, 
  ExternalLink,
  Flame
} from 'lucide-react';

export default function F1Hero({ data }) {
  // Default stunning F1 Racing template mock data
  const defaultData = {
    personalInfo: {
      name: "Alex Verstappen",
      title: "Lead Full-Stack Developer & Performance Architect",
      location: "Monaco / Remote",
      avatar: null,
      bio: "Engineering high-performance web systems with sub-millisecond response times. Specializing in React, Node.js, Go, and high-octane system architecture.",
      socials: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com"
      }
    },
    stats: {
      driverNumber: "33",
      team: "Red Bull Technical Labs",
      experience: "8 Yrs",
      podiums: "42 Projects",
      fastestLaps: "99.9% Uptime",
      status: "ACTIVE CONTRACT"
    },
    skills: [
      { name: "React / Next.js", rating: 98, type: "Engine" },
      { name: "Node.js / Go", rating: 95, type: "Turbocharger" },
      { name: "Cloud & Devops", rating: 92, type: "Aerodynamics" },
      { name: "DB Performance", rating: 96, type: "Tires" }
    ]
  };

  const profile = data?.personalInfo ? data.personalInfo : defaultData.personalInfo;
  const stats = data?.stats ? data.stats : defaultData.stats;
  const skills = data?.skills ? data.skills : defaultData.skills;

  // --- GRID LIGHTS STATE ---
  const [lightCount, setLightCount] = useState(0);
  const [isRaceStarted, setIsRaceStarted] = useState(false);
  const [lightsOut, setLightsOut] = useState(false);

  // --- TELEMETRY STATE ---
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [gear, setGear] = useState('N');
  const [drsActive, setDrsActive] = useState(false);
  const [lapTime, setLapTime] = useState({ min: 0, sec: 0, ms: 0 });
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Reference for telemetry loops
  const requestRef = useRef();
  const previousTimeRef = useRef();
  // Ref to track the speed burst interval for cleanup
  const speedBurstRef = useRef(null);

  // Cleanup speed burst interval on component unmount
  useEffect(() => {
    return () => {
      if (speedBurstRef.current) {
        clearInterval(speedBurstRef.current);
      }
    };
  }, []);

  // Trigger grid lights sequence
  useEffect(() => {
    if (isRaceStarted) return;
    
    let interval;
    if (lightCount < 5) {
      interval = setTimeout(() => {
        setLightCount(prev => prev + 1);
      }, 800);
    } else {
      // 5 lights are ON, wait random time between 1s and 2s, then go OUT
      const delay = 1000 + Math.random() * 1000;
      interval = setTimeout(() => {
        setLightCount(0);
        setLightsOut(true);
        setIsRaceStarted(true);
        // Animate a brief speed burst
        triggerSpeedBurst();
      }, delay);
    }
    return () => clearTimeout(interval);
  }, [lightCount, isRaceStarted]);

  // Restart lights sequence
  const restartSequence = () => {
    // Clear any running speed burst interval before restarting
    if (speedBurstRef.current) {
      clearInterval(speedBurstRef.current);
      speedBurstRef.current = null;
    }
    setLightCount(0);
    setLightsOut(false);
    setIsRaceStarted(false);
    setSpeed(0);
    setGear('N');
    setRpm(0);
    setDrsActive(false);
    // Reset lap timer to 00:00.00 on restart
    setLapTime({ min: 0, sec: 0, ms: 0 });
    // Restarting the starting lights trigger
    setTimeout(() => setLightCount(1), 100);
  };

  // Speed burst animation on lights out
  const triggerSpeedBurst = () => {
    let currentSpeed = 0;
    // Store interval in ref so it can be cleared on unmount or restart
    speedBurstRef.current = setInterval(() => {
      currentSpeed += Math.floor(Math.random() * 25) + 10;
      if (currentSpeed >= 320) {
        currentSpeed = 320 + Math.floor(Math.random() * 25);
        clearInterval(speedBurstRef.current);
        speedBurstRef.current = null;
      }
      setSpeed(currentSpeed);
      // Simulate RPM and Gear shifting
      const calculatedGear = Math.min(8, Math.floor(currentSpeed / 40) + 1);
      setGear(calculatedGear);
      setRpm(Math.floor((currentSpeed % 40) / 40 * 5000) + 7000);
      if (currentSpeed > 280) setDrsActive(true);
    }, 50);
  };

  // Telemetry updates based on mouse movement/hover on right panel
  const handleTelemetryHover = (e) => {
    if (!isRaceStarted) return;
    
    // Simulate high-performance action on telemetry card hover
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element
    
    // Calculate values based on coordinates
    const speedFactor = (x / rect.width) * 100 + (y / rect.height) * 100;
    const targetSpeed = Math.min(345, Math.floor(180 + speedFactor * 0.8));
    const targetGear = Math.min(8, Math.floor(targetSpeed / 42) + 1);
    const targetRpm = Math.floor(8000 + (speedFactor % 50) * 80);
    
    setSpeed(targetSpeed);
    setGear(targetGear);
    setRpm(targetRpm);
    setDrsActive(targetSpeed > 300);
  };

  // Telemetry settles back to high cruising speeds when mouse leaves
  const handleTelemetryLeave = () => {
    if (!isRaceStarted) return;
    // Cool-down simulation
    setSpeed(284);
    setGear(7);
    setRpm(10500);
    setDrsActive(false);
  };

  // Lap Timer logic
  useEffect(() => {
    let intervalId;
    if (isTimerRunning && isRaceStarted) {
      const startTime = Date.now() - (lapTime.min * 60000 + lapTime.sec * 1000 + lapTime.ms);
      
      intervalId = setInterval(() => {
        const timeDiff = Date.now() - startTime;
        const min = Math.floor(timeDiff / 60000);
        const sec = Math.floor((timeDiff % 60000) / 1000);
        const ms = timeDiff % 1000;
        setLapTime({ min, sec, ms });
      }, 33); // Update approx every 30-33ms for smooth millisecond display
    }
    return () => clearInterval(intervalId);
  }, [isTimerRunning, isRaceStarted]);

  return (
    <section className="relative min-h-screen bg-[#070709] text-white font-sans overflow-hidden flex flex-col justify-between selection:bg-[#E10600] selection:text-white pb-10">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-950/20 via-neutral-950 to-neutral-950 -z-10" />
      
      {/* Tech Grid Pattern overlay to mimic carbon fiber / race track texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />
      
      {/* Racing Red Speed Trails */}
      <div className="absolute top-[30%] -left-64 w-[600px] h-[300px] bg-[#E10600]/5 blur-[150px] rounded-full pointer-events-none -z-10 transform -rotate-12" />
      <div className="absolute bottom-[10%] -right-64 w-[600px] h-[300px] bg-red-600/5 blur-[180px] rounded-full pointer-events-none -z-10" />

      {/* Checkered flag banner divider top */}
      <div className="w-full h-1 bg-[linear-gradient(45deg,#000_25%,transparent_25%),linear-gradient(-45deg,#000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#fff_75%),linear-gradient(-45deg,transparent_75%,#fff_75%)] bg-[size:16px_16px] opacity-15" />

      {/* --- STARTING GRID LIGHTS INTERACTION --- */}
      <div className="container mx-auto px-4 pt-6 flex flex-col items-center">
        <div className="bg-[#121216] border border-neutral-800 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl relative">
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((index) => {
              const isOn = lightCount >= index;
              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  {/* Top LED (Red) */}
                  <div className="relative w-7 h-7 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center overflow-hidden">
                    {isOn && (
                      <div className="absolute inset-0 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_#ef4444]" />
                    )}
                    {/* Tiny reflection dot */}
                    <div className="absolute top-1 left-2 w-1.5 h-1.5 bg-white/40 rounded-full" />
                  </div>
                  {/* Bottom LED (Red backup / status) */}
                  <div className="w-4 h-4 rounded-full bg-neutral-900 border border-neutral-800 relative">
                    {isOn && (
                      <div className="absolute inset-0 bg-red-700 rounded-full shadow-[0_0_8px_#b91c1c]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status Label */}
          <div className="h-8 flex items-center pl-2 border-l border-neutral-800">
            <AnimatePresence mode="wait">
              {!lightsOut ? (
                <motion.span 
                  key="waiting"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="text-xs font-mono text-amber-500 font-bold tracking-widest uppercase pl-4"
                >
                  PREPARING LAP {lightCount}/5
                </motion.span>
              ) : (
                <motion.span 
                  key="lightsout"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="text-xs font-mono text-[#00ff66] font-extrabold tracking-widest uppercase pl-4 flex items-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5 animate-bounce text-[#00ff66]" />
                  LIGHTS OUT!
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Reset button inside grid light panel */}
          {isRaceStarted && (
            <button 
              onClick={restartSequence} 
              className="ml-4 p-1.5 rounded-full hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors duration-150 group"
              title="Restart Lights Sequence"
            >
              <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
            </button>
          )}
        </div>
      </div>

      {/* --- HERO CONTENT MAIN CONTAINER --- */}
      <div className="container mx-auto px-4 mt-8 lg:mt-16 flex-grow flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
          
          {/* LEFT SIDE: PERSONAL PROFILE AND HEADING */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 lg:space-y-8 z-10">
            
            {/* Speed Badge */}
            <div className="inline-flex items-center self-start bg-neutral-900/80 backdrop-blur-sm border-l-4 border-[#E10600] px-3 py-1.5 text-xs font-mono text-neutral-300 gap-2 uppercase tracking-widest rounded-r-md">
              <Zap className="w-3.5 h-3.5 text-[#E10600] animate-pulse" />
              <span>Full Throttle Execution</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-ping" />
            </div>

            {/* Main Portfolio Slogan */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tight leading-none uppercase italic">
                <span className="block text-white">ENGINEERING</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E10600] via-[#ff4d36] to-white relative">
                  SPEED & PRECISION
                </span>
                <span className="block text-white text-3xl md:text-4xl xl:text-5xl mt-2 not-italic font-semibold font-mono tracking-normal">
                  IN EVERY LINE OF CODE.
                </span>
              </h1>
              
              {/* Slanted racing stripes graphic element */}
              <div className="flex gap-1.5 py-2">
                <div className="w-16 h-1 bg-[#E10600] transform -skew-x-12" />
                <div className="w-8 h-1 bg-[#E10600]/70 transform -skew-x-12" />
                <div className="w-4 h-1 bg-[#E10600]/40 transform -skew-x-12" />
                <div className="w-2 h-1 bg-[#E10600]/20 transform -skew-x-12" />
              </div>
            </div>

            {/* Developer Bio Description */}
            <p className="text-neutral-400 text-sm md:text-base xl:text-lg max-w-xl leading-relaxed">
              {profile.bio}
            </p>

            {/* Dynamic Telemetry Stats Grid (e.g. Podiums, Experience) */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-xl">
              <div className="bg-[#121216]/60 backdrop-blur-sm border border-neutral-800 p-3 rounded-lg transform hover:-translate-y-1 transition-all duration-200">
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#E10600]" /> Podiums
                </div>
                <div className="text-base md:text-lg font-bold font-mono tracking-wide text-white">
                  {stats.podiums}
                </div>
              </div>
              <div className="bg-[#121216]/60 backdrop-blur-sm border border-neutral-800 p-3 rounded-lg transform hover:-translate-y-1 transition-all duration-200">
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-[#ffe600]" /> Race Pace
                </div>
                <div className="text-base md:text-lg font-bold font-mono tracking-wide text-white">
                  {stats.experience}
                </div>
              </div>
              <div className="bg-[#121216]/60 backdrop-blur-sm border border-neutral-800 p-3 rounded-lg transform hover:-translate-y-1 transition-all duration-200">
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Timer className="w-3 h-3 text-[#00ff66]" /> Fast Lap
                </div>
                <div className="text-base md:text-lg font-bold font-mono tracking-wide text-[#00ff66]">
                  {stats.fastestLaps}
                </div>
              </div>
            </div>

            {/* CALL TO ACTIONS: Custom Racing Triggers */}
            <div className="flex flex-wrap gap-4 pt-2">
              {/* PRIMARY ACTION: "Start Lap" / Hire Me */}
              <a 
                href="#contact"
                className="relative group overflow-hidden bg-[#E10600] text-white px-8 py-4 font-mono font-extrabold uppercase tracking-widest text-sm rounded-none border border-[#E10600] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-[#E10600]/25 transform -skew-x-12"
              >
                {/* Checkered flag hover background */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#000_25%,transparent_25%),linear-gradient(-45deg,#000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#fff_75%),linear-gradient(-45deg,transparent_75%,#fff_75%)] bg-[size:8px_8px] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2 transform skew-x-12">
                  <Flag className="w-4 h-4" />
                  <span>START THE LAP</span>
                  <ChevronsRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              {/* SECONDARY ACTION: Telemetry Report / View Work */}
              <a 
                href="#projects"
                className="relative group overflow-hidden bg-transparent hover:bg-white/5 text-white px-8 py-4 font-mono font-bold uppercase tracking-widest text-sm rounded-none border border-neutral-700 hover:border-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 transform -skew-x-12"
              >
                <div className="relative flex items-center gap-2 transform skew-x-12">
                  <Cpu className="w-4 h-4 text-neutral-400 group-hover:text-[#E10600] transition-colors" />
                  <span>TELEMETRY REPORT</span>
                </div>
              </a>
            </div>

            {/* Social Channels / Pit Lane Connections - guarded against missing socials */}
            {profile.socials && (
              <div className="flex items-center gap-6 pt-4 text-neutral-500 text-xs font-mono">
                <span className="uppercase tracking-wider">Pit Lane Links:</span>
                <div className="flex gap-4">
                  {profile.socials?.github && (
                    <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-white text-neutral-400 transition-colors">
                      <Code className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {profile.socials?.linkedin && (
                    <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white text-neutral-400 transition-colors">
                      <Globe className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {profile.socials?.twitter && (
                    <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white text-neutral-400 transition-colors">
                      <Zap className="w-4.5 h-4.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDE: TELEMETRY HUD / COCKPIT INTERACTIVE DIALS */}
          <div className="lg:col-span-5 z-10 w-full">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              onMouseMove={handleTelemetryHover}
              onMouseLeave={handleTelemetryLeave}
              className="bg-[#121216]/80 backdrop-blur-md border border-neutral-800 hover:border-neutral-700/80 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden select-none transition-all duration-300"
            >
              {/* Accent top border mimicking mechanical engine plates */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E10600] via-[#ffe600] to-[#00ff66]" />

              {/* Checkered flag banner top right inside HUD */}
              <div className="absolute top-4 right-4 w-12 h-6 bg-[linear-gradient(45deg,#000_25%,transparent_25%),linear-gradient(-45deg,#000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#fff_75%),linear-gradient(-45deg,transparent_75%,#fff_75%)] bg-[size:8px_8px] opacity-10" />

              {/* HUD Header / Driver profile info */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#E10600] text-[9px] font-mono font-bold tracking-wider rounded-sm">
                      {stats.status}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {profile.location}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold font-mono tracking-tight text-white uppercase mt-1">
                    {profile.name}
                  </h2>
                  <p className="text-xs font-mono text-neutral-400">
                    {stats.team}
                  </p>
                </div>

                {/* Big Driver Number */}
                <div className="text-right">
                  <span className="block text-4xl font-black font-mono tracking-tighter text-[#E10600]/80 italic">
                    #{stats.driverNumber}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                    CAR NO.
                  </span>
                </div>
              </div>

              {/* Interactive Telemetry HUD Grid */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Telemetry Gauge: Gear */}
                <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex justify-between">
                    <span>GEAR RATIO</span>
                    <Cpu className="w-3 h-3 text-[#E10600] group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                  <div className="flex items-center justify-center flex-grow">
                    <span className="text-6xl font-black font-mono text-white select-none">
                      {gear}
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-neutral-500 text-center uppercase tracking-widest">
                    PADDLE SHIFTED
                  </div>
                </div>

                {/* Telemetry Gauge: Speed */}
                <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
                  {/* DRS Status */}
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-widest flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${drsActive ? 'bg-[#00ff66] animate-ping' : 'bg-neutral-600'}`} />
                    <span className={drsActive ? 'text-[#00ff66]' : 'text-neutral-500'}>DRS</span>
                  </div>

                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                    VELOCITY
                  </div>
                  <div className="flex flex-col items-center justify-center flex-grow">
                    <span className="text-4xl font-extrabold font-mono text-white tracking-tighter">
                      {isRaceStarted ? speed : '---'}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400 font-bold uppercase mt-0.5 tracking-wider">
                      KM / H
                    </span>
                  </div>
                  
                  {/* Speed Bar Visualizer */}
                  <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-red-600 to-[#E10600] h-full transition-all duration-150" 
                      style={{ width: `${(speed / 345) * 100}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Dynamic RPM Engine Band */}
              <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-4 space-y-2.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                  <span className="uppercase tracking-wider">ENGINE TELEMETRY (RPM)</span>
                  <span className={rpm > 11000 ? 'text-[#E10600] font-bold animate-pulse' : 'text-neutral-300'}>
                    {isRaceStarted ? `${rpm.toLocaleString()} RPM` : '0 RPM'}
                  </span>
                </div>
                
                {/* RPM LED Bar */}
                <div className="flex gap-1">
                  {Array.from({ length: 20 }).map((_, index) => {
                    const threshold = (index / 20) * 13500;
                    const isActive = isRaceStarted && rpm >= threshold;
                    
                    // F1 LED pattern: Green -> Red -> Blue
                    let activeColorClass = 'bg-[#00ff66] shadow-[0_0_8px_#00ff66]';
                    let idleColorClass = 'bg-[#00ff66]/10 border border-neutral-900';
                    
                    if (index >= 14) {
                      activeColorClass = 'bg-blue-500 shadow-[0_0_8px_#3b82f6]';
                      idleColorClass = 'bg-blue-500/10 border border-neutral-900';
                    } else if (index >= 8) {
                      activeColorClass = 'bg-[#E10600] shadow-[0_0_8px_#E10600]';
                      idleColorClass = 'bg-[#E10600]/10 border border-neutral-900';
                    }

                    return (
                      <div 
                        key={index} 
                        className={`h-4 flex-grow rounded-sm transition-all duration-100 ${isActive ? activeColorClass : idleColorClass}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Lap Timer HUD Card */}
              <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#E10600]/10 border border-[#E10600]/30 rounded-lg">
                    <Timer className="w-5 h-5 text-[#E10600]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                      LAP TIMING
                    </div>
                    <div className="text-xl font-bold font-mono tracking-widest text-white">
                      {isRaceStarted ? (
                        `${String(lapTime.min).padStart(2, '0')}:${String(lapTime.sec).padStart(2, '0')}.${String(Math.floor(lapTime.ms / 10)).padStart(2, '0')}`
                      ) : (
                        '00:00.00'
                      )}
                    </div>
                  </div>
                </div>

                {/* DRS and Control Buttons */}
                <button 
                  onClick={() => setIsTimerRunning(prev => !prev)}
                  className="px-3 py-1.5 border border-neutral-800 hover:border-neutral-600 bg-neutral-900 text-[10px] font-mono font-bold tracking-wider rounded-md transition-colors hover:text-white uppercase"
                  disabled={!isRaceStarted}
                >
                  {isTimerRunning ? 'PAUSE TIMING' : 'RESUME LAP'}
                </button>
              </div>

              {/* Skills breakdown - represented as performance upgrades */}
              <div className="space-y-3 pt-2">
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                  CAR SPECS & POWER UNITS
                </div>
                
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-white font-medium flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                          {skill.name}
                        </span>
                        <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-wide">
                          {skill.type} • <span className="text-neutral-300">{skill.rating}%</span>
                        </span>
                      </div>
                      {/* Rating Progress Track */}
                      <div className="w-full bg-neutral-950 border border-neutral-900 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: isRaceStarted ? `${skill.rating}%` : '0%' }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                          className="bg-gradient-to-r from-red-600 via-[#E10600] to-neutral-200 h-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>

      {/* --- BOTTOM SECTION: SPEED TRAILS & FLAG ACCENTS --- */}
      <div className="container mx-auto px-4 mt-8 lg:mt-16 text-center select-none">
        <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
          DESIGN CONCEPT INSPIRED BY THE RED BULL RB20 & MONACO GRAND PRIX HUD SYSTEMS
        </p>
      </div>
    </section>
  );
}
