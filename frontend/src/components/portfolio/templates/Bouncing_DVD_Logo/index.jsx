import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { usePortfolio, normalizePortfolioData } from "../../../../context/PortfolioContext.jsx";

// ─── DEFAULT DATA ─────────────────────────────────────────────────────────────
const defaultData = {
  name: "Alex Rivera",
  title: "Full Stack Developer",
  subtitle: "Building the future, one line at a time.",
  email: "alex@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  location: "San Francisco, CA",
  bio: "Passionate developer with 5+ years crafting beautiful, performant web applications. Specialized in scalable systems and delightful user experiences.",
  skills: ["React","TypeScript","Node.js","Python","AWS","Docker","GraphQL","PostgreSQL","Redis","Kubernetes","Figma","Rust"],
  projects: [
    { title: "NeuralLink", description: "AI analytics platform processing 10M+ events/day with real-time dashboards.", tech: ["Python","TensorFlow","React"], github: "https://github.com", link: "https://example.com" },
    { title: "QuantumDB", description: "Distributed database achieving sub-millisecond query times at massive scale.", tech: ["Rust","Kafka","PostgreSQL"], github: "https://github.com", link: "https://example.com" },
    { title: "StellarAPI", description: "Open-source REST framework with 5K+ GitHub stars and active community.", tech: ["Node.js","TypeScript","Docker"], github: "https://github.com", link: "https://example.com" },
    { title: "VoidUI", description: "Design system used by 200+ teams to ship consistent interfaces faster.", tech: ["React","Storybook","Figma"], github: "https://github.com", link: "https://example.com" },
  ],
  experience: [
    { company: "Google", role: "Senior Software Engineer", period: "2022 — Present", desc: "Led infrastructure for Search, impacting 3B+ daily users." },
    { company: "Stripe", role: "Software Engineer", period: "2020 — 2022", desc: "Built payment APIs processing $500B+ in annual volume." },
    { company: "Figma", role: "Frontend Engineer", period: "2018 — 2020", desc: "Shipped real-time collaboration features for 4M+ designers." },
  ],
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const PALETTE = ["#FF006E","#FF8500","#FFD60A","#06FFB4","#00D4FF","#7C3AED","#FF3366","#00FF88","#FF6B00","#B400FF"];
const LOGO_W = 240;
const LOGO_H = 108;
const CORNER_THRESH = 14;
const BASE_SPEED = 6.5;
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

const SKILL_CATEGORIES = {
  Frontend: ["React","TypeScript","Vue","Svelte","Figma","CSS","HTML","Next.js","Tailwind"],
  Backend:  ["Node.js","Python","Rust","Go","Java","PHP","Ruby","Django","FastAPI"],
  Data:     ["PostgreSQL","Redis","MongoDB","Kafka","Elasticsearch","MySQL","GraphQL"],
  DevOps:   ["Docker","Kubernetes","AWS","GCP","Azure","CI/CD","Terraform","Linux"],
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  
  @keyframes scanline{0%{transform:translateY(-100vh)}100%{transform:translateY(100vh)}}
  @keyframes flicker{0%,89%,91%,93%,100%{opacity:1}90%,92%{opacity:.82}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes gridMove{0%{background-position:0 0}100%{background-position:80px 80px}}
  @keyframes starTwinkle{0%,100%{opacity:.15;transform:scale(1)}50%{opacity:.8;transform:scale(1.4)}}
  @keyframes particleFloat{0%{transform:translateY(0) scale(1);opacity:.7}100%{transform:translateY(-120px) scale(0);opacity:0}}
  @keyframes rayPulse{0%,100%{opacity:0}50%{opacity:.18}}
  @keyframes glitch{
    0%,94%,100%{transform:translate(0);clip-path:none;filter:none}
    95%{transform:translate(-3px,1px);clip-path:polygon(0 15%,100% 15%,100% 20%,0 20%);filter:hue-rotate(90deg)}
    97%{transform:translate(3px,-1px);clip-path:polygon(0 55%,100% 55%,100% 60%,0 60%);filter:hue-rotate(-90deg)}
  }
  @keyframes rgbSplit{
    0%,100%{text-shadow:2px 0 #ff0000,-2px 0 #0000ff,0 0 20px currentColor}
    33%{text-shadow:-2px 0 #ff0000,2px 0 #00ff00,0 0 20px currentColor}
    66%{text-shadow:2px 0 #00ffff,-2px 0 #ff0000,0 0 20px currentColor}
  }
  @keyframes shockwave{0%{transform:translate(-50%,-50%) scale(.1);opacity:1}100%{transform:translate(-50%,-50%) scale(8);opacity:0}}
  @keyframes particleBurst{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0}}
  @keyframes winOpen{from{transform:scale(.88) translateY(16px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
  @keyframes achieveSlide{0%{transform:translateX(110%);opacity:0}12%{transform:translateX(0);opacity:1}82%{transform:translateX(0);opacity:1}100%{transform:translateX(110%);opacity:0}}
  @keyframes cornerBlast{0%{opacity:0}8%{opacity:1}88%{opacity:1}100%{opacity:0}}
  @keyframes bootLine{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes timelineGrow{from{height:0}to{height:100%}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes neonPulse{0%,100%{opacity:.55}50%{opacity:1}}
  @keyframes vhsNoise{0%{background-position:0 0}25%{background-position:10px 5px}50%{background-position:-5px 10px}75%{background-position:8px -3px}100%{background-position:0 0}}
  @keyframes confetti{0%{transform:translate(0,0) rotate(0deg);opacity:1}100%{transform:translate(var(--cx),var(--cy)) rotate(var(--cr));opacity:0}}
  @keyframes statusPulse{0%,100%{box-shadow:0 0 0 0 currentColor}50%{box-shadow:0 0 0 5px transparent}}

  .dvd-root{font-family:'Share Tech Mono',monospace;background:#010509;min-height:100vh;overflow:hidden;position:relative;animation:flicker 9s infinite}
  .crt-lines{position:fixed;inset:0;z-index:9999;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.07) 2px,rgba(0,0,0,.07) 4px)}
  .crt-beam{position:fixed;left:0;right:0;height:4px;z-index:9998;pointer-events:none;background:linear-gradient(transparent,rgba(255,255,255,.04),transparent);animation:scanline 7s linear infinite}
  .win-anim{animation:winOpen .28s cubic-bezier(.34,1.56,.64,1) forwards}
  .mono{font-family:'Share Tech Mono',monospace}
  .orb{font-family:'Orbitron',monospace}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:2px}
`;

// ═══════════════════════════════════════════════════════════════════════════════
// BOOT SEQUENCE
// ═══════════════════════════════════════════════════════════════════════════════
function BootSequence({ onComplete, name }) {
  const [lines, setLines] = useState([]);
  const [phase, setPhase] = useState(0); // 0=typing 1=fading
  const msgs = useMemo(() => [
    ["DVD-OS v2.0 ═══════════════════════════════════════════",0,"#06FFB4",true],
    ["BIOS ROM CHECKSUM.......................... PASS",350,"#ffffff66",false],
    ["CPU: RETRO-SYNTH 9000 @ 4.20 GHz.......... OK",620,"#ffffff66",false],
    ["MEMORY TEST 640K.......................... OK",880,"#ffffff66",false],
    ["DETECTING DISPLAY ADAPTER: CRT-HOLOGRAPH.. OK",1120,"#FFD60A",false],
    ["INITIALIZING DVD PHYSICS ENGINE........... OK",1400,"#ffffff66",false],
    ["LOADING PARTICLE SUBSYSTEM................ OK",1640,"#ffffff66",false],
    [`SCANNING FOR USER PROFILE.................`,1880,"#ffffff66",false],
    [`!! IDENTITY CONFIRMED: ${name.toUpperCase()}`,2200,"#FF006E",true],
    ["DECRYPTING PORTFOLIO DATA................. DONE",2500,"#ffffff66",false],
    ["LAUNCHING DVD-OS INTERFACE................ █",2820,"#06FFB4",true],
  ],[name]);

  useEffect(()=>{
    msgs.forEach(([text,delay,color,bold])=>{
      setTimeout(()=>setLines(p=>[...p,{text,color,bold}]),delay);
    });
    setTimeout(()=>setPhase(1),3300);
    setTimeout(onComplete,3900);
  },[]);

  return (
    <div style={{
      position:"fixed",inset:0,background:"#010509",zIndex:99999,
      display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"flex-start",
      padding:"clamp(24px,8vw,80px)",
      opacity:phase===1?0:1,
      transition:"opacity .6s ease",
      pointerEvents:phase===1?"none":"all",
    }}>
      {/* Big logo top */}
      <div className="orb" style={{
        fontSize:"clamp(22px,4.5vw,52px)",fontWeight:900,color:"#06FFB4",
        letterSpacing:".12em",marginBottom:"40px",
        animation:"rgbSplit 2.5s infinite",
        textShadow:"0 0 40px #06FFB4,0 0 80px #06FFB430",
      }}>DVD-OS</div>

      <div style={{width:"100%",maxWidth:620,display:"flex",flexDirection:"column",gap:7}}>
        {lines.map((l,i)=>(
          <div key={i} className="mono" style={{
            fontSize:"clamp(10px,1.4vw,13px)",color:l.color,
            fontWeight:l.bold?"bold":"normal",
            animation:"bootLine .25s ease forwards",
            letterSpacing:".04em",
          }}>{l.text}</div>
        ))}
        {lines.length<msgs.length && (
          <span style={{display:"inline-block",width:10,height:13,background:"#06FFB4",animation:"blink 1s step-end infinite"}}/>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BACKGROUND — stars, particles, rays, grid
// ═══════════════════════════════════════════════════════════════════════════════
function Background({ color }) {
  const stars = useMemo(()=>Array.from({length:120},(_,i)=>({
    id:i,
    x:Math.random()*100,y:Math.random()*100,
    size:.8+Math.random()*1.8,
    delay:Math.random()*5,dur:2+Math.random()*4,
  })),[]);

  const floatParticles = useMemo(()=>Array.from({length:30},(_,i)=>({
    id:i,
    x:Math.random()*100,
    size:2+Math.random()*3,
    delay:Math.random()*8,dur:6+Math.random()*8,
    color:PALETTE[i%PALETTE.length],
    bottom:Math.random()*40,
  })),[]);

  const rays = useMemo(()=>Array.from({length:5},(_,i)=>({
    id:i, left:10+i*18, delay:i*.8, dur:3+i*.5,
  })),[]);

  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden"}}>
      {/* Deep gradient */}
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 80% 60% at 50% 40%,#020e1e 0%,#010509 100%)`}}/>

      {/* VHS noise layer */}
      <div style={{
        position:"absolute",inset:0,opacity:.04,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize:"200px 200px",
        animation:"vhsNoise 2s steps(4) infinite",
      }}/>

      {/* Grid */}
      <div style={{
        position:"absolute",inset:0,
        backgroundImage:`linear-gradient(${color}12 1px,transparent 1px),linear-gradient(90deg,${color}12 1px,transparent 1px)`,
        backgroundSize:"80px 80px",
        animation:"gridMove 5s linear infinite",
        opacity:.5,
      }}/>

      {/* Perspective grid floor */}
      <div style={{
        position:"absolute",bottom:0,left:0,right:0,height:"45%",
        backgroundImage:`linear-gradient(${color}18 1px,transparent 1px),linear-gradient(90deg,${color}18 1px,transparent 1px)`,
        backgroundSize:"80px 80px",
        transform:"perspective(400px) rotateX(65deg)",
        transformOrigin:"bottom center",
        opacity:.35,
      }}/>

      {/* Light rays */}
      {rays.map(r=>(
        <div key={r.id} style={{
          position:"absolute",top:0,left:`${r.left}%`,
          width:"2px",height:"100%",
          background:`linear-gradient(to bottom, ${color}00, ${color}22, ${color}00)`,
          animation:`rayPulse ${r.dur}s ${r.delay}s ease-in-out infinite`,
          transform:`rotate(${(r.id-2)*8}deg)`,transformOrigin:"top center",
        }}/>
      ))}

      {/* Stars */}
      {stars.map(s=>(
        <div key={s.id} style={{
          position:"absolute",
          left:`${s.x}%`,top:`${s.y}%`,
          width:s.size,height:s.size,
          borderRadius:"50%",background:"#fff",
          animation:`starTwinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
        }}/>
      ))}

      {/* Ambient glow orbs */}
      <div style={{position:"absolute",top:"20%",left:"15%",width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${color}0a,transparent 70%)`,filter:"blur(40px)"}}/>
      <div style={{position:"absolute",bottom:"25%",right:"12%",width:250,height:250,borderRadius:"50%",background:`radial-gradient(circle,${PALETTE[4]}08,transparent 70%)`,filter:"blur(50px)"}}/>

      {/* Floating particles */}
      {floatParticles.map(p=>(
        <div key={p.id} style={{
          position:"absolute",
          left:`${p.x}%`,bottom:`${p.bottom}%`,
          width:p.size,height:p.size,borderRadius:"50%",
          background:p.color,boxShadow:`0 0 ${p.size*3}px ${p.color}`,
          animation:`particleFloat ${p.dur}s ${p.delay}s ease-in infinite`,
          opacity:0,
        }}/>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOUNCING IDENTITY CARD
// ═══════════════════════════════════════════════════════════════════════════════
function IdentityCard({ pos, color, name, title, subtitle, trails, shockwaves, speed }) {
  const cardGlow = `0 0 20px ${color}66, 0 0 60px ${color}33, 0 0 100px ${color}18, inset 0 0 30px ${color}0a`;
  const speedPct = Math.min(speed/8, 1);

  return (
    <>
      {/* Neon trails */}
      {trails.map((t,i)=>{
        const a = (i/trails.length);
        return (
          <div key={t.id} style={{
            position:"absolute",
            left:t.x+LOGO_W/2,top:t.y+LOGO_H/2,
            width:Math.max(2, 6*a),height:Math.max(2, 6*a),
            borderRadius:"50%",
            background:t.color,
            opacity:a*.6,
            transform:"translate(-50%,-50%)",
            filter:`blur(${(trails.length-i)*1.2}px)`,
            pointerEvents:"none",
            boxShadow:`0 0 ${(trails.length-i)*4}px ${t.color}`,
          }}/>
        );
      })}

      {/* Shockwaves */}
      {shockwaves.map(s=>(
        <div key={s.id} style={{
          position:"absolute",left:s.x,top:s.y,
          width:"60px",height:"60px",
          border:`2px solid ${s.color}`,borderRadius:"50%",
          animation:"shockwave .7s ease-out forwards",
          pointerEvents:"none",
          boxShadow:`0 0 20px ${s.color}`,
        }}/>
      ))}

      {/* The card */}
      <div style={{
        position:"absolute",left:pos.x,top:pos.y,
        width:LOGO_W,height:LOGO_H,
        border:`2px solid ${color}`,borderRadius:"12px",
        background:`linear-gradient(135deg,${color}18 0%,${color}06 50%,${color}12 100%)`,
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,
        boxShadow:cardGlow,
        userSelect:"none",
        overflow:"hidden",
      }}>
        {/* Animated shimmer */}
        <div style={{
          position:"absolute",inset:0,
          background:`linear-gradient(105deg,transparent 35%,${color}18 50%,transparent 65%)`,
          backgroundSize:"200% 100%",
          animation:"shimmer 2.5s linear infinite",
          borderRadius:"10px",
        }}/>

        {/* Corner markers */}
        {[[0,0],[LOGO_W-14,0],[0,LOGO_H-14],[LOGO_W-14,LOGO_H-14]].map(([lx,ly],i)=>(
          <div key={i} style={{
            position:"absolute",left:lx,top:ly,
            width:12,height:12,
            border:`1.5px solid ${color}aa`,
            borderRadius:"2px",
            boxShadow:`0 0 6px ${color}`,
          }}/>
        ))}

        {/* Status dot */}
        <div style={{
          position:"absolute",top:10,right:14,
          display:"flex",alignItems:"center",gap:5,
        }}>
          <div style={{width:5,height:5,borderRadius:"50%",background:"#06FFB4",boxShadow:"0 0 8px #06FFB4",color:"#06FFB4",animation:"statusPulse 2s infinite"}}/>
          <span className="mono" style={{fontSize:8,color:"#06FFB4aa",letterSpacing:".15em"}}>ONLINE</span>
        </div>

        {/* Speed indicator */}
        <div style={{
          position:"absolute",bottom:8,left:12,
          display:"flex",gap:2,alignItems:"center",
        }}>
          {Array.from({length:5},(_,i)=>(
            <div key={i} style={{
              width:3,height:3+i*2,borderRadius:"1px",
              background:i/4<=speedPct?color:`${color}22`,
              transition:"background .1s",
            }}/>
          ))}
        </div>

        <div className="orb" style={{
          fontSize:18,fontWeight:900,color,
          letterSpacing:".06em",lineHeight:1,
          textShadow:`0 0 16px ${color},0 0 30px ${color}88`,
          position:"relative",zIndex:1,
          animation:"glitch 8s infinite",
        }}>
          {name.split(" ")[0].toUpperCase()}
        </div>
        <div className="mono" style={{
          fontSize:9,color:`${color}cc`,letterSpacing:".22em",
          textTransform:"uppercase",position:"relative",zIndex:1,
        }}>
          {title.split(" ").slice(0,3).join(" ")}
        </div>
        <div className="mono" style={{
          fontSize:8,color:`${color}55`,letterSpacing:".12em",
          position:"relative",zIndex:1,maxWidth:"80%",textAlign:"center",
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
        }}>
          {subtitle}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PARTICLES (collision burst)
// ═══════════════════════════════════════════════════════════════════════════════
function Particles({ particles }) {
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:600,overflow:"hidden"}}>
      {particles.map(p=>(
        <div key={p.id} style={{
          position:"absolute",left:p.x,top:p.y,
          width:p.s,height:p.s,borderRadius:"50%",
          background:p.c,boxShadow:`0 0 ${p.s*2}px ${p.c}`,
          "--dx":`${p.dx}px`,"--dy":`${p.dy}px`,
          animation:`particleBurst ${p.life}ms ease-out forwards`,
          transform:"translate(-50%,-50%)",
        }}/>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFETTI
// ═══════════════════════════════════════════════════════════════════════════════
function Confetti({ active }) {
  const pieces = useMemo(()=>Array.from({length:60},(_,i)=>({
    id:i,
    x:10+Math.random()*80,
    color:PALETTE[i%PALETTE.length],
    size:6+Math.random()*8,
    delay:Math.random()*500,
    cx:(Math.random()-0.5)*window.innerWidth*.8,
    cy:200+Math.random()*400,
    cr:(Math.random()-0.5)*720,
  })),[]);

  if(!active) return null;
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:3001,overflow:"hidden"}}>
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:"absolute",top:"-20px",left:`${p.x}%`,
          width:p.size,height:p.size,
          background:p.color,
          borderRadius:Math.random()>.5?"50%":"2px",
          "--cx":`${p.cx}px`,"--cy":`${p.cy}px`,"--cr":`${p.cr}deg`,
          animation:`confetti 2.5s ${p.delay}ms ease-in forwards`,
        }}/>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACHIEVEMENT
// ═══════════════════════════════════════════════════════════════════════════════
function Achievement({ data, color }) {
  if(!data) return null;
  return (
    <div style={{
      position:"fixed",bottom:"68px",right:"16px",zIndex:2500,
      background:"linear-gradient(135deg,#0a0f1a,#0d1525)",
      border:`2px solid ${color}`,borderRadius:"10px",
      padding:"14px 18px",maxWidth:"280px",
      boxShadow:`0 0 40px ${color}55,0 20px 60px rgba(0,0,0,.9)`,
      animation:"achieveSlide 4.5s ease forwards",
    }}>
      <div className="mono" style={{fontSize:9,color,letterSpacing:".2em",marginBottom:5,textShadow:`0 0 8px ${color}`}}>
        ★ ACHIEVEMENT UNLOCKED
      </div>
      <div className="orb" style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:3}}>{data.title}</div>
      <div className="mono" style={{fontSize:10,color:"rgba(255,255,255,.4)"}}>{data.desc}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CORNER CELEBRATION
// ═══════════════════════════════════════════════════════════════════════════════
function CornerCelebration({ active, color }) {
  if(!active) return null;
  return (
    <div style={{
      position:"fixed",inset:0,zIndex:3000,pointerEvents:"none",
      display:"flex",alignItems:"center",justifyContent:"center",
      background:`radial-gradient(circle,${color}28 0%,transparent 65%)`,
      animation:"cornerBlast 2.8s ease forwards",
    }}>
      <div style={{textAlign:"center"}}>
        <div className="orb" style={{
          fontSize:"clamp(36px,7vw,88px)",fontWeight:900,color,
          textShadow:`0 0 60px ${color},0 0 120px ${color}66`,
          animation:"rgbSplit .4s infinite",marginBottom:12,
        }}>PERFECT!</div>
        <div className="mono" style={{
          fontSize:"clamp(14px,2.5vw,24px)",color:"#fff",
          letterSpacing:".4em",textTransform:"uppercase",
        }}>CORNER HIT</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DRAGGABLE OS WINDOW
// ═══════════════════════════════════════════════════════════════════════════════
function OSWindow({ id, title, icon, color, onClose, onFocus, zIndex, children, defaultPos, defaultW, defaultH }) {
  const initX = defaultPos?.x ?? (60+Math.random()*100);
  const initY = defaultPos?.y ?? (50+Math.random()*80);
  const [pos, setPos] = useState({x:initX,y:initY});
  const [w] = useState(defaultW || Math.min(700,window.innerWidth-32));
  const [h] = useState(defaultH || 540);
  const [minimized, setMinimized] = useState(false);
  const dragging = useRef(false);
  const offset = useRef({x:0,y:0});

  const onTitleDown = useCallback((e)=>{
    if(e.target.closest(".wc")) return;
    onFocus(id);
    dragging.current=true;
    offset.current={x:e.clientX-pos.x,y:e.clientY-pos.y};
    e.preventDefault();
  },[pos,id,onFocus]);

  useEffect(()=>{
    const onMove=(e)=>{ if(!dragging.current)return; setPos({x:Math.max(0,Math.min(window.innerWidth-w,e.clientX-offset.current.x)),y:Math.max(0,Math.min(window.innerHeight-h-52,e.clientY-offset.current.y))}); };
    const onUp=()=>{ dragging.current=false; };
    window.addEventListener("mousemove",onMove);
    window.addEventListener("mouseup",onUp);
    return()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp)};
  },[w,h]);

  return (
    <div className="win-anim" onMouseDown={()=>onFocus(id)} style={{
      position:"fixed",left:pos.x,top:pos.y,width:w,
      height:minimized?"auto":h,
      zIndex,border:`1px solid ${color}55`,borderRadius:"10px",
      overflow:"hidden",
      boxShadow:`0 0 0 1px ${color}1a,0 24px 80px rgba(0,0,0,.9),0 0 60px ${color}18`,
      display:"flex",flexDirection:"column",
    }}>
      {/* Title bar */}
      <div onMouseDown={onTitleDown} style={{
        background:"linear-gradient(90deg,#080e1c,#0c1628)",
        borderBottom:`1px solid ${color}33`,height:38,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 12px",cursor:"grab",flexShrink:0,
        userSelect:"none",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:14}}>{icon}</span>
          <span className="mono" style={{fontSize:12,color,textShadow:`0 0 8px ${color}`,letterSpacing:".06em"}}>{title}</span>
        </div>
        <div className="wc" style={{display:"flex",gap:6}}>
          <WBtn c="#FFD60A" onClick={()=>setMinimized(m=>!m)} label={minimized?"▲":"▼"}/>
          <WBtn c="#FF3B30" onClick={()=>onClose(id)} label="✕"/>
        </div>
      </div>
      {!minimized && (
        <div style={{flex:1,overflow:"auto",background:"rgba(1,5,9,.97)",scrollbarWidth:"thin",scrollbarColor:`${color}33 transparent`}}>
          {children}
        </div>
      )}
    </div>
  );
}

function WBtn({c,onClick,label}){
  const [h,setH]=useState(false);
  return <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{width:14,height:14,borderRadius:"50%",background:h?c:`${c}66`,cursor:"pointer",
    display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",
    boxShadow:h?`0 0 10px ${c}`:"none",fontSize:7,color:h?"#000":"transparent"}}>
    {label}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESKTOP ICONS
// ═══════════════════════════════════════════════════════════════════════════════
const APP_DEFS = [
  {id:"about",   label:"ABOUT.EXE",      icon:"👤"},
  {id:"projects",label:"PROJECTS.EXE",   icon:"📁"},
  {id:"skills",  label:"SKILLS.EXE",     icon:"⚡"},
  {id:"experience",label:"EXPERIENCE.EXE",icon:"📊"},
  {id:"contact", label:"CONTACT.EXE",    icon:"📡"},
];

function DesktopIcons({ color, onOpen, openIds }) {
  return (
    <div style={{position:"fixed",top:16,left:16,display:"flex",flexDirection:"column",gap:6,zIndex:10}}>
      {APP_DEFS.map(a=>(
        <DIcon key={a.id} app={a} color={color} onOpen={onOpen} active={openIds.includes(a.id)}/>
      ))}
    </div>
  );
}

function DIcon({ app, color, onOpen, active }) {
  const [h,setH]=useState(false);
  return (
    <div onDoubleClick={()=>onOpen(app.id)}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      title={"Double-click to open "+app.label}
      style={{
        display:"flex",flexDirection:"column",alignItems:"center",gap:4,
        padding:"8px 6px",width:72,borderRadius:"7px",cursor:"pointer",
        background:h||active?`${color}18`:"transparent",
        border:`1px solid ${h||active?color+"44":"transparent"}`,
        transition:"all .15s",
        transform:h?"translateY(-3px) scale(1.06)":"none",
        boxShadow:h?`0 4px 20px ${color}33`:"none",
      }}>
      <div style={{fontSize:26,filter:(h||active)?`drop-shadow(0 0 8px ${color})`:"none",transition:"filter .15s"}}>{app.icon}</div>
      <div className="mono" style={{fontSize:8,color:h||active?color:"rgba(255,255,255,.45)",textAlign:"center",lineHeight:1.3,textShadow:h?`0 0 8px ${color}`:"none",transition:"all .15s",wordBreak:"break-all"}}>
        {app.label}
      </div>
      {active && <div style={{width:5,height:5,borderRadius:"50%",background:color,boxShadow:`0 0 6px ${color}`}}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASKBAR
// ═══════════════════════════════════════════════════════════════════════════════
function Taskbar({ color, openIds, onIconClick, cornerHits, bounceCount, time, konamiActive }) {
  return (
    <div style={{
      position:"fixed",bottom:0,left:0,right:0,height:52,zIndex:1000,
      display:"flex",alignItems:"center",padding:"0 10px",gap:6,
      background:"rgba(1,5,9,.96)",backdropFilter:"blur(20px)",
      borderTop:`1px solid ${color}33`,
    }}>
      {/* Logo */}
      <div className="orb" style={{
        fontSize:11,fontWeight:900,color:"#010509",background:color,
        padding:"5px 12px",borderRadius:"4px",flexShrink:0,
        boxShadow:`0 0 18px ${color}66`,letterSpacing:".06em",cursor:"default",
      }}>DVD-OS</div>

      <div style={{width:1,height:28,background:`${color}33`,flexShrink:0}}/>

      {/* App buttons */}
      <div style={{display:"flex",gap:3,flex:1,overflow:"hidden"}}>
        {APP_DEFS.map(a=>(
          <button key={a.id} onClick={()=>onIconClick(a.id)}
            className="mono"
            style={{
              background:openIds.includes(a.id)?`${color}22`:"transparent",
              border:`1px solid ${openIds.includes(a.id)?color+"55":"transparent"}`,
              borderRadius:"4px",padding:"4px 10px",
              color:openIds.includes(a.id)?color:"rgba(255,255,255,.38)",
              fontSize:10,cursor:"pointer",
              display:"flex",alignItems:"center",gap:5,flexShrink:0,
              transition:"all .15s",
              boxShadow:openIds.includes(a.id)?`0 0 10px ${color}33`:"none",
            }}
            onMouseEnter={e=>{if(!openIds.includes(a.id)){e.currentTarget.style.background=`${color}0f`;e.currentTarget.style.color="rgba(255,255,255,.6)"}}}
            onMouseLeave={e=>{if(!openIds.includes(a.id)){e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,.38)"}}}
          >
            <span style={{fontSize:12}}>{a.icon}</span>
            <span style={{display:"none"}}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Right stats */}
      <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        {konamiActive && (
          <div className="orb" style={{fontSize:8,color:"#FFD60A",border:"1px solid #FFD60A55",padding:"2px 8px",borderRadius:3,letterSpacing:".1em",animation:"neonPulse 1s infinite"}}>
            ★ DEV
          </div>
        )}
        <div className="mono" style={{fontSize:9,color:`${color}88`,textAlign:"right",lineHeight:1.5}}>
          <div>⬢ CORNERS: <span style={{color}}>{cornerHits}</span></div>
          <div>● BOUNCES: <span style={{color}}>{bounceCount}</span></div>
        </div>
        <div className="mono" style={{
          fontSize:11,color,padding:"4px 10px",
          border:`1px solid ${color}33`,borderRadius:3,minWidth:72,textAlign:"center",
          textShadow:`0 0 8px ${color}55`,
        }}>{time}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABOUT CONTENT
// ═══════════════════════════════════════════════════════════════════════════════
function AboutContent({ data, color }) {
  const stats = useMemo(()=>[
    {label:"YEARS EXP",value:"5+",icon:"⏱"},
    {label:"PROJECTS",value:data.projects?.length||"12",icon:"📦"},
    {label:"SKILLS",value:data.skills?.length||"10",icon:"⚡"},
    {label:"COMMITS",value:"2.4K",icon:"🔧"},
  ],[data]);

  return (
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}>
      {/* Profile row */}
      <div style={{display:"flex",gap:18,alignItems:"flex-start",flexWrap:"wrap"}}>
        {/* Avatar */}
        <div style={{
          width:82,height:82,borderRadius:14,flexShrink:0,
          border:`2px solid ${color}66`,
          background:`linear-gradient(135deg,${color}22,${color}08)`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:34,
          animation:"float 3.5s ease-in-out infinite",
          boxShadow:`0 0 30px ${color}33,inset 0 0 20px ${color}0f`,
          position:"relative",overflow:"hidden",
        }}>
          <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${color}18,transparent)`,animation:"shimmer 3s linear infinite",backgroundSize:"200% 100%"}}/>
          {data.name.charAt(0)}
        </div>
        <div style={{flex:1,minWidth:160}}>
          <div className="orb" style={{fontSize:"clamp(16px,3vw,24px)",fontWeight:900,color:"#fff",textShadow:`0 0 20px ${color}55`}}>{data.name}</div>
          <div className="mono" style={{fontSize:11,color,marginTop:5,textShadow:`0 0 10px ${color}`,animation:"neonPulse 2s infinite"}}>
            &gt;&gt; {data.title}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:8}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#06FFB4",boxShadow:"0 0 8px #06FFB4",animation:"statusPulse 2s infinite",color:"#06FFB4"}}/>
            <span className="mono" style={{fontSize:9,color:"#06FFB4aa",letterSpacing:".12em"}}>ONLINE — {data.location}</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={{
        padding:"14px 18px",
        background:`${color}08`,
        borderLeft:`3px solid ${color}`,
        borderRadius:"0 7px 7px 0",
        fontSize:11,lineHeight:1.85,color:"rgba(255,255,255,.6)",
      }} className="mono">
        &gt; {data.bio}
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {stats.map(s=>(
          <div key={s.label} style={{
            padding:"12px 10px",background:"#080e1c",
            border:`1px solid ${color}22`,borderRadius:7,textAlign:"center",
            transition:"all .2s",cursor:"default",
          }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=`${color}77`;e.currentTarget.style.background=`${color}0d`;e.currentTarget.style.boxShadow=`0 0 16px ${color}22`}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=`${color}22`;e.currentTarget.style.background="#080e1c";e.currentTarget.style.boxShadow="none"}}
          >
            <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>
            <div className="orb" style={{fontSize:18,fontWeight:900,color,textShadow:`0 0 10px ${color}`}}>{s.value}</div>
            <div className="mono" style={{fontSize:8,color:"rgba(255,255,255,.3)",letterSpacing:".1em",marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Contact cards */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[
          {label:"EMAIL",value:data.email,icon:"📧"},
          {label:"GITHUB",value:data.github,icon:"🐙"},
          {label:"LINKEDIN",value:data.linkedin,icon:"💼"},
          {label:"LOCATION",value:data.location,icon:"📍"},
        ].map(item=>(
          <div key={item.label} style={{
            padding:"11px 15px",background:"#080e1c",
            border:`1px solid ${color}1a`,borderRadius:6,transition:"all .2s",
          }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=`${color}55`;e.currentTarget.style.background=`${color}0a`}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=`${color}1a`;e.currentTarget.style.background="#080e1c"}}
          >
            <div className="mono" style={{fontSize:8,color:`${color}88`,letterSpacing:".18em",marginBottom:4}}>{item.icon} {item.label}</div>
            <div className="mono" style={{fontSize:10,color:"rgba(255,255,255,.45)",wordBreak:"break-all"}}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SKILLS CONTENT
// ═══════════════════════════════════════════════════════════════════════════════
function SkillsContent({ skills, color }) {
  const [hov, setHov] = useState(null);
  const catColors = {"Frontend":"#00D4FF","Backend":"#06FFB4","Data":"#FFD60A","DevOps":"#FF006E"};

  const categorized = useMemo(()=>{
    const result = {};
    const used = new Set();
    Object.entries(SKILL_CATEGORIES).forEach(([cat,list])=>{
      result[cat]=[];
      list.forEach(s=>{ if(skills.includes(s)){ result[cat].push(s); used.add(s); } });
    });
    const other = skills.filter(s=>!used.has(s));
    if(other.length) result["Other"]=other;
    return result;
  },[skills]);

  return (
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:22}}>
      <div className="mono" style={{fontSize:9,color:`${color}77`,letterSpacing:".18em"}}>
        &gt; SKILL_REGISTRY.SYS — {skills.length} MODULES LOADED
      </div>

      {Object.entries(categorized).filter(([,v])=>v.length>0).map(([cat,catSkills])=>{
        const cc = catColors[cat]||color;
        return (
          <div key={cat}>
            <div className="mono" style={{fontSize:9,color:`${cc}aa`,letterSpacing:".2em",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <div style={{height:1,width:12,background:cc}}/>
              {cat.toUpperCase()}
              <div style={{flex:1,height:1,background:`${cc}22`}}/>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8}}>
              {catSkills.map((sk,i)=>(
                <SkillChip key={sk} skill={sk} color={cc} hov={hov===`${cat}-${i}`}
                  onEnter={()=>setHov(`${cat}-${i}`)} onLeave={()=>setHov(null)}/>
              ))}
            </div>
          </div>
        );
      })}

      {/* Bars for top skills */}
      <div>
        <div className="mono" style={{fontSize:9,color:`${color}66`,letterSpacing:".15em",marginBottom:12}}>&gt; PROFICIENCY_MATRIX.DAT</div>
        {skills.slice(0,6).map((sk,i)=><SkillBar key={sk} skill={sk} index={i} color={PALETTE[i%PALETTE.length]}/>)}
      </div>
    </div>
  );
}

function SkillChip({ skill, color, hov, onEnter, onLeave }) {
  return (
    <div onMouseEnter={onEnter} onMouseLeave={onLeave} className="mono" style={{
      padding:"7px 16px",border:`1px solid ${hov?color:color+"44"}`,
      borderRadius:4,background:hov?`${color}22`:`${color}08`,
      color:hov?color:"rgba(255,255,255,.5)",fontSize:11,cursor:"default",
      transition:"all .18s cubic-bezier(.34,1.56,.64,1)",
      transform:hov?"translateY(-3px) scale(1.06)":"none",
      boxShadow:hov?`0 0 18px ${color}44,0 6px 20px rgba(0,0,0,.4)`:"none",
      textShadow:hov?`0 0 8px ${color}`:"none",letterSpacing:".05em",
    }}>{skill}</div>
  );
}

function SkillBar({ skill, index, color }) {
  const [w, setW] = useState(0);
  const pct = useMemo(()=>68+Math.floor(Math.abs(Math.sin(index*2.7))*22),[index]);
  useEffect(()=>{ const t=setTimeout(()=>setW(pct),120+index*90); return()=>clearTimeout(t); },[pct,index]);
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
      <div className="mono" style={{fontSize:10,color:"rgba(255,255,255,.35)",width:90,flexShrink:0,letterSpacing:".04em"}}>{skill}</div>
      <div style={{flex:1,height:5,background:"rgba(255,255,255,.05)",borderRadius:3,border:`1px solid ${color}22`,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${w}%`,background:`linear-gradient(90deg,${color}88,${color})`,borderRadius:3,transition:"width .9s cubic-bezier(.4,0,.2,1)",boxShadow:`0 0 8px ${color}77`}}/>
      </div>
      <div className="mono" style={{fontSize:9,color,width:30,textAlign:"right",flexShrink:0,textShadow:`0 0 6px ${color}`}}>{w}%</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECTS CONTENT
// ═══════════════════════════════════════════════════════════════════════════════
function ProjectsContent({ projects, color }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{padding:24}}>
      <div className="mono" style={{fontSize:9,color:`${color}77`,letterSpacing:".18em",marginBottom:16}}>
        C:\PORTFOLIO\PROJECTS\ &gt; {projects.length} ITEMS FOUND
      </div>
      {/* Explorer bar */}
      <div style={{display:"grid",gridTemplateColumns:"1fr auto",padding:"7px 12px",background:"#080e1c",borderBottom:`1px solid ${color}1a`,marginBottom:4}}>
        <span className="mono" style={{fontSize:9,color:`${color}55`,letterSpacing:".12em"}}>NAME</span>
        <span className="mono" style={{fontSize:9,color:`${color}55`,letterSpacing:".12em"}}>TYPE</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:3}}>
        {projects.map((p,i)=>(
          <ProjectFile key={i} project={p} index={i} color={color} expanded={open===i} onToggle={()=>setOpen(open===i?null:i)}/>
        ))}
      </div>
    </div>
  );
}

function ProjectFile({ project, index, color, expanded, onToggle }) {
  const tech = Array.isArray(project.tech)?project.tech:(project.techStack||[]);
  return (
    <div style={{border:`1px solid ${expanded?color+"55":color+"18"}`,borderRadius:7,overflow:"hidden",transition:"all .22s",background:expanded?`${color}07`:"transparent",boxShadow:expanded?`0 0 20px ${color}18`:"none"}}>
      <div onClick={onToggle} className="mono"
        style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",cursor:"pointer",transition:"background .15s"}}
        onMouseEnter={e=>{if(!expanded)e.currentTarget.style.background=`${color}08`}}
        onMouseLeave={e=>{if(!expanded)e.currentTarget.style.background="transparent"}}
      >
        <span style={{fontSize:16}}>{expanded?"📂":"📁"}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:13,color:expanded?color:"#fff",textShadow:expanded?`0 0 10px ${color}`:"none",transition:"all .15s"}}>{project.title}</div>
        </div>
        <span style={{fontSize:9,color:`${color}55`,letterSpacing:".1em"}}>.EXE</span>
        <span style={{fontSize:9,color:`${color}66`,transform:expanded?"rotate(90deg)":"none",transition:"transform .2s"}}>▶</span>
      </div>
      {expanded && (
        <div style={{padding:"0 14px 16px 42px",animation:"bootLine .2s ease"}}>
          <p className="mono" style={{fontSize:11,color:"rgba(255,255,255,.45)",lineHeight:1.7,marginBottom:10}}>
            &gt; {project.description}
          </p>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
            {tech.map((t,j)=>(
              <span key={j} className="mono" style={{padding:"3px 10px",fontSize:10,border:`1px solid ${color}44`,borderRadius:3,color,background:`${color}0f`,textShadow:`0 0 6px ${color}77`}}>{t}</span>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            {project.github && <ProjLink href={project.github} label="GITHUB" color="#06FFB4"/>}
            {project.link && <ProjLink href={project.link} label="LIVE DEMO" color={color}/>}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjLink({ href, label, color }) {
  const [h,setH]=useState(false);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      className="mono"
      style={{
        padding:"5px 12px",fontSize:10,border:`1px solid ${h?color:color+"55"}`,
        borderRadius:3,color:h?color:`${color}88`,textDecoration:"none",
        background:h?`${color}18`:"transparent",transition:"all .15s",
        textShadow:h?`0 0 8px ${color}`:"none",letterSpacing:".1em",
      }}
    >
      {label} →
    </a>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPERIENCE CONTENT
// ═══════════════════════════════════════════════════════════════════════════════
function ExperienceContent({ experience, color }) {
  const [vis, setVis] = useState([]);
  const [hov, setHov] = useState(null);
  useEffect(()=>{ experience.forEach((_,i)=>setTimeout(()=>setVis(p=>[...p,i]),i*220+100)); },[experience]);
  return (
    <div style={{padding:24}}>
      <div className="mono" style={{fontSize:9,color:`${color}77`,letterSpacing:".18em",marginBottom:28}}>
        &gt; CAREER_TIMELINE.LOG — {experience.length} RECORDS
      </div>
      <div style={{position:"relative",paddingLeft:34}}>
        {/* Timeline spine */}
        <div style={{position:"absolute",left:11,top:8,bottom:20,width:2,background:`linear-gradient(to bottom,${color},${color}18)`,boxShadow:`0 0 8px ${color}55`}}/>
        {experience.map((exp,i)=>(
          <div key={i} style={{marginBottom:28,opacity:vis.includes(i)?1:0,transform:vis.includes(i)?"none":"translateX(-18px)",transition:"all .4s cubic-bezier(.4,0,.2,1)"}}>
            {/* Node */}
            <div style={{position:"absolute",left:5,width:14,height:14,borderRadius:"50%",border:`2px solid ${color}`,background:"#010509",boxShadow:`0 0 14px ${color}`,marginTop:4}}/>
            <div
              onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
              style={{
                padding:"14px 18px",
                border:`1px solid ${hov===i?color+"66":color+"1a"}`,
                borderRadius:7,
                transition:"all .2s",
                cursor:"default",
                boxShadow:hov===i?`0 0 24px ${color}22`:"none",
                background:hov===i?`${color}0a`:"#080e1c",
              }}
            >
              <div className="mono" style={{fontSize:9,color,letterSpacing:".18em",marginBottom:5,textShadow:`0 0 8px ${color}`}}>
                {exp.company.toUpperCase()} ◆ {exp.period}
              </div>
              <div className="orb" style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:6}}>{exp.role}</div>
              {exp.desc && <div className="mono" style={{fontSize:10,color:"rgba(255,255,255,.35)",lineHeight:1.6}}>{exp.desc}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT CONTENT
// ═══════════════════════════════════════════════════════════════════════════════
function ContactContent({ data, color }) {
  const fullText = `CONTACT_TERMINAL.EXE v2.0\n══════════════════════════\nSYSTEM: PORTFOLIO COMM HUB\nSTATUS: ● ONLINE\nENCRYPTION: AES-256 ACTIVE\n\nREADY TO ESTABLISH SECURE CONNECTION...\nAWAITING INPUT ▌`;
  const [typed, setTyped] = useState("");
  useEffect(()=>{
    let i=0;
    const iv=setInterval(()=>{
      if(i<fullText.length){setTyped(fullText.slice(0,i+1));i++;}
      else clearInterval(iv);
    },22);
    return()=>clearInterval(iv);
  },[]);

  const links=[
    {label:"EMAIL",value:data.email,icon:"📧",href:`mailto:${data.email}`},
    {label:"GITHUB",value:data.github,icon:"🐙",href:data.github},
    {label:"LINKEDIN",value:data.linkedin,icon:"💼",href:data.linkedin},
    {label:"LOCATION",value:data.location,icon:"📍",href:"#"},
  ];
  return (
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:18}}>
      <div style={{background:"#000",border:`1px solid ${color}33`,borderRadius:7,padding:16,minHeight:140}}>
        <pre className="mono" style={{fontSize:11,color:"#06FFB4",lineHeight:1.65,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
          {typed}
          {typed.length<fullText.length && <span style={{animation:"blink 1s step-end infinite",color}}>█</span>}
        </pre>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {links.map(item=>(
          <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
            style={{
              display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"13px 16px",background:"#080e1c",
              border:`1px solid ${color}18`,borderRadius:6,textDecoration:"none",
              transition:"all .18s",cursor:"pointer",
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=`${color}66`;e.currentTarget.style.background=`${color}0f`;e.currentTarget.style.transform="translateX(4px)";e.currentTarget.style.boxShadow=`0 0 16px ${color}1a`}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=`${color}18`;e.currentTarget.style.background="#080e1c";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}
          >
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:15}}>{item.icon}</span>
              <span className="mono" style={{fontSize:9,color,letterSpacing:".18em"}}>{item.label}</span>
            </div>
            <span className="mono" style={{fontSize:10,color:"rgba(255,255,255,.3)",maxWidth:"55%",textAlign:"right",wordBreak:"break-all"}}>{item.value}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Bouncing_DVD_Logo({ portfolioData }) {
  const ctx = usePortfolio();
  const raw = portfolioData || ctx?.portfolioData || {};
  const normalized = normalizePortfolioData(raw);
  const d = Object.keys(normalized).length > 2 ? normalized : null;

  const name       = d?.personal?.name      || defaultData.name;
  const title      = d?.personal?.title     || defaultData.title;
  const subtitle   = d?.personal?.subtitle  || defaultData.subtitle;
  const bio        = d?.personal?.bio       || defaultData.bio;
  const email      = d?.socials?.email      || defaultData.email;
  const github     = d?.socials?.github     || defaultData.github;
  const linkedin   = d?.socials?.linkedin   || defaultData.linkedin;
  const location   = d?.personal?.location  || defaultData.location;
  const rawSkills  = d?.skills              || defaultData.skills;
  const skills     = useMemo(()=>Array.isArray(rawSkills)?rawSkills.map(s=>typeof s==="string"?s:s.name):defaultData.skills,[rawSkills]);
  const projects   = d?.projects            || defaultData.projects;
  const experience = d?.experience          || defaultData.experience;

  const portData = useMemo(()=>({name,title,bio,email,github,linkedin,location,skills,projects}),[name,title,bio,email,github,linkedin,location,skills,projects]);

  // ── State ──
  const [booted, setBooted]             = useState(false);
  const [pos, setPos]                   = useState({x:180,y:140});
  const [colorIdx, setColorIdx]         = useState(0);
  const [trails, setTrails]             = useState([]);
  const [shockwaves, setShockwaves]     = useState([]);
  const [particles, setParticles]       = useState([]);
  const [bounceFlash, setBounceFlash]   = useState(false);
  const [cornerHits, setCornerHits]     = useState(0);
  const [bounceCount, setBounceCount]   = useState(0);
  const [cornerCelebration, setCornerCelebration] = useState(false);
  const [confetti, setConfetti]         = useState(false);
  const [achievement, setAchievement]   = useState(null);
  const [windows, setWindows]           = useState([]);
  const [winOrder, setWinOrder]         = useState([]);
  const [konami, setKonami]             = useState(false);
  const [konamiBuf, setKonamiBuf]       = useState([]);
  const [time, setTime]                 = useState("");

  // ── Refs ──
  const arenaRef    = useRef(null);
  const posRef      = useRef({x:180,y:140});
  const velRef      = useRef({x:BASE_SPEED,y:BASE_SPEED*0.65});
  const colorIdxRef = useRef(0);
  const rafRef      = useRef(null);
  const bcRef       = useRef(0);
  const chRef       = useRef(0);

  const color = PALETTE[colorIdx];

  // Clock
  useEffect(()=>{
    const tick=()=>{const n=new Date();setTime(`${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}:${String(n.getSeconds()).padStart(2,"0")}`);};
    tick(); const id=setInterval(tick,1000); return()=>clearInterval(id);
  },[]);

  // Konami
  useEffect(()=>{
    const onK=(e)=>{
      setKonamiBuf(prev=>{
        const next=[...prev,e.key].slice(-KONAMI.length);
        if(next.join(",")===KONAMI.join(",")){
          setKonami(true);
          showAchievement({title:"DEV MODE ACTIVATED",desc:"Konami code entered. All systems go."});
        }
        return next;
      });
    };
    window.addEventListener("keydown",onK);
    return()=>window.removeEventListener("keydown",onK);
  },[]);

  const showAchievement = useCallback((data)=>{
    setAchievement(data);
    setTimeout(()=>setAchievement(null),4500);
  },[]);

  const spawnParticles = useCallback((x,y,c)=>{
    const ps=Array.from({length:16},(_,i)=>({
      id:Date.now()+i,x:x+LOGO_W/2,y:y+LOGO_H/2,
      dx:(Math.random()-.5)*160,dy:(Math.random()-.5)*160,
      s:3+Math.random()*6,c,life:350+Math.random()*350,
    }));
    setParticles(p=>[...p.slice(-80),...ps]);
    setTimeout(()=>setParticles(p=>p.filter(pp=>!ps.find(np=>np.id===pp.id))),800);
  },[]);

  const spawnShockwave = useCallback((x,y,c)=>{
    const sw={id:Date.now()+Math.random(),x:x+LOGO_W/2,y:y+LOGO_H/2,color:c};
    setShockwaves(p=>[...p.slice(-6),sw]);
    setTimeout(()=>setShockwaves(p=>p.filter(s=>s.id!==sw.id)),750);
  },[]);

  const checkCorner = useCallback((x,y,W,H)=>{
    return ((x<=CORNER_THRESH)||(x+LOGO_W>=W-CORNER_THRESH))
        && ((y<=CORNER_THRESH)||(y+LOGO_H>=H-CORNER_THRESH));
  },[]);

  // Main animation loop
  useEffect(()=>{
    if(!booted) return;
    const animate=()=>{
      const arena=arenaRef.current;
      if(!arena){rafRef.current=requestAnimationFrame(animate);return;}
      const W=arena.clientWidth, H=arena.clientHeight;
      let {x,y}=posRef.current;
      let {x:vx,y:vy}=velRef.current;
      let hitX=false,hitY=false;
      x+=vx; y+=vy;
      if(x<=0){x=0;vx=Math.abs(vx);hitX=true;}
      if(x+LOGO_W>=W){x=Math.max(0,W-LOGO_W);vx=-Math.abs(vx);hitX=true;}
      if(y<=0){y=0;vy=Math.abs(vy);hitY=true;}
      if(y+LOGO_H>=H){y=Math.max(0,H-LOGO_H);vy=-Math.abs(vy);hitY=true;}

      if(hitX||hitY){
        const ni=(colorIdxRef.current+1)%PALETTE.length;
        colorIdxRef.current=ni;
        const nc=PALETTE[ni];
        bcRef.current++;
        setColorIdx(ni);
        setBounceCount(bcRef.current);
        setBounceFlash(true);
        spawnParticles(x,y,nc);
        spawnShockwave(x,y,nc);
        setTimeout(()=>setBounceFlash(false),110);

        // Corner detection
        if(hitX&&hitY&&checkCorner(x,y,W,H)){
          chRef.current++;
          setCornerHits(chRef.current);
          setCornerCelebration(true);
          setConfetti(true);
          showAchievement({title:"PERFECT CORNER HIT",desc:`Corner #${chRef.current} — The holy grail of DVD screensavers.`});
          setTimeout(()=>setCornerCelebration(false),2800);
          setTimeout(()=>setConfetti(false),2800);
        }

        // Milestone achievements
        if(bcRef.current===10) showAchievement({title:"WARMING UP",desc:"10 bounces. The DVD awakens."});
        if(bcRef.current===25) showAchievement({title:"IN THE ZONE",desc:"25 bounces. You're hypnotized."});
        if(bcRef.current===50) showAchievement({title:"FULLY HYPNOTIC",desc:"50 bounces. There's no going back."});
        if(bcRef.current===100) showAchievement({title:"BOUNCE MASTER",desc:"100 bounces. Legendary status achieved."});
      }

      posRef.current={x,y};
      velRef.current={x:vx,y:vy};
      setPos({x,y});
      const speed=Math.sqrt(vx*vx+vy*vy);
      setTrails(p=>[...p.slice(-24),{x,y,id:Date.now()+Math.random(),color:PALETTE[colorIdxRef.current],speed}]);
      rafRef.current=requestAnimationFrame(animate);
    };
    rafRef.current=requestAnimationFrame(animate);
    return()=>cancelAnimationFrame(rafRef.current);
  },[booted,spawnParticles,spawnShockwave,checkCorner,showAchievement]);

  // Window ops
  const openWindow = useCallback((id)=>{
    setWindows(p=>p.includes(id)?p:[...p,id]);
    setWinOrder(p=>[...p.filter(w=>w!==id),id]);
  },[]);
  const closeWindow = useCallback((id)=>{
    setWindows(p=>p.filter(w=>w!==id));
    setWinOrder(p=>p.filter(w=>w!==id));
  },[]);
  const focusWindow = useCallback((id)=>{
    setWinOrder(p=>[...p.filter(w=>w!==id),id]);
  },[]);

  // Win positions (staggered)
  const defaultPositions = useMemo(()=>({
    about:     {x:80,  y:55},
    projects:  {x:110, y:75},
    skills:    {x:90,  y:65},
    experience:{x:120, y:70},
    contact:   {x:100, y:60},
  }),[]);

  const winDefs = useMemo(()=>({
    about:     {title:"ABOUT.EXE",     icon:"👤", node:<AboutContent      data={portData}              color={color}/>},
    projects:  {title:"PROJECTS.EXE",  icon:"📁", node:<ProjectsContent   projects={projects}          color={color}/>},
    skills:    {title:"SKILLS.EXE",    icon:"⚡", node:<SkillsContent     skills={skills}              color={color}/>},
    experience:{title:"EXPERIENCE.EXE",icon:"📊", node:<ExperienceContent experience={experience}      color={color}/>},
    contact:   {title:"CONTACT.EXE",   icon:"📡", node:<ContactContent    data={portData}              color={color}/>},
  }),[portData,projects,skills,experience,color]);

  return (
    <>
      <style>{CSS}</style>
      <div className="dvd-root" style={{filter:konami?"hue-rotate(25deg)":"none",transition:"filter .6s"}}>
        <div className="crt-lines"/>
        <div className="crt-beam"/>

        {/* Boot */}
        {!booted && <BootSequence onComplete={()=>setBooted(true)} name={name}/>}

        {booted && (
          <>
            {/* Screen bounce flash */}
            {bounceFlash && (
              <div style={{position:"fixed",inset:0,zIndex:900,pointerEvents:"none",background:`${color}12`,boxShadow:`inset 0 0 120px ${color}1a`}}/>
            )}

            {/* Desktop arena */}
            <div ref={arenaRef} style={{position:"fixed",inset:0,bottom:52,overflow:"hidden"}}>
              <Background color={color}/>
              <IdentityCard
                pos={pos} color={color} name={name} title={title} subtitle={subtitle}
                trails={trails} shockwaves={shockwaves}
                speed={Math.sqrt(velRef.current.x**2+velRef.current.y**2)}
              />
              {/* Corner hit display */}
              <div style={{position:"absolute",top:12,right:16,textAlign:"right",pointerEvents:"none"}}>
                <div className="mono" style={{fontSize:9,color:cornerHits>0?color:`${color}33`,textShadow:cornerHits>0?`0 0 10px ${color}`:"none",letterSpacing:".15em"}}>
                  ⬢ CORNER HITS: {cornerHits}
                </div>
                <div className="mono" style={{fontSize:8,color:`${color}2a`,marginTop:4,letterSpacing:".1em"}}>DBL-CLICK ICONS TO OPEN</div>
              </div>
              {/* Color palette indicator */}
              <div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,alignItems:"center"}}>
                {PALETTE.slice(0,8).map((c,i)=>(
                  <div key={i} style={{
                    width:i===colorIdx?22:5,height:5,borderRadius:3,
                    background:c,opacity:i===colorIdx?1:.2,
                    transition:"all .25s",boxShadow:i===colorIdx?`0 0 8px ${c}`:"none",
                  }}/>
                ))}
              </div>
            </div>

            {/* Desktop icons */}
            <DesktopIcons color={color} onOpen={openWindow} openIds={windows}/>

            {/* Windows */}
            {windows.map(id=>{
              const def=winDefs[id];
              if(!def) return null;
              return (
                <OSWindow key={id} id={id} title={def.title} icon={def.icon} color={color}
                  onClose={closeWindow} onFocus={focusWindow}
                  zIndex={100+winOrder.indexOf(id)}
                  defaultPos={defaultPositions[id]}
                >
                  {def.node}
                </OSWindow>
              );
            })}

            {/* Particles layer */}
            <Particles particles={particles}/>

            {/* Confetti */}
            <Confetti active={confetti}/>

            {/* Corner celebration */}
            <CornerCelebration active={cornerCelebration} color={color}/>

            {/* Achievement */}
            <Achievement data={achievement} color={color}/>

            {/* Taskbar */}
            <Taskbar
              color={color} openIds={windows} onIconClick={openWindow}
              cornerHits={cornerHits} bounceCount={bounceCount}
              time={time} konamiActive={konami}
            />
          </>
        )}
      </div>
    </>
  );
}
import { useState, useEffect, useRef } from "react";

const defaultData = {
  name: "Alex Morgan",
  title: "Software Engineer",
  email: "alex@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  bio: "I build things for the web. Passionate about clean code, great UX, and coffee.",
  skills: ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker"],
  projects: [
    { title: "Project Alpha", description: "A full-stack web application built with React and Node.js.", tech: "React, Node.js, MongoDB" },
    { title: "Project Beta", description: "Machine learning pipeline for real-time data analysis.", tech: "Python, TensorFlow, AWS" },
    { title: "Project Gamma", description: "Open source CLI tool with 2k+ GitHub stars.", tech: "Go, Docker, GitHub Actions" },
  ],
  experience: [
    { company: "Google", role: "Software Engineer", period: "2022 — Present" },
    { company: "Startup XYZ", role: "Full Stack Developer", period: "2020 — 2022" },
  ],
};

const COLORS = [
  "#FF0080", "#00FF80", "#0080FF", "#FF8000",
  "#8000FF", "#FF0000", "#00FFFF", "#FFFF00",
];

const SECTIONS = ["home", "about", "skills", "projects", "experience", "contact"];

export default function Bouncing_DVD_Logo({ data: propData }) {
  const data = propData || defaultData;
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef({ x: 100, y: 100 });
  const velRef = useRef({ x: 2.5, y: 2 });
  const colorIdxRef = useRef(0);

  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [color, setColor] = useState(COLORS[0]);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const LOGO_W = 180;
  const LOGO_H = 80;

  useEffect(() => {
    const animate = () => {
      const container = containerRef.current;
      if (!container) return;
      const W = container.clientWidth;
      const H = container.clientHeight;

      let { x, y } = posRef.current;
      let { x: vx, y: vy } = velRef.current;
      let hit = false;

      x += vx;
      y += vy;

      if (x <= 0) { x = 0; vx = Math.abs(vx); hit = true; }
      if (x + LOGO_W >= W) { x = W - LOGO_W; vx = -Math.abs(vx); hit = true; }
      if (y <= 0) { y = 0; vy = Math.abs(vy); hit = true; }
      if (y + LOGO_H >= H) { y = H - LOGO_H; vy = -Math.abs(vy); hit = true; }

      if (hit) {
        colorIdxRef.current = (colorIdxRef.current + 1) % COLORS.length;
        setColor(COLORS[colorIdxRef.current]);
      }

      posRef.current = { x, y };
      velRef.current = { x: vx, y: vy };
      setPos({ x, y });
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const styles = {
    outer: {
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      background: "#0a0a0a",
      minHeight: "100vh",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
    },
    nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 32px",
      borderBottom: "1px solid #222",
      background: "#0a0a0a",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    navBrand: {
      fontSize: "14px",
      fontWeight: "700",
      color: color,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      transition: "color 0.3s",
    },
    navLinks: {
      display: "flex",
      gap: "24px",
    },
    navLink: (active) => ({
      fontSize: "11px",
      fontWeight: "600",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: active ? color : "#888",
      cursor: "pointer",
      transition: "color 0.2s",
      background: "none",
      border: "none",
    }),
    hero: {
      position: "relative",
      height: "80vh",
      overflow: "hidden",
      background: "#000",
      cursor: "default",
    },
    logo: {
      position: "absolute",
      left: pos.x,
      top: pos.y,
      width: LOGO_W,
      height: LOGO_H,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      border: `3px solid ${color}`,
      borderRadius: "8px",
      transition: "border-color 0.1s, color 0.1s",
      userSelect: "none",
      cursor: "pointer",
    },
    logoName: {
      fontSize: "15px",
      fontWeight: "900",
      color: color,
      letterSpacing: "-0.02em",
      lineHeight: "1",
      transition: "color 0.1s",
    },
    logoTitle: {
      fontSize: "9px",
      color: color,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      marginTop: "4px",
      opacity: 0.8,
      transition: "color 0.1s",
    },
    heroHint: {
      position: "absolute",
      bottom: "24px",
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "10px",
      color: "#444",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
    },
    content: {
      padding: "60px 80px",
      maxWidth: "900px",
      margin: "0 auto",
      width: "100%",
    },
    sectionTitle: {
      fontSize: "10px",
      fontWeight: "700",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: color,
      marginBottom: "32px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      transition: "color 0.3s",
    },
    sectionLine: {
      flex: 1,
      height: "1px",
      background: "#222",
    },
    bio: {
      fontSize: "18px",
      lineHeight: "1.8",
      color: "#ccc",
      marginBottom: "40px",
      maxWidth: "600px",
    },
    skillsGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
    },
    skillTag: {
      padding: "8px 16px",
      border: `1px solid ${color}`,
      color: color,
      fontSize: "12px",
      fontWeight: "600",
      letterSpacing: "0.05em",
      borderRadius: "4px",
      transition: "background 0.2s, color 0.2s, border-color 0.3s",
    },
    projectCard: {
      border: "1px solid #222",
      padding: "24px",
      marginBottom: "-1px",
      background: "#111",
      transition: "border-color 0.2s",
    },
    projectTitle: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#fff",
      marginBottom: "8px",
    },
    projectDesc: {
      fontSize: "13px",
      color: "#888",
      marginBottom: "12px",
      lineHeight: "1.6",
    },
    projectTech: {
      fontSize: "11px",
      color: color,
      fontWeight: "600",
      letterSpacing: "0.05em",
      transition: "color 0.3s",
    },
    expItem: {
      padding: "20px 0",
      borderBottom: "1px solid #1a1a1a",
    },
    expCompany: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#fff",
      marginBottom: "4px",
    },
    expRole: {
      fontSize: "13px",
      color: "#888",
    },
    expPeriod: {
      fontSize: "11px",
      color: color,
      marginTop: "4px",
      transition: "color 0.3s",
    },
    contactGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
    },
    contactItem: {
      padding: "20px",
      border: `1px solid #222`,
      background: "#111",
    },
    contactLabel: {
      fontSize: "9px",
      fontWeight: "700",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "#555",
      marginBottom: "4px",
    },
    contactValue: {
      fontSize: "14px",
      color: color,
      fontWeight: "600",
      transition: "color 0.3s",
    },
    footer: {
      padding: "24px 80px",
      borderTop: "1px solid #1a1a1a",
      display: "flex",
      justifyContent: "space-between",
      fontSize: "10px",
      color: "#444",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    },
  };

  return (
    <div style={styles.outer}>
      {/* Nav */}
      <nav style={styles.nav}>
        <span style={styles.navBrand}>{data.name || defaultData.name}</span>
        <div style={styles.navLinks}>
          {SECTIONS.map(s => (
            <button key={s} style={styles.navLink(activeSection === s)} onClick={() => setActiveSection(s)}>
              {s}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero — bouncing logo */}
      {activeSection === "home" && (
        <div style={styles.hero} ref={containerRef}>
          <div
            style={styles.logo}
            onClick={() => setActiveSection("about")}
            title="Click to enter"
          >
            <div style={styles.logoName}>{(data.name || defaultData.name).split(" ")[0]}</div>
            <div style={styles.logoTitle}>{data.title || defaultData.title}</div>
          </div>
          <div style={styles.heroHint}>click the logo to enter — or use nav above</div>
        </div>
      )}

      {/* Content sections */}
      {activeSection !== "home" && (
        <div style={styles.content}>

          {activeSection === "about" && (
            <div>
              <div style={styles.sectionTitle}>
                <span>About</span>
                <div style={styles.sectionLine} />
              </div>
              <p style={styles.bio}>{data.bio || defaultData.bio}</p>
            </div>
          )}

          {activeSection === "skills" && (
            <div>
              <div style={styles.sectionTitle}>
                <span>Skills</span>
                <div style={styles.sectionLine} />
              </div>
              <div style={styles.skillsGrid}>
                {(data.skills || defaultData.skills).map((skill, i) => (
                  <span key={i} style={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          {activeSection === "projects" && (
            <div>
              <div style={styles.sectionTitle}>
                <span>Projects</span>
                <div style={styles.sectionLine} />
              </div>
              {(data.projects || defaultData.projects).map((p, i) => (
                <div key={i} style={styles.projectCard}>
                  <div style={styles.projectTitle}>{p.title}</div>
                  <div style={styles.projectDesc}>{p.description}</div>
                  <div style={styles.projectTech}>{p.tech}</div>
                </div>
              ))}
            </div>
          )}

          {activeSection === "experience" && (
            <div>
              <div style={styles.sectionTitle}>
                <span>Experience</span>
                <div style={styles.sectionLine} />
              </div>
              {(data.experience || defaultData.experience).map((e, i) => (
                <div key={i} style={styles.expItem}>
                  <div style={styles.expCompany}>{e.company}</div>
                  <div style={styles.expRole}>{e.role}</div>
                  <div style={styles.expPeriod}>{e.period}</div>
                </div>
              ))}
            </div>
          )}

          {activeSection === "contact" && (
            <div>
              <div style={styles.sectionTitle}>
                <span>Contact</span>
                <div style={styles.sectionLine} />
              </div>
              <div style={styles.contactGrid}>
                {[
                  { label: "Email", value: data.email || defaultData.email },
                  { label: "GitHub", value: data.github || defaultData.github },
                  { label: "LinkedIn", value: data.linkedin || defaultData.linkedin },
                  { label: "Location", value: data.location || "San Francisco, CA" },
                ].map((item, i) => (
                  <div key={i} style={styles.contactItem}>
                    <div style={styles.contactLabel}>{item.label}</div>
                    <div style={styles.contactValue}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <span>{data.name || defaultData.name}</span>
        <span>Bouncing DVD Logo</span>
        <span>Career Pilot</span>
      </div>
    </div>
  );
}
