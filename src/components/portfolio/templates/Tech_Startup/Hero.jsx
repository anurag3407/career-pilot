import React, { useEffect, useRef, useState } from 'react';
import { Rocket, Zap, ArrowRight, Github, Linkedin, ExternalLink, ChevronDown, Sparkles, Code2, Cpu } from 'lucide-react';

/* ──────────────────────────────────────────────────────────────
   Animated Particle Canvas
────────────────────────────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = 55;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 255, 218, ${p.opacity})`;
        ctx.fill();
      });

      // Draw faint connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(100, 255, 218, ${0.07 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   Typing Effect Hook
────────────────────────────────────────────────────────────── */
function useTypingEffect(words, typingSpeed = 80, deletingSpeed = 45, pauseMs = 1800) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState('typing'); // typing | pausing | deleting

  useEffect(() => {
    const word = words[wordIdx];
    let timeout;

    if (phase === 'typing') {
      if (displayed.length < word.length) {
        timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), typingSpeed);
      } else {
        timeout = setTimeout(() => setPhase('pausing'), pauseMs);
      }
    } else if (phase === 'pausing') {
      setPhase('deleting');
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deletingSpeed);
      } else {
        setWordIdx((prev) => (prev + 1) % words.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, wordIdx, words, typingSpeed, deletingSpeed, pauseMs]);

  return displayed;
}

