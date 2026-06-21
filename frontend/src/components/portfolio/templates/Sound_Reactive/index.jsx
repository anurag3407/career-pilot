import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import logger from '../../../../utils/logger';
import { 
  Mic, MicOff, ExternalLink, Github, Linkedin, Mail, Twitter, 
  ChevronDown, Award, Briefcase, User, Code, Volume2, Sparkles
} from 'lucide-react';

// A 3D interactive card component for projects
function ProjectCard({ project, pulseGlowStyle }) {
  const { portfolioData: data } = usePortfolio();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      className="group relative rounded-2xl overflow-hidden bg-[#0d0d1a]/90 border border-white/5 backdrop-blur-xl flex flex-col cursor-pointer perspective-1000 shadow-2xl"
    >
      <div 
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
        style={pulseGlowStyle} 
      />
      
      <div className="h-48 overflow-hidden relative" style={{ transform: "translateZ(20px)" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a]/90 to-transparent z-10"></div>
        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
      </div>
      <div className="p-6 flex-1 flex flex-col z-20 -mt-10" style={{ transform: "translateZ(40px)" }}>
        <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">{project.title}</h3>
        <p className="text-gray-400 mb-6 flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech, j) => (
            <span key={j} className="text-xs px-3 py-1 bg-white/5 text-cyan-300 rounded-full border border-cyan-500/20">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-4" style={{ transform: "translateZ(10px)" }}>
          <a href={project.liveUrl} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg text-sm font-semibold transition-all">
            <ExternalLink className="w-4 h-4" /> Live Demo
          </a>
          <a href={project.githubUrl} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-semibold transition-all border border-white/10">
            <Github className="w-4 h-4" /> Source
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function SoundReactive() {
  const { portfolioData: data } = usePortfolio();

  const [isListening, setIsListening] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256; 
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = stream;

      particlesRef.current = Array.from({ length: 60 }).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 1.5 + 0.5,
        hue: Math.random() * 360
      }));

      setIsListening(true);
      drawVisualizer();
    } catch (err) {
      logger.error('Error accessing microphone:', err);
      alert("Could not access microphone. Please allow microphone permissions.");
    }
  };

  const stopListening = () => {
    if (sourceRef.current) {
      sourceRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsListening(false);
    
    if (containerRef.current) {
      containerRef.current.style.setProperty('--vol', 0);
      containerRef.current.style.setProperty('--glow-opacity', 0);
    }
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const drawVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const avg = sum / bufferLength;
      const vol = avg / 255;
      
      if (containerRef.current) {
        containerRef.current.style.setProperty('--vol', vol);
        containerRef.current.style.setProperty('--glow-opacity', Math.min(vol * 2, 1));
      }
      
      // Clear with slight trailing effect for motion blur, but keep it dark
      ctx.fillStyle = `rgba(5, 5, 12, 0.4)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update particles
      const particles = particlesRef.current;
      particles.forEach((p, index) => {
        // Particles move slightly faster when loud
        const speedMult = 1 + vol * 5;
        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        // Particles stay relatively small to reduce clutter
        ctx.arc(p.x, p.y, p.size * (1 + vol * 1.5), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue + vol * 50}, 100%, 70%, ${0.1 + vol * 0.3})`;
        ctx.fill();

        // Connect nearby particles if moderately loud
        if (vol > 0.4) {
          for (let j = index + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = dx * dx + dy * dy;
            if (dist < 10000) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `hsla(${p.hue}, 100%, 70%, ${0.05 * vol * (1 - dist/10000)})`;
              ctx.stroke();
            }
          }
        }
      });
      
      // Calculate symmetrical bars
      const sliceSize = 50;
      const leftSide = Array.from(dataArray).slice(0, sliceSize).reverse();
      const rightSide = Array.from(dataArray).slice(0, sliceSize);
      const displayData = [...leftSide, ...rightSide];
      const totalBars = displayData.length;
      
      const totalSpacing = (totalBars + 1) * 2;
      const barWidth = (canvas.width - totalSpacing) / totalBars;
      let x = 2;
      
      for (let i = 0; i < totalBars; i++) {
        const val = displayData[i];
        // Reduced max height so they stay in the background
        const barHeight = (val / 255) * canvas.height * 0.25; 
        
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, `hsla(${230 + (i/totalBars) * 130}, 100%, 60%, 0.1)`);
        gradient.addColorStop(0.5, `hsla(${270 + (i/totalBars) * 90}, 100%, 50%, 0.3)`);
        gradient.addColorStop(1, `hsla(${320 + (i/totalBars) * 40}, 100%, 70%, 0.7)`);
        
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, canvas.height - barHeight, barWidth, barHeight, [barWidth / 2, barWidth / 2, 0, 0]);
        } else {
          ctx.rect(x, canvas.height - barHeight, barWidth, barHeight);
        }
        ctx.fill();
        
        // Floating glowing dot at the top of the bar
        if (val > 10) {
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, canvas.height - barHeight - 10 - (vol * 15), barWidth / 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${320 + (i/totalBars) * 40}, 100%, 80%, ${(val / 255) * 0.8})`;
          ctx.fill();
        }
        
        x += barWidth + 2;
      }
    };
    
    draw();
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && isListening) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        particlesRef.current = Array.from({ length: 60 }).map(() => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 1.5 + 0.5,
          hue: Math.random() * 360
        }));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isListening]);
  
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  // Smoother, less aggressive pulsing
  const pulseScaleStyle = {
    transform: 'scale(calc(1 + var(--vol, 0) * 0.05))',
    transition: 'transform 0.05s ease-out'
  };
  
  const pulseGlowStyle = {
    boxShadow: '0 0 calc(10px + var(--vol, 0) * 40px) rgba(217, 70, 239, calc(0.1 + var(--glow-opacity, 0) * 0.2))',
    transition: 'box-shadow 0.05s ease-out'
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#05050c] text-gray-100 font-sans relative overflow-x-hidden selection:bg-fuchsia-500/30"
      style={{ '--vol': 0, '--glow-opacity': 0 }}
    >
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-0 pointer-events-none"
      />
      
      {/* Background ambient gradient - much darker now */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(147, 51, 234, calc(0.05 + var(--glow-opacity, 0) * 0.15)) 0%, transparent 60%)',
          transition: 'background 0.05s ease-out'
        }}
      />

      {/* Mic Control Fab */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center justify-center p-4 rounded-full backdrop-blur-md border ${
            isListening 
              ? 'bg-fuchsia-600 border-fuchsia-400 text-white shadow-[0_0_20px_rgba(217,70,239,0.5)]' 
              : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20 hover:scale-105'
          } transition-all duration-300 group`}
          title="Toggle Sound Reactive Mode"
          style={isListening ? pulseScaleStyle : {}}
        >
          {isListening ? (
            <div className="relative">
              <Mic className="w-5 h-5 animate-pulse" />
              <div className="absolute inset-0 rounded-full animate-ping border border-white opacity-40"></div>
            </div>
          ) : (
            <MicOff className="w-5 h-5 group-hover:text-white transition-colors" />
          )}
        </button>
        {!isListening && (
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-[#0d0d1a]/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap hidden md:flex items-center gap-2 shadow-xl">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Enable mic for reaction!
          </div>
        )}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 flex flex-col gap-32">
        
        {/* HERO SECTION */}
        <section className="min-h-[75vh] flex flex-col items-center justify-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 relative group"
          >
            <div 
              className="absolute inset-0 rounded-full blur-xl bg-gradient-to-tr from-cyan-500 via-fuchsia-500 to-purple-600 opacity-30 transition-opacity duration-500"
              style={pulseGlowStyle}
            ></div>
            <div 
              className="relative rounded-full p-1.5 bg-gradient-to-tr from-cyan-500/50 via-fuchsia-500/50 to-purple-600/50"
              style={pulseScaleStyle}
            >
              <img 
                src={data.personal.avatar} 
                alt={data.personal.name} 
                className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-[#05050c] object-cover"
              />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-4 relative"
          >
            <span 
              className="text-white inline-block drop-shadow-md"
              style={{
                transform: 'skewX(calc(var(--vol, 0) * -5deg))',
                transition: 'transform 0.05s linear'
              }}
            >
              {data.personal.name}
            </span>
          </motion.h1>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-cyan-200/70 font-light mb-10 tracking-wide"
          >
            {data.personal.title}
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-4"
          >
            {data.socials.github && <a href={data.socials.github} className="p-3.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"><Github className="w-5 h-5 text-gray-300" /></a>}
            {data.socials.linkedin && <a href={data.socials.linkedin} className="p-3.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"><Linkedin className="w-5 h-5 text-gray-300" /></a>}
            {data.socials.twitter && <a href={data.socials.twitter} className="p-3.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"><Twitter className="w-5 h-5 text-gray-300" /></a>}
            <a href={`mailto:${data.socials.email}`} className="p-3.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"><Mail className="w-5 h-5 text-gray-300" /></a>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-10 animate-bounce"
          >
            <ChevronDown className="w-8 h-8 text-white/20" />
          </motion.div>
        </section>

        {/* ABOUT SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative">
          <div className="space-y-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold flex items-center gap-4">
              <User className="text-fuchsia-400 w-8 h-8" /> 
              About Me
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full shadow-sm"></div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {data.personal.bio}
            </p>
            <div className="flex gap-6">
              <div className="bg-[#0d0d1a]/80 border border-white/5 p-6 rounded-2xl flex-1 text-center shadow-lg backdrop-blur-sm" style={pulseScaleStyle}>
                <div className="text-4xl font-bold text-cyan-400 mb-2">{data.stats.yearsExperience}+</div>
                <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Years Exp</div>
              </div>
              <div className="bg-[#0d0d1a]/80 border border-white/5 p-6 rounded-2xl flex-1 text-center shadow-lg backdrop-blur-sm" style={pulseScaleStyle}>
                <div className="text-4xl font-bold text-fuchsia-400 mb-2">{data.stats.projectsCompleted}+</div>
                <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Projects</div>
              </div>
            </div>
          </div>
          <div className="relative z-10">
            <div className="bg-[#0d0d1a]/80 border border-white/5 rounded-3xl p-8 backdrop-blur-md relative z-10 shadow-2xl">
              <h3 className="text-xl font-bold mb-8 text-white flex items-center gap-3">
                <Code className="w-5 h-5 text-cyan-400" /> Technical Skills
              </h3>
              <div className="space-y-6">
                {data.skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-gray-200">{skill.name}</span>
                      <span className="text-cyan-400/80">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 rounded-full relative"
                        style={{ 
                          width: `${skill.level}%`,
                          opacity: 'calc(0.7 + var(--vol, 0) * 0.5)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section>
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Featured Projects</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.projects.map((project, i) => (
              <ProjectCard key={i} project={project} pulseGlowStyle={pulseGlowStyle} />
            ))}
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Experience</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full mx-auto"></div>
          </div>
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-white/10">
            {data.experience.map((exp, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#05050c] bg-fuchsia-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" style={pulseScaleStyle}>
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] bg-[#0d0d1a]/80 border border-white/5 backdrop-blur-md p-8 rounded-3xl hover:bg-white/5 transition-colors shadow-xl">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-3 gap-3">
                    <h3 className="font-bold text-xl text-white">{exp.role}</h3>
                    <span className="text-xs text-cyan-300 font-bold bg-cyan-900/30 border border-cyan-500/30 px-3 py-1.5 rounded-full whitespace-nowrap">{exp.period}</span>
                  </div>
                  <div className="text-fuchsia-300 font-medium text-md mb-4">{exp.company}</div>
                  <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section>
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Testimonials</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.testimonials.map((test, i) => (
              <div key={i} className="bg-[#0d0d1a]/80 border border-white/5 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden group shadow-xl">
                <div className="absolute top-4 right-4 opacity-10">
                  <Award className="w-12 h-12 text-white" />
                </div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <img src={test.avatar} alt={test.name} className="w-14 h-14 rounded-full border-2 border-cyan-400/50" />
                  <div>
                    <h4 className="font-bold text-md text-white">{test.name}</h4>
                    <p className="text-xs font-medium text-fuchsia-400">{test.role}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm italic relative z-10 leading-relaxed group-hover:text-gray-300 transition-colors">"{test.text}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER / CONTACT */}
        <footer className="border-t border-white/5 pt-20 pb-32 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Let's work together</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Currently available for freelance opportunities or full-time roles. 
            If you have a project that needs some creative juice, I'd love to hear about it.
          </p>
          <a 
            href={`mailto:${data.socials.email}`} 
            className="inline-block px-10 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold rounded-full shadow-lg transition-all duration-300"
            style={pulseScaleStyle}
          >
            Say Hello 👋
          </a>
          <div className="mt-20 text-xs font-medium text-gray-600 flex items-center justify-center gap-2">
            <Volume2 className="w-4 h-4" /> Sound Reactive Portfolio Theme
          </div>
        </footer>

      </div>
    </div>
  );
}