/* ──────────────────────────────────────────────────────────────
   Animated Counter
────────────────────────────────────────────────────────────── */
function AnimatedCounter({ target, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ──────────────────────────────────────────────────────────────
   Tech Startup Hero Component
────────────────────────────────────────────────────────────── */
const TYPING_WORDS = ['Scalable Products', 'Faster MVPs', 'AI-Powered Tools', 'The Future'];

const STATS = [
  { label: 'Projects Shipped', value: 42, suffix: '+' },
  { label: 'Users Impacted', value: 50, suffix: 'K+' },
  { label: 'Uptime SLA', value: 99, suffix: '%' },
  { label: 'Team Members', value: 12, suffix: '' },
];

const SKILLS = ['React', 'Next.js', 'Node.js', 'TypeScript', 'AWS', 'Kubernetes', 'Postgres', 'Redis'];

export default function Hero() {
  const typedText = useTypingEffect(TYPING_WORDS);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a2d 40%, #071626 70%, #050d18 100%)' }}
    >
      {/* ── Particle network ── */}
      <ParticleCanvas />

      {/* ── Ambient blobs ── */}
      <div
        className="absolute top-[-120px] left-[-80px] w-[520px] h-[520px] rounded-full opacity-20 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #64ffda 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-100px] right-[-60px] w-[480px] h-[480px] rounded-full opacity-15 blur-[110px]"
        style={{ background: 'radial-gradient(circle, #7f5af0 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-[30%] right-[15%] w-[280px] h-[280px] rounded-full opacity-10 blur-[80px]"
        style={{ background: 'radial-gradient(circle, #2cb5e8 0%, transparent 70%)' }}
      />

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#64ffda 1px, transparent 1px), linear-gradient(90deg, #64ffda 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20 pt-24 pb-16">

          {/* Left column */}
          <div className="flex-1 text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase"
              style={{
                background: 'rgba(100, 255, 218, 0.08)',
                border: '1px solid rgba(100, 255, 218, 0.25)',
                color: '#64ffda',
              }}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              SaaS · Fintech
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight"
              style={{ color: '#ccd6f6' }}
            >
              We Build{' '}
              <span
                className="inline-block"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #64ffda, #7f5af0, #2cb5e8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {typedText}
                <span
                  className="inline-block w-[3px] h-[0.85em] ml-1 align-middle animate-pulse"
                  style={{ background: '#64ffda', borderRadius: '2px', verticalAlign: 'middle' }}
                />
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed" style={{ color: '#8892b0' }}>
              We are obsessed with shipping products that scale.
              We turn ideas into production-grade software — fast.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_28px_rgba(100,255,218,0.35)]"
                style={{
                  background: 'linear-gradient(135deg, #64ffda, #2cb5e8)',
                  color: '#0a0f1e',
                }}
              >
                <Rocket className="w-4 h-4" />
                View Projects
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105"
                style={{
                  border: '1px solid rgba(100, 255, 218, 0.3)',
                  color: '#64ffda',
                  background: 'rgba(100, 255, 218, 0.05)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(100, 255, 218, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(100, 255, 218, 0.6)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(100, 255, 218, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(100, 255, 218, 0.3)';
                }}
              >
                <Zap className="w-4 h-4" />
                Let's Talk
              </a>
            </div>

            {/* Social links */}
            <div className="mt-8 flex items-center gap-5 justify-center lg:justify-start">
              <a
                href="#"
                aria-label="GitHub"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_14px_rgba(100,255,218,0.3)]"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#8892b0',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#64ffda')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8892b0')}
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_14px_rgba(100,255,218,0.3)]"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#8892b0',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#64ffda')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8892b0')}
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Live portfolio"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_14px_rgba(100,255,218,0.3)]"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#8892b0',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#64ffda')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8892b0')}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right column — floating card */}
          <div className="flex-shrink-0 w-full max-w-sm lg:max-w-[360px]">
            <div
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{
                background: 'rgba(13, 26, 45, 0.85)',
                border: '1px solid rgba(100, 255, 218, 0.15)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(100,255,218,0.08)',
              }}
            >
              {/* Card glow */}
              <div
                className="absolute top-0 right-0 w-[180px] h-[180px] rounded-full opacity-20 blur-[60px]"
                style={{ background: 'radial-gradient(circle, #64ffda, transparent 70%)' }}
              />

              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                <span className="ml-3 text-xs font-mono" style={{ color: '#8892b0' }}>~/portfolio</span>
                <Code2 className="w-3.5 h-3.5 ml-auto" style={{ color: '#64ffda' }} />
              </div>

              {/* Terminal output */}
              <div className="font-mono text-xs leading-relaxed space-y-1.5 mb-6">
                <div style={{ color: '#64ffda' }}>$ whoami</div>
                <div style={{ color: '#ccd6f6' }}>{'>'} Full-Stack Engineer &amp; Founder</div>
                <div style={{ color: '#64ffda' }} className="mt-2">$ stack --list</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {SKILLS.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold"
                      style={{
                        background: 'rgba(100, 255, 218, 0.08)',
                        border: '1px solid rgba(100, 255, 218, 0.2)',
                        color: '#64ffda',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div style={{ color: '#64ffda' }} className="mt-2">$ git status</div>
                <div style={{ color: '#28c840' }}>{'>'} On branch: main ✓ Ready to ship</div>
              </div>

              {/* Divider */}
              <div className="h-px mb-5" style={{ background: 'linear-gradient(90deg, transparent, rgba(100,255,218,0.2), transparent)' }} />

              {/* Availability badge */}
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(100, 255, 218, 0.05)', border: '1px solid rgba(100,255,218,0.12)' }}
              >
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#64ffda' }} />
                  <div
                    className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping"
                    style={{ background: '#64ffda', opacity: 0.5 }}
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#64ffda' }}>Available for hire</p>
                  <p className="text-[10px]" style={{ color: '#8892b0' }}>Responding within 24 hours</p>
                </div>
                <Cpu className="w-4 h-4 ml-auto" style={{ color: '#7f5af0' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div
          className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 pb-16"
        >
          {STATS.map(({ label, value, suffix }) => (
            <div
              key={label}
              className="rounded-xl px-5 py-5 text-center transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(13, 26, 45, 0.6)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(100,255,218,0.35)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(100,255,218,0.1)')}
            >
              <p
                className="text-3xl sm:text-4xl font-extrabold tabular-nums"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #64ffda, #7f5af0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <AnimatedCounter target={value} suffix={suffix} />
              </p>
              <p className="text-xs mt-1 font-medium tracking-wide" style={{ color: '#8892b0' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-opacity duration-500 ${scrolled ? 'opacity-0' : 'opacity-100'}`}
      >
        <span className="text-[10px] tracking-widest uppercase" style={{ color: '#8892b0' }}>Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" style={{ color: '#64ffda' }} />
      </div>
    </section>
  );
}
