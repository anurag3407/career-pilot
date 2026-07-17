import React, { useState, useRef } from 'react';
import {
  motion, AnimatePresence,
  useInView, useScroll, useTransform, useSpring, useMotionValue,
} from 'framer-motion';
import {
  Github, Linkedin, Mail, ChevronDown, MapPin, User, Briefcase,
  ExternalLink, Puzzle, Calendar, Quote, Twitter, Send, CheckCircle,
} from 'lucide-react';
import { usePortfolio } from '../../../../context/PortfolioContext';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PUZZLE_PATH =
  'M 20,0 L 42,0 C 42,-12 58,-12 58,0 L 100,0 L 100,42 C 112,42 112,58 100,58 L 100,100 L 58,100 C 58,112 42,112 42,100 L 0,100 L 0,58 C -12,58 -12,42 0,42 L 0,0 Z';
const PUZZLE_VB = '-15 -15 130 130';
const EASE_OUT = [0.25, 0.46, 0.45, 0.94];
const EASE_SPRING = [0.34, 1.56, 0.64, 1];

// Bright funky palette
const C = {
  bg:      '#FFFBF0',
  surface: 'rgba(255,252,240,0.92)',
  border:  'rgba(0,0,0,0.08)',
  violet:  '#9B5DE5',
  indigo:  '#4361EE',
  cyan:    '#00D4FF',
  emerald: '#06D6A0',
  orange:  '#F77F00',
  pink:    '#F72585',
  blue:    '#4361EE',
  text:    '#1A1A2E',
  muted:   '#4A4E69',
  faint:   '#9A8C98',
};

const PIECE_COLORS = [
  '#FF1493','#00D4FF','#FFD700','#39FF14',
  '#9B5DE5','#F72585','#0066FF','#FF8C00',
  '#06D6A0','#FF6B35','#E91E63','#00BFFF',
];

// Quadrant clips for 2×2 assembly
// True jigsaw-shaped clip paths (objectBoundingBox 0-1 coords, Q = quadratic bezier for tab/notch bumps)
// TL: tab-right, tab-down  |  TR: notch-left, tab-down
// BL: notch-top, tab-right |  BR: notch-top,  notch-left
const CLIPS = [
  'url(#jig-tl)',
  'url(#jig-tr)',
  'url(#jig-bl)',
  'url(#jig-br)',
];

// True-3D scatter: x, y, z, rotateX, rotateY, rotateZ
const SCATTER_3D = [
  { x: -140, y: -100, z: -240, rotX: -32, rotY:  22, rotZ: -20 },
  { x:  140, y: -100, z:  190, rotX:  26, rotY: -26, rotZ:  20 },
  { x: -140, y:  100, z:  140, rotX: -22, rotY:  32, rotZ:  16 },
  { x:  140, y:  100, z: -170, rotX:  36, rotY: -22, rotZ: -16 },
];

const SKILL_SCATTER = [
  {x:-180,y:-120,z:-160,rotX:-24,rotY:18,rotZ:-22},{x:160,y:-100,z:140,rotX:20,rotY:-20,rotZ:18},
  {x:-140,y:80,z:120,rotX:-18,rotY:24,rotZ:30},{x:200,y:60,z:-140,rotX:28,rotY:-14,rotZ:-15},
  {x:-60,y:-160,z:100,rotX:-20,rotY:16,rotZ:25},{x:100,y:140,z:-120,rotX:22,rotY:-22,rotZ:-28},
  {x:-200,y:20,z:90,rotX:-16,rotY:20,rotZ:12},{x:140,y:-150,z:130,rotX:24,rotY:-16,rotZ:-20},
  {x:-80,y:120,z:-100,rotX:-14,rotY:22,rotZ:35},{x:180,y:100,z:110,rotX:18,rotY:-18,rotZ:-10},
  {x:-120,y:-60,z:-90,rotX:-22,rotY:14,rotZ:20},{x:60,y:-130,z:80,rotX:16,rotY:-20,rotZ:-32},
  {x:-160,y:160,z:70,rotX:-18,rotY:18,rotZ:15},{x:120,y:-80,z:-110,rotX:20,rotY:-14,rotZ:28},
  {x:-40,y:180,z:60,rotX:-12,rotY:16,rotZ:-18},
];

const COLOR_MAP = {
  Frontend: { fill: 'rgba(155,93,229,0.12)', stroke: 'rgba(155,93,229,0.60)', text: '#C77DFF', glow: 'rgba(155,93,229,0.4)' },
  Backend:  { fill: 'rgba(0,212,255,0.12)',  stroke: 'rgba(0,212,255,0.60)',  text: '#00D4FF', glow: 'rgba(0,212,255,0.4)'  },
  DevOps:   { fill: 'rgba(247,37,133,0.12)', stroke: 'rgba(247,37,133,0.60)', text: '#F72585', glow: 'rgba(247,37,133,0.4)' },
  Design:   { fill: 'rgba(255,215,0,0.12)',  stroke: 'rgba(255,215,0,0.60)',  text: '#FFD700', glow: 'rgba(255,215,0,0.4)'  },
  Core:     { fill: 'rgba(6,214,160,0.12)',  stroke: 'rgba(6,214,160,0.60)',  text: '#06D6A0', glow: 'rgba(6,214,160,0.4)'  },
};

const TECH_COLORS = ['#C77DFF','#00D4FF','#F72585','#06D6A0','#FFD700','#FF8C00'];

const CARD_ACCENTS = [
  { fill:'rgba(155,93,229,0.08)',  border:'rgba(155,93,229,0.28)',  dot:'#9B5DE5' },
  { fill:'rgba(0,212,255,0.08)',   border:'rgba(0,212,255,0.28)',   dot:'#00D4FF' },
  { fill:'rgba(247,37,133,0.08)',  border:'rgba(247,37,133,0.28)',  dot:'#F72585' },
  { fill:'rgba(6,214,160,0.08)',   border:'rgba(6,214,160,0.28)',   dot:'#06D6A0' },
];

const FINAL_PIECES = [
  {size:80,xStart:-300,yStart:-200,zStart:-300,rotX:-30,color:'#9B5DE5',delay:0   },
  {size:65,xStart: 300,yStart:-200,zStart: 250,rotX: 25,color:'#00D4FF',delay:0.08},
  {size:90,xStart:-350,yStart:   0,zStart: 200,rotX:-20,color:'#F72585',delay:0.16},
  {size:70,xStart: 350,yStart:   0,zStart:-220,rotX: 28,color:'#FFD700',delay:0.24},
  {size:75,xStart:-300,yStart: 200,zStart: 180,rotX:-24,color:'#06D6A0',delay:0.32},
  {size:60,xStart: 300,yStart: 200,zStart:-190,rotX: 22,color:'#FF1493',delay:0.40},
];

const SOCIAL_LINKS = [
  {key:'github',  Icon:Github,  label:'GitHub',  color:'#9B5DE5'},
  {key:'linkedin',Icon:Linkedin,label:'LinkedIn',color:'#00D4FF'},
  {key:'twitter', Icon:Twitter, label:'Twitter', color:'#F72585'},
  {key:'email',   Icon:Mail,    label:'Email',   color:'#06D6A0',isEmail:true},
];

// ─────────────────────────────────────────────────────────────────────────────
// BACKGROUND — scroll-driven jigsaw assembly / disassembly
// ─────────────────────────────────────────────────────────────────────────────

// Generates a unique jigsaw piece path on 0–100 grid
// [top, right, bottom, left]: 1 = tab outward, -1 = notch inward, 0 = flat
function makePiecePath(top, right, bottom, left) {
  const b = 16;
  let d = 'M 0,0 L 35,0 ';
  if (top !== 0)    d += `Q 35,${-b*top} 50,${-b*top} Q 65,${-b*top} 65,0 `;    else d += 'L 65,0 ';
  d += 'L 100,0 L 100,35 ';
  if (right !== 0)  d += `Q ${100+b*right},35 ${100+b*right},50 Q ${100+b*right},65 100,65 `; else d += 'L 100,65 ';
  d += 'L 100,100 L 65,100 ';
  if (bottom !== 0) d += `Q 65,${100+b*bottom} 50,${100+b*bottom} Q 35,${100+b*bottom} 35,100 `; else d += 'L 35,100 ';
  d += 'L 0,100 L 0,65 ';
  if (left !== 0)   d += `Q ${-b*left},65 ${-b*left},50 Q ${-b*left},35 0,35 `;  else d += 'L 0,35 ';
  d += 'L 0,0 Z';
  return d;
}

// 5 big bright puzzle clusters
// At scroll=0 (hero) → assembled/joined. Scroll down → disjoin. Scroll up → rejoin.
const BG_SCENES = [
  {
    id:'a', cx:'8%', cy:'14%', size:320, floatDur:6, floatDy:-20,
    scrollRange:[0.0, 0.28],
    pieces:[
      {sides:[ 1, 1, 1,-1],scatterX:-480,scatterY:-380,scatterRot: 40,color:'#FFD700'},
      {sides:[-1, 1, 1,-1],scatterX: 460,scatterY:-360,scatterRot:-34,color:'#FF8C00'},
      {sides:[-1, 1,-1,-1],scatterX:-440,scatterY: 460,scatterRot:-30,color:'#FFA500'},
      {sides:[-1,-1,-1, 1],scatterX: 450,scatterY: 440,scatterRot: 28,color:'#FFB300'},
    ],
  },
  {
    id:'b', cx:'86%', cy:'8%', size:360, floatDur:7.5, floatDy:-18,
    scrollRange:[0.0, 0.32],
    pieces:[
      {sides:[ 1, 1, 1, 1],scatterX:-520,scatterY:-420,scatterRot:-44,color:'#FF1493'},
      {sides:[ 1,-1, 1,-1],scatterX: 500,scatterY:-400,scatterRot: 38,color:'#FF69B4'},
      {sides:[-1, 1,-1, 1],scatterX:-480,scatterY: 500,scatterRot: 32,color:'#F72585'},
      {sides:[-1,-1,-1,-1],scatterX: 490,scatterY: 480,scatterRot:-30,color:'#E91E63'},
    ],
  },
  {
    id:'c', cx:'50%', cy:'85%', size:380, floatDur:8, floatDy:-22,
    scrollRange:[0.0, 0.36],
    pieces:[
      {sides:[ 1, 1, 1,-1],scatterX:-540,scatterY:-440,scatterRot: 46,color:'#00D4FF'},
      {sides:[ 1,-1, 1,-1],scatterX: 520,scatterY:-420,scatterRot:-40,color:'#0066FF'},
      {sides:[-1, 1,-1,-1],scatterX:-500,scatterY: 520,scatterRot:-34,color:'#00BFFF'},
      {sides:[-1,-1,-1, 1],scatterX: 510,scatterY: 500,scatterRot: 32,color:'#4361EE'},
    ],
  },
  {
    id:'d', cx:'5%', cy:'78%', size:300, floatDur:6.5, floatDy:-16,
    scrollRange:[0.0, 0.42],
    pieces:[
      {sides:[ 1, 1, 1, 1],scatterX:-460,scatterY:-360,scatterRot:-38,color:'#39FF14'},
      {sides:[ 1,-1, 1,-1],scatterX: 440,scatterY:-340,scatterRot: 32,color:'#00FF7F'},
      {sides:[-1, 1,-1, 1],scatterX:-420,scatterY: 440,scatterRot: 28,color:'#06D6A0'},
      {sides:[-1,-1,-1,-1],scatterX: 430,scatterY: 420,scatterRot:-26,color:'#00E676'},
    ],
  },
  {
    id:'e', cx:'90%', cy:'62%', size:340, floatDur:9, floatDy:-24,
    scrollRange:[0.0, 0.40],
    pieces:[
      {sides:[ 1, 1, 1,-1],scatterX:-500,scatterY:-400,scatterRot: 42,color:'#9B5DE5'},
      {sides:[-1, 1, 1,-1],scatterX: 480,scatterY:-380,scatterRot:-36,color:'#7B2FBE'},
      {sides:[-1, 1,-1,-1],scatterX:-460,scatterY: 480,scatterRot:-32,color:'#C77DFF'},
      {sides:[-1,-1,-1, 1],scatterX: 470,scatterY: 460,scatterRot: 30,color:'#8338EC'},
    ],
  },
];

function BgPuzzleGroup({ group, scrollYProgress }) {
  const S = group.size;
  const [s0, s1] = group.scrollRange;
  // Joined at scroll=0, disjoins as you scroll down, rejoins as you scroll up
  const joinRaw = useTransform(scrollYProgress, [s0, s1], [1, 0]);
  const join    = useSpring(joinRaw, {stiffness:55, damping:18});

  // Assembled corners of a 2×2 grid, centred on (0,0)
  const AO = [{x:-S/2,y:-S/2},{x:S/2,y:-S/2},{x:-S/2,y:S/2},{x:S/2,y:S/2}];

  const p0x = useTransform(join,[0,1],[group.pieces[0].scatterX, AO[0].x]);
  const p0y = useTransform(join,[0,1],[group.pieces[0].scatterY, AO[0].y]);
  const p0r = useTransform(join,[0,1],[group.pieces[0].scatterRot, 0]);
  const p1x = useTransform(join,[0,1],[group.pieces[1].scatterX, AO[1].x]);
  const p1y = useTransform(join,[0,1],[group.pieces[1].scatterY, AO[1].y]);
  const p1r = useTransform(join,[0,1],[group.pieces[1].scatterRot, 0]);
  const p2x = useTransform(join,[0,1],[group.pieces[2].scatterX, AO[2].x]);
  const p2y = useTransform(join,[0,1],[group.pieces[2].scatterY, AO[2].y]);
  const p2r = useTransform(join,[0,1],[group.pieces[2].scatterRot, 0]);
  const p3x = useTransform(join,[0,1],[group.pieces[3].scatterX, AO[3].x]);
  const p3y = useTransform(join,[0,1],[group.pieces[3].scatterY, AO[3].y]);
  const p3r = useTransform(join,[0,1],[group.pieces[3].scatterRot, 0]);
  const opacity = useTransform(join,[0,0.4,1],[0.10,0.28,0.55]);

  const PT = [
    {x:p0x,y:p0y,rotate:p0r},{x:p1x,y:p1y,rotate:p1r},
    {x:p2x,y:p2y,rotate:p2r},{x:p3x,y:p3y,rotate:p3r},
  ];

  return (
    <motion.div
      style={{position:'absolute',left:group.cx,top:group.cy,pointerEvents:'none'}}
      animate={{y:[0,group.floatDy,0]}}
      transition={{duration:group.floatDur,repeat:Infinity,ease:'easeInOut'}}>
      {group.pieces.map((piece,i)=>(
        <motion.div key={i}
          style={{position:'absolute',width:S,height:S,
            x:PT[i].x,y:PT[i].y,rotate:PT[i].rotate,opacity,
            marginLeft:-S/2,marginTop:-S/2,willChange:'transform'}}>
          <svg viewBox="-20 -20 140 140" style={{width:'100%',height:'100%',overflow:'visible'}}>
            <path
              d={makePiecePath(piece.sides[0],piece.sides[1],piece.sides[2],piece.sides[3])}
              fill={`${piece.color}30`} stroke={`${piece.color}CC`} strokeWidth="2.5"/>
          </svg>
        </motion.div>
      ))}
    </motion.div>
  );
}

function JigsawBackground() {
  const {scrollYProgress} = useScroll();
  return (
    <>
      <div className="fixed inset-0 pointer-events-none" style={{zIndex:0,background:C.bg}}/>
      <div className="fixed inset-0 pointer-events-none" style={{zIndex:0,
        background:'radial-gradient(ellipse 65% 55% at 20% 20%,rgba(255,215,0,0.10) 0%,transparent 60%),radial-gradient(ellipse 55% 50% at 82% 15%,rgba(255,20,147,0.08) 0%,transparent 60%),radial-gradient(ellipse 50% 45% at 90% 60%,rgba(155,93,229,0.08) 0%,transparent 60%),radial-gradient(ellipse 45% 40% at 10% 75%,rgba(57,255,20,0.07) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 50% 88%,rgba(0,212,255,0.07) 0%,transparent 60%)'}}/>
      <div className="fixed inset-0 pointer-events-none" style={{zIndex:0,overflow:'hidden'}}>
        {BG_SCENES.map(group=>(
          <BgPuzzleGroup key={group.id} group={group} scrollYProgress={scrollYProgress}/>
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG CLIP PATH DEFINITIONS — injected once, referenced everywhere
// Paths use clipPathUnits="objectBoundingBox" so coords are 0–1 relative to element.
// Q cx cy, x y = quadratic bezier: control point pulls curve out (tab) or in (notch).
// ─────────────────────────────────────────────────────────────────────────────

function PuzzleClipDefs() {
  return (
    <svg aria-hidden="true" style={{position:'absolute',width:0,height:0,overflow:'hidden',pointerEvents:'none'}}>
      <defs>
        {/* TL: right edge has TAB (bulges right), bottom edge has TAB (bulges down) */}
        <clipPath id="jig-tl" clipPathUnits="objectBoundingBox">
          <path d="M 0 0 L 0.5 0 L 0.5 0.12 Q 0.63 0.25 0.5 0.38 L 0.5 0.5 L 0.38 0.5 Q 0.25 0.63 0.12 0.5 L 0 0.5 Z"/>
        </clipPath>
        {/* TR: left edge has NOTCH (dips left), bottom edge has TAB (bulges down) */}
        <clipPath id="jig-tr" clipPathUnits="objectBoundingBox">
          <path d="M 0.5 0 L 1 0 L 1 0.5 L 0.88 0.5 Q 0.75 0.63 0.62 0.5 L 0.5 0.5 L 0.5 0.38 Q 0.37 0.25 0.5 0.12 Z"/>
        </clipPath>
        {/* BL: top edge has NOTCH (dips up), right edge has TAB (bulges right) */}
        <clipPath id="jig-bl" clipPathUnits="objectBoundingBox">
          <path d="M 0 0.5 L 0.12 0.5 Q 0.25 0.37 0.38 0.5 L 0.5 0.5 L 0.5 0.62 Q 0.63 0.75 0.5 0.88 L 0.5 1 L 0 1 Z"/>
        </clipPath>
        {/* BR: top edge has NOTCH (dips up), left edge has NOTCH (dips left) */}
        <clipPath id="jig-br" clipPathUnits="objectBoundingBox">
          <path d="M 1 0.5 L 0.88 0.5 Q 0.75 0.37 0.62 0.5 L 0.5 0.5 L 0.5 0.62 Q 0.37 0.75 0.5 0.88 L 0.5 1 L 1 1 Z"/>
        </clipPath>
      </defs>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PUZZLE ASSEMBLE — true 3D scatter-and-converge
// ─────────────────────────────────────────────────────────────────────────────

function PuzzleAssemble({ children, className='', delay=0, triggerAmount=0.2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, amount:triggerAmount });
  return (
    <div ref={ref} className={`relative ${className}`} style={{perspective:'1100px'}}>
      <div style={{visibility:'hidden',pointerEvents:'none'}} aria-hidden="true">{children}</div>
      {CLIPS.map((clip,i)=>(
        <motion.div key={i} className="absolute inset-0"
          style={{clipPath:clip,transformStyle:'preserve-3d',willChange:'transform'}}
          initial={{
            x:SCATTER_3D[i].x, y:SCATTER_3D[i].y, z:SCATTER_3D[i].z,
            rotateX:SCATTER_3D[i].rotX, rotateY:SCATTER_3D[i].rotY, rotateZ:SCATTER_3D[i].rotZ,
            opacity:0,
          }}
          animate={inView ? {x:0,y:0,z:0,rotateX:0,rotateY:0,rotateZ:0,opacity:1} : {}}
          transition={{delay:delay+i*0.1, type:'spring', stiffness:155, damping:22}}>
          {children}
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PUZZLE HEADING — 3D letter assembly with continuous float
// ─────────────────────────────────────────────────────────────────────────────

const letterV3D = {
  hidden:  { opacity:0, y:32, rotateX:-65, z:-90, scale:0.7 },
  visible: (i) => ({
    opacity:1, y:0, rotateX:0, z:0, scale:1,
    transition:{ type:'spring', stiffness:280, damping:22, delay:i*0.036 },
  }),
};

// Each word flies in ON a jigsaw puzzle piece — the piece itself (SVG shape) is visible
// and carries the word text. Pieces scatter from 3D then lock into the heading line.
const WORD_SCATTER = [
  { x:-160, y:-60,  z:-180, rotX:-28, rotY: 20, rotZ:-18 },
  { x: 160, y:-50,  z: 140, rotX: 24, rotY:-22, rotZ: 16 },
  { x:-140, y: 55,  z: 120, rotX:-20, rotY: 18, rotZ: 22 },
  { x: 140, y: 50,  z:-150, rotX: 22, rotY:-20, rotZ:-14 },
  { x:-120, y:-80,  z: 100, rotX:-18, rotY: 24, rotZ: 20 },
  { x: 120, y: 70,  z:-110, rotX: 26, rotY:-16, rotZ:-18 },
  { x:-100, y: 60,  z: 90,  rotX:-22, rotY: 18, rotZ: 14 },
  { x: 100, y:-70,  z:-80,  rotX: 18, rotY:-22, rotZ:-16 },
];

function PuzzleHeading({ label, title, accentColor=C.violet, gradientTo=C.cyan }) {
  const words = title.split(' ');
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, amount:0.4 });

  return (
    <div className="mb-10" ref={ref}>
      {label && (
        <motion.div
          initial={{opacity:0,x:-16}} animate={inView?{opacity:1,x:0}:{}}
          transition={{duration:0.45,ease:EASE_OUT}}
          className="flex items-center gap-2.5 mb-3">
          <motion.div animate={{rotateY:[0,180,360]}} transition={{duration:6,repeat:Infinity,ease:'linear'}}>
            <svg width="16" height="16" viewBox={PUZZLE_VB} aria-hidden="true">
              <path d={PUZZLE_PATH} fill={`${accentColor}28`} stroke={`${accentColor}cc`} strokeWidth="2.5"/>
            </svg>
          </motion.div>
          <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{color:accentColor}}>{label}</span>
        </motion.div>
      )}

      {/* Each word flies in on its own jigsaw piece */}
      <h2 className="flex flex-wrap gap-2 items-end" style={{perspective:'900px',lineHeight:1.15}}>
        {words.map((word, wi) => {
          const sc = WORD_SCATTER[wi % WORD_SCATTER.length];
          const clipId = ['tl','tr','bl','br'][wi % 4];
          // idle float direction alternates per word
          const floatY = wi%2===0 ? [0,-6,0] : [0,-4,0];
          return (
            <motion.span
              key={wi}
              // wrapper provides perspective context and idle float
              style={{
                display:'inline-block',
                perspective:'600px',
                willChange:'transform',
              }}
              animate={inView ? {y:floatY} : {}}
              transition={inView ? {duration:3.2+wi*0.35,repeat:Infinity,ease:'easeInOut',delay:wi*0.25+1.0} : {}}
            >
              {/* The piece: puzzle-shaped background + word text */}
              <motion.span
                style={{
                  display:'inline-block',
                  position:'relative',
                  padding:'0.28em 0.55em',
                  willChange:'transform',
                }}
                initial={{
                  opacity:0,
                  x:sc.x, y:sc.y, z:sc.z,
                  rotateX:sc.rotX, rotateY:sc.rotY, rotateZ:sc.rotZ,
                  scale:0.65,
                }}
                animate={inView ? {
                  opacity:1, x:0, y:0, z:0,
                  rotateX:0, rotateY:0, rotateZ:0, scale:1,
                } : {}}
                transition={{
                  delay: wi*0.13,
                  type:'spring', stiffness:175, damping:22,
                }}
                whileHover={{
                  z:30, rotateX:-6, rotateY:wi%2===0?-6:6,
                  transition:{type:'spring',stiffness:350,damping:22},
                }}
              >
                {/* Puzzle piece SVG background */}
                <svg
                  viewBox={PUZZLE_VB}
                  aria-hidden="true"
                  style={{
                    position:'absolute', inset:0,
                    width:'100%', height:'100%',
                    filter:`drop-shadow(0 4px 12px ${accentColor}55)`,
                  }}
                >
                  <path
                    d={PUZZLE_PATH}
                    fill={`${accentColor}16`}
                    stroke={`${accentColor}70`}
                    strokeWidth="1.8"
                  />
                </svg>
                {/* Word text sits on top */}
                <span
                  className="relative font-extrabold"
                  style={{
                    fontSize:'clamp(1.6rem,4vw,3.2rem)',
                    background:`linear-gradient(135deg,${C.text} 20%,${accentColor})`,
                    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                    letterSpacing:'-0.02em',
                  }}
                >
                  {word}
                </span>
              </motion.span>
            </motion.span>
          );
        })}
      </h2>

      {/* Underline draws in after all pieces assemble */}
      <div className="flex items-center gap-3 mt-5">
        <motion.div
          initial={{scaleX:0,originX:0}} animate={inView?{scaleX:1}:{}}
          transition={{duration:0.7,delay:words.length*0.13+0.4,ease:EASE_SPRING}}
          className="h-0.5 w-16 rounded-full"
          style={{background:`linear-gradient(90deg,${accentColor},${gradientTo})`}}/>
        <motion.div
          initial={{opacity:0,scale:0,rotateZ:-90}}
          animate={inView?{opacity:0.65,scale:1,rotateZ:0}:{}}
          transition={{delay:words.length*0.13+0.9,type:'spring',stiffness:320,damping:18}}>
          <svg width="12" height="12" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill={`${accentColor}30`} stroke={`${accentColor}aa`} strokeWidth="2.5"/>
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED — PuzzleButton
// ─────────────────────────────────────────────────────────────────────────────

const btnCornerV = {
  rest:  {opacity:0,scale:0.4},
  hover: {opacity:0.75,scale:1,transition:{type:'spring',stiffness:380,damping:20}},
};

function PuzzleButton({ children, href, onClick, variant='primary', accentColor=C.violet, as:Tag='button' }) {
  const El = href?'a':Tag;
  const extra = href?{href,target:'_blank',rel:'noopener noreferrer'}:{onClick};
  const isPrimary = variant==='primary';
  return (
    <motion.div initial="rest" whileHover="hover" whileTap={{scale:0.95}} className="relative inline-flex"
      style={{perspective:'600px'}}>
      <motion.div whileHover={{z:12,rotateX:-4}} style={{transformStyle:'preserve-3d',willChange:'transform'}}>
        <El {...extra}
          className="relative flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold overflow-hidden select-none"
          style={isPrimary
            ?{background:`linear-gradient(135deg,${accentColor},#1A0050)`,color:'#fff',boxShadow:`0 4px 24px ${accentColor}50`}
            :{border:`1px solid ${C.border}`,background:C.surface,color:C.muted,backdropFilter:'blur(8px)'}}>
          {isPrimary && (
            <motion.span variants={{rest:{x:'-110%'},hover:{x:'110%',transition:{duration:0.4}}}}
              aria-hidden="true"
              style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)',pointerEvents:'none'}}/>
          )}
          {children}
        </El>
      </motion.div>
      <motion.div variants={btnCornerV} aria-hidden="true" className="absolute -top-2 -right-2 pointer-events-none">
        <svg width="18" height="18" viewBox={PUZZLE_VB}><path d={PUZZLE_PATH} fill={`${accentColor}22`} stroke={`${accentColor}88`} strokeWidth="2"/></svg>
      </motion.div>
      <motion.div variants={btnCornerV} aria-hidden="true" className="absolute -bottom-2 -left-2 pointer-events-none">
        <svg width="14" height="14" viewBox={PUZZLE_VB}><path d={PUZZLE_PATH} fill={`${accentColor}18`} stroke={`${accentColor}70`} strokeWidth="2"/></svg>
      </motion.div>
    </motion.div>
  );
}

function InputField({ label, type='text', value, onChange, placeholder, multiline }) {
  const El = multiline?'textarea':'input';
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold tracking-wider uppercase" style={{color:C.faint}}>{label}</label>
      <El type={type} value={value} onChange={onChange} placeholder={placeholder}
        rows={multiline?4:undefined}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all"
        style={{background:C.surface,border:`1px solid ${C.border}`,color:C.text}}
        onFocus={e=>(e.target.style.borderColor=`${C.violet}88`)}
        onBlur={e =>(e.target.style.borderColor=C.border)}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

const heroLetterV = {
  hidden:  {opacity:0,y:50,rotateX:-70,z:-100,scale:0.55},
  visible: {opacity:1,y:0,rotateX:0,z:0,scale:1,
    transition:{type:'spring',stiffness:260,damping:22}},
};

const heroQuadDefs = [
  {id:'tl',clipPath:'url(#jig-tl)', x:-140,y:-105,z:-220,rotX:-28,rotY: 22,rotZ:-20},
  {id:'tr',clipPath:'url(#jig-tr)', x: 140,y:-105,z: 200,rotX: 24,rotY:-26,rotZ: 20},
  {id:'bl',clipPath:'url(#jig-bl)', x:-140,y: 105,z: 160,rotX:-20,rotY: 30,rotZ: 16},
  {id:'br',clipPath:'url(#jig-br)', x: 140,y: 105,z:-180,rotX: 32,rotY:-20,rotZ:-16},
];

function Hero({ personal, socials, stats }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{zIndex:1}}>
      <div className="absolute inset-0 pointer-events-none"
        style={{background:'radial-gradient(ellipse 80% 55% at 50% 45%,rgba(155,93,229,0.14) 0%,transparent 70%)'}}/>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full">

        {/* Profile avatar — true 3D quad assembly */}
        <div style={{perspective:'900px',marginBottom:32}}>
          <motion.div className="relative" style={{width:148,height:148,transformStyle:'preserve-3d'}}
             initial="hidden" animate={{y:[0,-8,0]}}
             transition={{duration:4,repeat:Infinity,ease:'easeInOut',delay:2.5}}>
             <motion.div className="relative" style={{width:148,height:148}}
              initial="hidden" animate="visible"
              variants={{hidden:{},visible:{transition:{staggerChildren:0.14,delayChildren:0.2}}}}>
              {heroQuadDefs.map(q=>(
                <motion.div key={q.id} className="absolute inset-0"
                  style={{clipPath:q.clipPath,transformStyle:'preserve-3d',willChange:'transform'}}
                  variants={{
                    hidden:{opacity:0,x:q.x,y:q.y,z:q.z,rotateX:q.rotX,rotateY:q.rotY,rotateZ:q.rotZ},
                    visible:{opacity:1,x:0,y:0,z:0,rotateX:0,rotateY:0,rotateZ:0,
                      transition:{type:'spring',stiffness:175,damping:24}},
                  }}>
                  {personal?.avatar
                    ?<img src={personal.avatar} alt={personal?.name} className="w-full h-full object-cover rounded-2xl" style={{filter:'saturate(1.15)'}}/>
                    :<div className="w-full h-full rounded-2xl" style={{background:'linear-gradient(135deg,#9B5DE5,#00D4FF)'}}/>}
                </motion.div>
              ))}
            </motion.div>
            {/* Orbit ring */}
            <motion.div className="absolute -inset-4 pointer-events-none"
              initial={{opacity:0,rotateZ:0}} animate={{opacity:0.5,rotateZ:360}}
              transition={{opacity:{delay:1,duration:0.5},rotateZ:{duration:18,repeat:Infinity,ease:'linear'}}}>
              <svg viewBox={PUZZLE_VB} className="w-full h-full">
                <path d={PUZZLE_PATH} fill="none" stroke="rgba(155,93,229,0.55)" strokeWidth="1.5"/>
              </svg>
            </motion.div>
            {/* Glow */}
            <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{opacity:[0.2,0.55,0.2]}}
              transition={{duration:3,repeat:Infinity,ease:'easeInOut'}}
              style={{boxShadow:'0 0 50px rgba(155,93,229,0.35)'}}/>
          </motion.div>
        </div>

        {/* Label */}
        <motion.p initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
          className="text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{color:C.violet}}>
          Puzzle Assembly — Portfolio
        </motion.p>

        {/* Name — 3D letter assembly */}
        <div style={{perspective:'900px',marginBottom:16}}>
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold flex flex-wrap justify-center gap-x-5"
            variants={{hidden:{},visible:{transition:{staggerChildren:0.05,delayChildren:0.5}}}}
            initial="hidden" animate="visible">
            {(personal?.name||'Your Name').split(' ').map((word,wi)=>(
              <motion.span key={wi} className="flex"
                animate={{y:[0,-6,0]}}
                transition={{duration:3.5+wi*0.5,repeat:Infinity,ease:'easeInOut',delay:wi*0.4+2}}>
                {word.split('').map((ch,ci)=>(
                  <motion.span key={ci} variants={heroLetterV}
                    style={{display:'inline-block',background:`linear-gradient(155deg,${C.text} 20%,${C.violet})`,
                      WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',willChange:'transform'}}>
                    {ch}
                  </motion.span>
                ))}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        <motion.p initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{delay:1.1,duration:0.55}}
          className="text-lg md:text-2xl font-light mb-3" style={{color:C.muted}}>{personal?.title}</motion.p>

        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.3,duration:0.5}}
          className="text-sm md:text-base max-w-lg mb-10 leading-relaxed" style={{color:C.faint}}>{personal?.tagline}</motion.p>

        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:1.5}}
          className="flex flex-wrap gap-4 justify-center mb-14">
          <PuzzleButton href={socials?.github} variant="primary" accentColor={C.violet}><Github size={15}/> View Work</PuzzleButton>
          <PuzzleButton href={socials?.linkedin} variant="outline"><Linkedin size={15}/> Connect</PuzzleButton>
          <PuzzleButton href={`mailto:${socials?.email||''}`} variant="outline"><Mail size={15}/> Contact</PuzzleButton>
        </motion.div>

        {/* Stats */}
        <motion.div variants={{visible:{transition:{staggerChildren:0.1,delayChildren:1.7}}}}
          initial="hidden" animate="visible" className="flex gap-10 md:gap-20" style={{perspective:'600px'}}>
          {[{label:'Years',value:stats?.yearsExperience},{label:'Projects',value:stats?.projectsCompleted},{label:'Clients',value:stats?.happyClients}].map((s,i)=>(
            <motion.div key={s.label}
              variants={{hidden:{opacity:0,y:35,z:-60,rotateX:-30},visible:{opacity:1,y:0,z:0,rotateX:0,transition:{duration:0.6,ease:EASE_SPRING}}}}
              className="text-center" whileHover={{z:20,y:-6,rotateX:-8}} style={{willChange:'transform'}}>
              <div className="text-3xl font-bold"
                style={{background:`linear-gradient(135deg,${C.violet},${C.cyan})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
                {s.value}+
              </div>
              <div className="text-[10px] mt-1 tracking-widest uppercase" style={{color:C.faint}}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        animate={{y:[0,10,0]}} transition={{duration:2.2,repeat:Infinity,ease:'easeInOut'}}>
        <span className="text-[10px] tracking-widest uppercase" style={{color:C.faint}}>Scroll</span>
        <ChevronDown size={18} style={{color:C.faint}}/>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────────────────────────

const AVATAR_QUADS = [
  {clipPath:'url(#jig-tl)', xStart:-90,yStart:-70,z:-160,rotX:-26,rotY: 20},
  {clipPath:'url(#jig-tr)', xStart: 90,yStart:-70,z: 140,rotX: 22,rotY:-24},
  {clipPath:'url(#jig-bl)', xStart:-90,yStart: 70,z: 110,rotX:-18,rotY: 26},
  {clipPath:'url(#jig-br)', xStart: 90,yStart: 70,z:-130,rotX: 28,rotY:-18},
];

function StatTile({ value, label, delay }) {
  return (
    <motion.div className="relative flex flex-col items-center justify-center"
      style={{width:110,height:110,perspective:'500px'}}
      initial={{opacity:0,scale:0.6,y:28,z:-80,rotateX:-30}}
      whileInView={{opacity:1,scale:1,y:0,z:0,rotateX:0}}
      viewport={{once:true,amount:0.6}}
      transition={{delay,type:'spring',stiffness:260,damping:22}}
      whileHover={{scale:1.1,y:-6,z:30,rotateX:-10}}>
      <svg viewBox={PUZZLE_VB} className="absolute inset-0 w-full h-full">
        <path d={PUZZLE_PATH} fill="rgba(155,93,229,0.1)" stroke="rgba(155,93,229,0.4)" strokeWidth="1.5"/>
      </svg>
      <div className="relative z-10 text-center px-2">
        <div className="text-2xl font-bold"
          style={{background:`linear-gradient(135deg,${C.violet},${C.cyan})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
          {value}+
        </div>
        <div className="text-[9px] mt-0.5 tracking-wider uppercase leading-tight" style={{color:C.faint}}>{label}</div>
      </div>
    </motion.div>
  );
}

function About({ personal, stats }) {
  const ref = useRef(null);
  const {scrollYProgress} = useScroll({target:ref,offset:['start end','center center']});
  const smooth = useSpring(scrollYProgress,{stiffness:80,damping:20});

  // Per-quad transforms (no hooks in loops)
  const q0x = useTransform(smooth,[0,1],[AVATAR_QUADS[0].xStart,0]);
  const q0y = useTransform(smooth,[0,1],[AVATAR_QUADS[0].yStart,0]);
  const q0z = useTransform(smooth,[0,1],[AVATAR_QUADS[0].z,0]);
  const q0rX= useTransform(smooth,[0,1],[AVATAR_QUADS[0].rotX,0]);
  const q0rY= useTransform(smooth,[0,1],[AVATAR_QUADS[0].rotY,0]);
  const q1x = useTransform(smooth,[0,1],[AVATAR_QUADS[1].xStart,0]);
  const q1y = useTransform(smooth,[0,1],[AVATAR_QUADS[1].yStart,0]);
  const q1z = useTransform(smooth,[0,1],[AVATAR_QUADS[1].z,0]);
  const q1rX= useTransform(smooth,[0,1],[AVATAR_QUADS[1].rotX,0]);
  const q1rY= useTransform(smooth,[0,1],[AVATAR_QUADS[1].rotY,0]);
  const q2x = useTransform(smooth,[0,1],[AVATAR_QUADS[2].xStart,0]);
  const q2y = useTransform(smooth,[0,1],[AVATAR_QUADS[2].yStart,0]);
  const q2z = useTransform(smooth,[0,1],[AVATAR_QUADS[2].z,0]);
  const q2rX= useTransform(smooth,[0,1],[AVATAR_QUADS[2].rotX,0]);
  const q2rY= useTransform(smooth,[0,1],[AVATAR_QUADS[2].rotY,0]);
  const q3x = useTransform(smooth,[0,1],[AVATAR_QUADS[3].xStart,0]);
  const q3y = useTransform(smooth,[0,1],[AVATAR_QUADS[3].yStart,0]);
  const q3z = useTransform(smooth,[0,1],[AVATAR_QUADS[3].z,0]);
  const q3rX= useTransform(smooth,[0,1],[AVATAR_QUADS[3].rotX,0]);
  const q3rY= useTransform(smooth,[0,1],[AVATAR_QUADS[3].rotY,0]);
  const qMotion=[
    {x:q0x,y:q0y,z:q0z,rotateX:q0rX,rotateY:q0rY},
    {x:q1x,y:q1y,z:q1z,rotateX:q1rX,rotateY:q1rY},
    {x:q2x,y:q2y,z:q2z,rotateX:q2rX,rotateY:q2rY},
    {x:q3x,y:q3y,z:q3z,rotateX:q3rX,rotateY:q3rY},
  ];
  const opacity = useTransform(smooth,[0.05,0.65],[0,1]);
  const ringOp  = useTransform(smooth,[0.4,1],[0,0.55]);
  const avatarY = useTransform(smooth,[0,1],[30,0]);

  return (
    <section ref={ref} className="relative py-28 px-6 overflow-hidden" style={{zIndex:1}}>
      <div className="absolute inset-0 pointer-events-none"
        style={{background:'radial-gradient(ellipse 40% 50% at 88% 50%,rgba(0,212,255,0.07) 0%,transparent 70%)'}}/>
      <div className="max-w-6xl mx-auto">
        <PuzzleHeading label="About" title="The Pieces That Define Me" accentColor={C.violet} gradientTo={C.cyan}/>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <PuzzleAssemble delay={0.1} className="flex flex-col items-center gap-8">
            {/* 3D avatar */}
            <div style={{perspective:'900px'}}>
              <motion.div className="relative" style={{width:200,height:200,y:avatarY}}>
                {AVATAR_QUADS.map((q,i)=>(
                  <motion.div key={i} className="absolute inset-0"
                    style={{clipPath:q.clipPath,transformStyle:'preserve-3d',willChange:'transform',
                      x:qMotion[i].x,y:qMotion[i].y,z:qMotion[i].z,
                      rotateX:qMotion[i].rotateX,rotateY:qMotion[i].rotateY,opacity}}>
                    {personal?.avatar
                      ?<img src={personal.avatar} alt={personal?.name} className="w-full h-full object-cover rounded-2xl"/>
                      :<div className="w-full h-full rounded-2xl" style={{background:'linear-gradient(135deg,#9B5DE5,#00D4FF)'}}/>}
                  </motion.div>
                ))}
                <motion.div aria-hidden="true" className="absolute -inset-4 pointer-events-none"
                  style={{opacity:ringOp}}>
                  <svg viewBox={PUZZLE_VB} className="w-full h-full">
                    <path d={PUZZLE_PATH} fill="none" stroke="rgba(155,93,229,0.45)" strokeWidth="1.5"/>
                  </svg>
                </motion.div>
                <motion.div aria-hidden="true" className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{opacity:[0.15,0.45,0.15]}}
                  transition={{duration:3.5,repeat:Infinity,ease:'easeInOut'}}
                  style={{boxShadow:'0 0 50px rgba(155,93,229,0.3)'}}/>
              </motion.div>
            </div>
            <div className="flex gap-2">
              <StatTile value={stats?.yearsExperience}   label="Years Exp."  delay={0}/>
              <StatTile value={stats?.projectsCompleted} label="Projects"    delay={0.12}/>
              <StatTile value={stats?.happyClients}      label="Clients"     delay={0.24}/>
            </div>
            {personal?.location && (
              <motion.div initial={{opacity:0}} whileInView={{opacity:1}}
                viewport={{once:true}} transition={{delay:0.5}}
                className="flex items-center gap-2 text-sm" style={{color:C.faint}}>
                <MapPin size={13} style={{color:C.violet}}/> {personal.location}
              </motion.div>
            )}
          </PuzzleAssemble>

          <PuzzleAssemble delay={0.2} className="flex flex-col gap-5">
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:24,backdropFilter:'blur(10px)'}}>
              <div className="flex items-center gap-2 mb-3">
                <User size={13} style={{color:C.violet}}/>
                <span className="text-xs font-bold tracking-wider uppercase" style={{color:C.violet}}>Introduction</span>
              </div>
              <p className="text-sm md:text-base leading-relaxed" style={{color:C.muted}}>{personal?.bio}</p>
            </div>
            <div style={{background:'rgba(155,93,229,0.07)',border:'1px solid rgba(155,93,229,0.22)',borderRadius:16,padding:24}}>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase size={13} style={{color:C.violet}}/>
                <span className="text-xs font-bold tracking-wider uppercase" style={{color:C.violet}}>Current Role</span>
              </div>
              <p className="font-semibold text-lg" style={{color:C.text}}>{personal?.title}</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              {[0.15,0.28,0.42].map((op,i)=>(
                <motion.div key={i}
                  animate={{opacity:[op,op*2.2,op],scale:[1,1.15,1],rotateZ:[0,15,0]}}
                  transition={{duration:3+i*0.6,repeat:Infinity,delay:i*0.7,ease:'easeInOut'}}>
                  <svg width="26" height="26" viewBox={PUZZLE_VB}>
                    <path d={PUZZLE_PATH} fill="rgba(155,93,229,0.14)" stroke="rgba(155,93,229,0.45)" strokeWidth="2"/>
                  </svg>
                </motion.div>
              ))}
              <span className="text-xs" style={{color:C.faint}}>Every piece connects.</span>
            </div>
          </PuzzleAssemble>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────────────────────────────────────

function SkillPiece({ skill, index, hoveredSkill, onHover, onLeave }) {
  const scatter = SKILL_SCATTER[index%SKILL_SCATTER.length];
  const colors  = COLOR_MAP[skill.category]||COLOR_MAP.Core;
  const isNeighbor = hoveredSkill && hoveredSkill!==skill.name;
  const isHovered  = hoveredSkill===skill.name;

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center cursor-default select-none"
      style={{width:130,height:130,perspective:'600px',willChange:'transform'}}
      initial={{opacity:0,x:scatter.x,y:scatter.y,z:scatter.z,
        rotateX:scatter.rotX,rotateY:scatter.rotY,rotateZ:scatter.rotZ,scale:0.4}}
      whileInView={{opacity:1,x:0,y:0,z:0,rotateX:0,rotateY:0,rotateZ:0,scale:1}}
      viewport={{once:true,amount:0.3}}
      transition={{delay:(index%8)*0.055,type:'spring',stiffness:210,damping:22}}
      onHoverStart={()=>onHover(skill.name)}
      onHoverEnd={onLeave}
      whileHover={{scale:1.14,y:-10,z:50,rotateX:-8,zIndex:20,
        filter:`drop-shadow(0 12px 28px ${colors.glow})`}}>

      <motion.svg viewBox={PUZZLE_VB} className="absolute inset-0 w-full h-full"
        animate={isNeighbor
          ?{rotateY:[0,6,0],filter:`drop-shadow(0 0 8px ${colors.glow})`}
          :isHovered
          ?{filter:`drop-shadow(0 0 16px ${colors.glow})`}
          :{filter:'none'}}
        transition={{duration:0.3}}>
        <path d={PUZZLE_PATH} fill={colors.fill} stroke={colors.stroke} strokeWidth="1.5"/>
      </motion.svg>

      <div className="relative z-10 text-center px-3">
        <div className="text-xs font-bold leading-tight mb-1" style={{color:colors.text}}>{skill.name}</div>
        <div className="text-[10px] font-semibold mb-1.5" style={{color:colors.stroke.replace('0.55','0.9')}}>
          {skill.level}%
        </div>
        <div className="w-10 h-[3px] rounded-full mx-auto overflow-hidden" style={{background:'rgba(255,255,255,0.08)'}}>
          <motion.div className="h-full rounded-full" style={{background:colors.stroke.replace('0.55','0.9')}}
            initial={{width:0}}
            whileInView={{width:`${skill.level}%`}}
            viewport={{once:true}}
            transition={{duration:0.9,delay:(index%8)*0.055+0.4,ease:EASE_SPRING}}/>
        </div>
      </div>

      {/* Chain glow on hover */}
      <motion.div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-xl"
        animate={isHovered?{opacity:1}:{opacity:0}}
        style={{boxShadow:`0 0 30px ${colors.glow},0 0 60px ${colors.glow}40`}}/>
    </motion.div>
  );
}

function Skills({ skills }) {
  const [tab,setTab]=useState('All');
  const [hoveredSkill,setHoveredSkill]=useState(null);
  const cats=['All',...[...new Set((skills||[]).map(s=>s.category||'Core'))]];
  const filtered=tab==='All'?(skills||[]):(skills||[]).filter(s=>(s.category||'Core')===tab);

  return (
    <section className="relative py-28 px-6 overflow-hidden" style={{zIndex:1}}>
      <div className="absolute inset-0 pointer-events-none"
        style={{background:'radial-gradient(ellipse 50% 40% at 85% 50%,rgba(0,212,255,0.08) 0%,transparent 70%)'}}/>
      <div className="max-w-6xl mx-auto">
        <PuzzleHeading label="Skills" title="Skills That Fit Together" accentColor={C.cyan} gradientTo={C.violet}/>
        <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}}
          viewport={{once:true}} transition={{delay:0.2}}
          className="flex flex-wrap gap-2 mb-12">
          {cats.map(t=>(
            <motion.button key={t} onClick={()=>setTab(t)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold"
              style={tab===t
                ?{background:'rgba(0,212,255,0.14)',border:'1px solid rgba(0,212,255,0.5)',color:C.cyan}
                :{background:C.surface,border:`1px solid ${C.border}`,color:C.faint}}
              whileTap={{scale:0.94}}
              whileHover={{scale:1.06,z:10}}>
              {t}
            </motion.button>
          ))}
        </motion.div>
        <AnimatePresence mode="popLayout">
          <motion.div key={tab} className="flex flex-wrap gap-4 justify-start"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}}>
            {filtered.map((skill,i)=>(
              <SkillPiece key={skill.name} skill={skill} index={i}
                hoveredSkill={hoveredSkill} onHover={setHoveredSkill} onLeave={()=>setHoveredSkill(null)}/>
            ))}
          </motion.div>
        </AnimatePresence>
        <motion.div initial={{opacity:0}} whileInView={{opacity:1}}
          viewport={{once:true}} transition={{delay:0.5}}
          className="mt-14 pt-8 flex items-center gap-3"
          style={{borderTop:`1px solid ${C.border}`}}>
          <svg width="15" height="15" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="2"/>
          </svg>
          <span className="text-sm" style={{color:C.faint}}>
            {(skills||[]).length} pieces assembled into a complete skill set
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────────────────────

const PROJ_QUADS = [
  {clip:'url(#jig-tl)', xOff:-32,yOff:-25,zOff:-80, rotX:-18,rotY: 14},
  {clip:'url(#jig-tr)', xOff: 32,yOff:-25,zOff: 70, rotX: 16,rotY:-18},
  {clip:'url(#jig-bl)', xOff:-32,yOff: 25,zOff: 60, rotX:-14,rotY: 20},
  {clip:'url(#jig-br)', xOff: 32,yOff: 25,zOff:-70, rotX: 20,rotY:-14},
];

function useTilt() {
  const mx=useMotionValue(0),my=useMotionValue(0);
  const rotX=useSpring(useTransform(my,[-0.5,0.5],[12,-12]),{stiffness:400,damping:30});
  const rotY=useSpring(useTransform(mx,[-0.5,0.5],[-12,12]),{stiffness:400,damping:30});
  const tz  =useSpring(useTransform(mx,[-0.5,0.5],[-8,8]),  {stiffness:300,damping:25});
  const onMove=e=>{
    const r=e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX-r.left)/r.width-0.5);
    my.set((e.clientY-r.top)/r.height-0.5);
  };
  const onLeave=()=>{mx.set(0);my.set(0);};
  return {rotX,rotY,tz,onMove,onLeave};
}

function ProjectCard({ project, index }) {
  const cardRef=useRef(null);
  const tilt=useTilt();
  const [hovered,setHovered]=useState(false);
  const {scrollYProgress}=useScroll({target:cardRef,offset:['start end','0.65 end']});
  const smooth=useSpring(scrollYProgress,{stiffness:70,damping:18});

  // Scroll-driven 3D image quad offsets (6 values per quad: x,y,z,rotX,rotY — all declared statically)
  const q0x=useTransform(smooth,[0,1],[PROJ_QUADS[0].xOff,0]);
  const q0y=useTransform(smooth,[0,1],[PROJ_QUADS[0].yOff,0]);
  const q0z=useTransform(smooth,[0,1],[PROJ_QUADS[0].zOff,0]);
  const q0rX=useTransform(smooth,[0,1],[PROJ_QUADS[0].rotX,0]);
  const q0rY=useTransform(smooth,[0,1],[PROJ_QUADS[0].rotY,0]);
  const q1x=useTransform(smooth,[0,1],[PROJ_QUADS[1].xOff,0]);
  const q1y=useTransform(smooth,[0,1],[PROJ_QUADS[1].yOff,0]);
  const q1z=useTransform(smooth,[0,1],[PROJ_QUADS[1].zOff,0]);
  const q1rX=useTransform(smooth,[0,1],[PROJ_QUADS[1].rotX,0]);
  const q1rY=useTransform(smooth,[0,1],[PROJ_QUADS[1].rotY,0]);
  const q2x=useTransform(smooth,[0,1],[PROJ_QUADS[2].xOff,0]);
  const q2y=useTransform(smooth,[0,1],[PROJ_QUADS[2].yOff,0]);
  const q2z=useTransform(smooth,[0,1],[PROJ_QUADS[2].zOff,0]);
  const q2rX=useTransform(smooth,[0,1],[PROJ_QUADS[2].rotX,0]);
  const q2rY=useTransform(smooth,[0,1],[PROJ_QUADS[2].rotY,0]);
  const q3x=useTransform(smooth,[0,1],[PROJ_QUADS[3].xOff,0]);
  const q3y=useTransform(smooth,[0,1],[PROJ_QUADS[3].yOff,0]);
  const q3z=useTransform(smooth,[0,1],[PROJ_QUADS[3].zOff,0]);
  const q3rX=useTransform(smooth,[0,1],[PROJ_QUADS[3].rotX,0]);
  const q3rY=useTransform(smooth,[0,1],[PROJ_QUADS[3].rotY,0]);

  const qM=[
    {x:q0x,y:q0y,z:q0z,rotateX:q0rX,rotateY:q0rY},
    {x:q1x,y:q1y,z:q1z,rotateX:q1rX,rotateY:q1rY},
    {x:q2x,y:q2y,z:q2z,rotateX:q2rX,rotateY:q2rY},
    {x:q3x,y:q3y,z:q3z,rotateX:q3rX,rotateY:q3rY},
  ];
  const cardOpacity=useTransform(smooth,[0,0.4],[0,1]);
  const cardY      =useTransform(smooth,[0,1],[50,0]);
  const cardZ      =useTransform(smooth,[0,1],[-120,0]);

  return (
    <motion.div ref={cardRef}
      style={{opacity:cardOpacity,y:cardY,z:cardZ,
        rotateX:tilt.rotX,rotateY:tilt.rotY,
        transformStyle:'preserve-3d',perspective:900,willChange:'transform'}}
      onMouseMove={tilt.onMove}
      onMouseLeave={()=>{tilt.onLeave();setHovered(false);}}
      onMouseEnter={()=>setHovered(true)}
      className="relative rounded-2xl overflow-hidden flex flex-col"
      whileHover={{z:40,boxShadow:`0 28px 70px rgba(155,93,229,0.28),0 0 0 1px rgba(155,93,229,0.2)`}}
      transition={{duration:0.22}}>

      <div className="absolute inset-0 rounded-2xl"
        style={{background:C.surface,border:`1px solid ${hovered?'rgba(155,93,229,0.4)':C.border}`,
          backdropFilter:'blur(12px)',transition:'border-color 0.3s'}}/>

      {/* 3D image quad assembly */}
      <div className="relative h-44 overflow-hidden rounded-t-2xl flex-shrink-0" style={{perspective:'700px'}}>
        {project.image?(
          PROJ_QUADS.map((q,qi)=>(
            <motion.div key={qi} className="absolute inset-0"
              style={{clipPath:q.clip,transformStyle:'preserve-3d',willChange:'transform',
                x:qM[qi].x,y:qM[qi].y,z:qM[qi].z,rotateX:qM[qi].rotateX,rotateY:qM[qi].rotateY}}>
              <motion.img src={project.image} alt={project.title} className="w-full h-full object-cover"
                animate={hovered?{scale:1.08}:{scale:1}} transition={{duration:0.4}}/>
            </motion.div>
          ))
        ):(
          <div className="w-full h-full flex items-center justify-center"
            style={{background:'linear-gradient(135deg,rgba(155,93,229,0.18),rgba(0,212,255,0.14))'}}>
            <Puzzle size={38} style={{color:C.violet,opacity:0.3}}/>
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none"
          style={{background:'linear-gradient(to top,rgba(12,9,26,0.75) 0%,transparent 55%)'}}/>
        <div className="absolute top-3 right-3 opacity-40">
          <svg width="20" height="20" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill="rgba(155,93,229,0.25)" stroke="rgba(155,93,229,0.8)" strokeWidth="2.5"/>
          </svg>
        </div>
        <motion.div className="absolute inset-0 flex items-center justify-center gap-3"
          animate={{opacity:hovered?1:0}} transition={{duration:0.2}}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white"
              style={{background:'rgba(155,93,229,0.9)',backdropFilter:'blur(8px)'}}
              onClick={e=>e.stopPropagation()}>
              <ExternalLink size={11}/> Live
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white"
              style={{background:'rgba(26,20,60,0.88)',backdropFilter:'blur(8px)'}}
              onClick={e=>e.stopPropagation()}>
              <Github size={11}/> Code
            </a>
          )}
        </motion.div>
      </div>

      <div className="relative flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-bold text-base leading-snug" style={{color:C.text}}>{project.title}</h3>
        <p className="text-xs leading-relaxed flex-1 line-clamp-3" style={{color:C.faint}}>{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto pt-3" style={{borderTop:`1px solid ${C.border}`}}>
          {(project.techStack||[]).map((tech,ti)=>(
            <span key={ti} className="px-2 py-0.5 rounded text-[10px] font-semibold"
              style={{background:`${TECH_COLORS[ti%TECH_COLORS.length]}14`,
                color:TECH_COLORS[ti%TECH_COLORS.length],
                border:`1px solid ${TECH_COLORS[ti%TECH_COLORS.length]}35`}}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Projects({ projects }) {
  return (
    <section className="relative py-28 px-6 overflow-hidden" style={{zIndex:1}}>
      <div className="absolute inset-0 pointer-events-none"
        style={{background:'radial-gradient(ellipse 45% 40% at 18% 60%,rgba(155,93,229,0.08) 0%,transparent 70%)'}}/>
      <div className="max-w-6xl mx-auto">
        <PuzzleHeading label="Projects" title="Completed Puzzle Segments" accentColor={C.orange} gradientTo={C.pink}/>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{perspective:'1400px'}}>
          {(projects||[]).map((p,i)=><ProjectCard key={p.title||i} project={p} index={i}/>)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE
// ─────────────────────────────────────────────────────────────────────────────

function PuzzleConnector({ index }) {
  const ref=useRef(null);
  const inView=useInView(ref,{once:true,amount:0.5});
  return (
    <div ref={ref} className="flex justify-start items-center pl-6 my-0" style={{height:44}}>
      <div className="relative flex flex-col items-center" style={{width:54}}>
        <motion.div className="w-px" style={{background:`linear-gradient(to bottom,${C.violet}88,${C.cyan}55)`,height:26,transformOrigin:'top'}}
          initial={{scaleY:0}} animate={inView?{scaleY:1}:{}}
          transition={{delay:index*0.14+0.3,duration:0.4,ease:EASE_SPRING}}/>
        <motion.div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{background:`${C.cyan}bb`,marginTop:4}}
          initial={{scale:0}} animate={inView?{scale:1}:{}}
          transition={{delay:index*0.14+0.7,type:'spring',stiffness:320}}/>
        <motion.div className="absolute -right-3 top-1/2 -translate-y-1/2"
          initial={{opacity:0,scale:0,rotateZ:-90}} animate={inView?{opacity:0.35,scale:1,rotateZ:0}:{}}
          transition={{delay:index*0.14+0.9,duration:0.3}}>
          <svg width="12" height="12" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill={`${C.cyan}44`} stroke={`${C.cyan}99`} strokeWidth="2.5"/>
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

function ExperienceCard({ exp, index }) {
  const ref=useRef(null);
  const inView=useInView(ref,{once:true,amount:0.3});
  return (
    <motion.div ref={ref} className="relative flex gap-5"
      initial={{opacity:0,x:-60,z:-100,rotateY:25}} animate={inView?{opacity:1,x:0,z:0,rotateY:0}:{}}
      transition={{delay:index*0.1,type:'spring',stiffness:155,damping:24}}
      style={{perspective:'900px',willChange:'transform'}}>
      <div className="relative flex-shrink-0">
        <motion.div style={{width:52,height:52}}
          whileHover={{scale:1.12,rotateY:180,z:20}} transition={{type:'spring',stiffness:350}}>
          <svg viewBox={PUZZLE_VB} className="w-full h-full">
            <path d={PUZZLE_PATH} fill="rgba(155,93,229,0.12)" stroke="rgba(155,93,229,0.5)" strokeWidth="2"/>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Briefcase size={15} style={{color:C.violet}}/>
          </div>
        </motion.div>
      </div>
      <PuzzleAssemble delay={index*0.1} className="flex-1 mb-10">
        <motion.div className="rounded-2xl p-5 relative"
          style={{background:C.surface,border:`1px solid ${C.border}`,backdropFilter:'blur(10px)'}}
          whileHover={{borderColor:'rgba(155,93,229,0.35)',background:'rgba(255,252,240,0.98)',y:-4,z:20,
            boxShadow:'0 16px 50px rgba(155,93,229,0.18)'}}
          transition={{duration:0.22}}>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="font-bold text-base leading-tight" style={{color:C.text}}>{exp.role}</h3>
              <p className="text-sm font-semibold mt-0.5"
                style={{background:`linear-gradient(135deg,${C.violet},${C.cyan})`,
                  WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
                {exp.company}
              </p>
            </div>
            {(exp.period||exp.start) && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full flex-shrink-0"
                style={{background:'rgba(255,255,255,0.05)',border:`1px solid ${C.border}`}}>
                <Calendar size={10} style={{color:C.faint}}/>
                <span className="text-xs" style={{color:C.faint}}>
                  {exp.period||`${exp.start}${exp.end?` – ${exp.end}`:''}`}
                </span>
              </div>
            )}
          </div>
          {exp.description&&<p className="text-sm leading-relaxed" style={{color:C.muted}}>{exp.description}</p>}
          {Array.isArray(exp.bullets)&&exp.bullets.length>0&&(
            <ul className="mt-3 space-y-1.5">
              {exp.bullets.slice(0,3).map((b,bi)=>(
                <li key={bi} className="flex items-start gap-2 text-xs" style={{color:C.faint}}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:`${C.violet}99`}}/>
                  {b}
                </li>
              ))}
            </ul>
          )}
          <div className="absolute right-4 bottom-4 opacity-15">
            <svg width="16" height="16" viewBox={PUZZLE_VB}>
              <path d={PUZZLE_PATH} fill="none" stroke={C.violet} strokeWidth="2"/>
            </svg>
          </div>
        </motion.div>
      </PuzzleAssemble>
    </motion.div>
  );
}

function Experience({ experience }) {
  return (
    <section className="relative py-28 px-6 overflow-hidden" style={{zIndex:1}}>
      <div className="absolute inset-0 pointer-events-none"
        style={{background:'radial-gradient(ellipse 42% 55% at 92% 30%,rgba(0,212,255,0.07) 0%,transparent 70%)'}}/>
      <div className="max-w-3xl mx-auto">
        <PuzzleHeading label="Experience" title="A Chain of Connected Pieces" accentColor={C.cyan} gradientTo={C.violet}/>
        <div className="flex flex-col">
          {(experience||[]).map((exp,i)=>(
            <React.Fragment key={i}>
              <ExperienceCard exp={exp} index={i}/>
              {i<(experience||[]).length-1&&<PuzzleConnector index={i}/>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────

function TestimonialCard({ testimonial, index }) {
  const accent=CARD_ACCENTS[index%CARD_ACCENTS.length];
  const name=testimonial.name||testimonial.author;
  const avatar=testimonial.avatar||testimonial.image;
  return (
    <PuzzleAssemble delay={index*0.08}>
      <motion.div className="relative rounded-2xl p-6 flex flex-col gap-4 group"
        style={{background:accent.fill,border:`1px solid ${accent.border}`,backdropFilter:'blur(10px)',willChange:'transform',perspective:'700px'}}
        whileHover={{y:-8,z:30,rotateX:-4,boxShadow:`0 20px 60px ${accent.border}88`}}
        transition={{duration:0.22}}>
        <motion.div aria-hidden="true" className="absolute top-4 right-4 pointer-events-none"
          initial={{opacity:0,rotate:-90,z:-30}} whileInView={{opacity:0.3,rotate:0,z:0}}
          viewport={{once:true}}
          transition={{delay:index*0.08+0.4,duration:0.5,ease:EASE_SPRING}}>
          <svg width="22" height="22" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill="none" stroke={accent.dot} strokeWidth="2"/>
          </svg>
        </motion.div>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{background:`${accent.dot}1c`}}>
          <Quote size={14} style={{color:accent.dot}}/>
        </div>
        <p className="text-sm leading-relaxed flex-1 italic" style={{color:C.muted}}>"{testimonial.text}"</p>
        <div className="flex items-center gap-3 pt-3" style={{borderTop:`1px solid ${C.border}`}}>
          {avatar
            ?<img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                style={{border:`2px solid ${accent.border}`}}/>
            :<div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{background:`${accent.dot}18`,color:accent.dot,border:`2px solid ${accent.border}`}}>
                {(name||'?')[0].toUpperCase()}
              </div>}
          <div>
            <p className="text-sm font-semibold leading-tight" style={{color:C.text}}>{name}</p>
            <p className="text-xs mt-0.5" style={{color:accent.dot}}>{testimonial.role}</p>
          </div>
        </div>
      </motion.div>
    </PuzzleAssemble>
  );
}

function Testimonials({ testimonials }) {
  if (!testimonials?.length) return null;
  return (
    <section className="relative py-28 px-6 overflow-hidden" style={{zIndex:1}}>
      <div className="absolute inset-0 pointer-events-none"
        style={{background:'radial-gradient(ellipse 45% 40% at 28% 70%,rgba(247,37,133,0.07) 0%,transparent 70%)'}}/>
      <div className="max-w-6xl mx-auto">
        <PuzzleHeading label="Testimonials" title="Voices That Complete The Picture" accentColor={C.orange} gradientTo={C.pink}/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{perspective:'1200px'}}>
          {testimonials.map((t,i)=><TestimonialCard key={i} testimonial={t} index={i}/>)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────────────────────────────────────

function Contact({ personal, socials }) {
  const ref=useRef(null);
  const inView=useInView(ref,{once:true,amount:0.2});
  const [form,setForm]=useState({name:'',email:'',message:''});
  const [sent,setSent]=useState(false);
  const change=f=>e=>setForm(p=>({...p,[f]:e.target.value}));
  const submit=e=>{e.preventDefault();if(form.name&&form.email&&form.message)setSent(true);};

  return (
    <section ref={ref} className="relative py-28 px-6 overflow-hidden" style={{zIndex:1}}>
      <motion.div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        initial={{opacity:0}} animate={inView?{opacity:1}:{}}
        transition={{delay:1.2,duration:1.2}}
        style={{background:'radial-gradient(ellipse 75% 55% at 50% 50%,rgba(155,93,229,0.12) 0%,transparent 70%)'}}/>

      {/* Final 6 pieces flying in from 3D space */}
      {FINAL_PIECES.map((p,i)=>(
        <motion.div key={i} aria-hidden="true"
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{width:p.size,height:p.size,marginLeft:-p.size/2,marginTop:-p.size/2,perspective:'800px',willChange:'transform'}}
          initial={{x:p.xStart,y:p.yStart,z:p.zStart,rotateX:p.rotX,rotate:30,opacity:0}}
          animate={inView?{x:0,y:0,z:0,rotateX:0,rotate:0,opacity:0.12}:{}}
          transition={{delay:p.delay,type:'spring',stiffness:110,damping:22}}>
          <svg viewBox={PUZZLE_VB} className="w-full h-full">
            <path d={PUZZLE_PATH} fill={`${p.color}1e`} stroke={`${p.color}60`} strokeWidth="1.5"/>
          </svg>
        </motion.div>
      ))}

      <div className="max-w-6xl mx-auto relative z-10">
        <PuzzleHeading label="Contact" title="Let's Complete The Picture Together" accentColor={C.violet} gradientTo={C.cyan}/>

        <motion.p initial={{opacity:0}} animate={inView?{opacity:1}:{}}
          transition={{delay:0.3}} className="text-sm max-w-lg mb-14" style={{color:C.faint}}>
          Every great collaboration starts with a single piece. Reach out and let's see what we can assemble together.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <motion.div initial={{opacity:0,y:38,z:-80,rotateX:-20}} animate={inView?{opacity:1,y:0,z:0,rotateX:0}:{}}
            transition={{delay:0.4,type:'spring',stiffness:148}}
            className="lg:col-span-3" style={{perspective:'900px'}}>
            {sent?(
              <motion.div initial={{opacity:0,scale:0.85,z:-60}} animate={{opacity:1,scale:1,z:0}}
                className="flex flex-col items-center justify-center gap-4 p-12 rounded-2xl text-center"
                style={{background:'rgba(155,93,229,0.08)',border:'1px solid rgba(155,93,229,0.25)'}}>
                <motion.div animate={{scale:[1,1.18,1],rotateY:[0,360]}}
                  transition={{scale:{duration:1.5,repeat:Infinity,ease:'easeInOut'},rotateY:{duration:4,repeat:Infinity,ease:'linear'}}}>
                  <svg width="56" height="56" viewBox={PUZZLE_VB}>
                    <path d={PUZZLE_PATH} fill="rgba(155,93,229,0.2)" stroke="rgba(155,93,229,0.75)" strokeWidth="2"/>
                  </svg>
                </motion.div>
                <CheckCircle size={28} style={{color:C.violet}}/>
                <p className="font-semibold text-lg" style={{color:C.text}}>Piece received!</p>
                <p className="text-sm" style={{color:C.faint}}>Thank you for reaching out. I'll be in touch soon.</p>
              </motion.div>
            ):(
              <PuzzleAssemble delay={0.45}>
                <form onSubmit={submit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="Name"  value={form.name}    onChange={change('name')}    placeholder="Your name"/>
                    <InputField label="Email" type="email" value={form.email} onChange={change('email')} placeholder="you@example.com"/>
                  </div>
                  <InputField label="Message" value={form.message} onChange={change('message')} placeholder="Tell me about your project…" multiline/>
                  <PuzzleButton variant="primary" accentColor={C.violet} as="button">
                    <Send size={13}/> Send Message
                  </PuzzleButton>
                </form>
              </PuzzleAssemble>
            )}
          </motion.div>

          <motion.div initial={{opacity:0,x:40,z:-60,rotateY:-15}} animate={inView?{opacity:1,x:0,z:0,rotateY:0}:{}}
            transition={{delay:0.55,type:'spring',stiffness:148}}
            className="lg:col-span-2 flex flex-col gap-5" style={{perspective:'700px'}}>
            <PuzzleAssemble delay={0.6}>
              <div className="p-6 rounded-2xl flex flex-col gap-4"
                style={{background:C.surface,border:`1px solid ${C.border}`,backdropFilter:'blur(10px)'}}>
                {personal?.location&&(
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'rgba(155,93,229,0.12)'}}>
                      <MapPin size={13} style={{color:C.violet}}/>
                    </div>
                    <span className="text-sm" style={{color:C.muted}}>{personal.location}</span>
                  </div>
                )}
                {socials?.email&&(
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'rgba(0,212,255,0.12)'}}>
                      <Mail size={13} style={{color:C.cyan}}/>
                    </div>
                    <a href={`mailto:${socials.email}`} className="text-sm" style={{color:C.muted}}>{socials.email}</a>
                  </div>
                )}
              </div>
            </PuzzleAssemble>
            <div className="flex flex-col gap-2.5">
              {SOCIAL_LINKS.map(({key,Icon,label,color,isEmail})=>{
                const href=isEmail?`mailto:${socials?.[key]||''}`:(socials?.[key]||'#');
                if(!socials?.[key]) return null;
                return (
                  <motion.a key={key} href={href}
                    target={isEmail?undefined:'_blank'} rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl text-sm font-semibold"
                    style={{background:C.surface,border:`1px solid ${C.border}`,color:C.muted,backdropFilter:'blur(8px)'}}
                    whileHover={{x:6,z:16,borderColor:`${color}55`,color,background:`${color}0e`,
                      boxShadow:`0 4px 20px ${color}25`}}
                    transition={{duration:0.18}}>
                    <Icon size={14}/><span>{label}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{opacity:0,y:18}} animate={inView?{opacity:1,y:0}:{}}
          transition={{delay:1.5}}
          className="mt-24 pt-8 flex flex-col items-center gap-3"
          style={{borderTop:`1px solid ${C.border}`}}>
          <div className="flex items-center gap-3">
            {[0,1,2].map(i=>(
              <motion.div key={i}
                animate={{opacity:[0.15,0.65,0.15],scale:[0.9,1.08,0.9],rotateY:[0,180,360]}}
                transition={{duration:3,repeat:Infinity,delay:i*0.55,ease:'easeInOut'}}>
                <svg width="16" height="16" viewBox={PUZZLE_VB}>
                  <path d={PUZZLE_PATH} fill={`${C.violet}22`} stroke={`${C.violet}70`} strokeWidth="2"/>
                </svg>
              </motion.div>
            ))}
          </div>
          <p className="text-xs tracking-widest uppercase" style={{color:C.faint}}>
            {personal?.name} — Portfolio Assembled
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function JigsawPuzzleAssembly() {
  const { portfolioData: data } = usePortfolio();
  if (!data) return null;
  const { personal, socials, skills, projects, experience, testimonials, stats } = data;

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans" style={{color:C.text}}>
      {/* Jigsaw SVG clip-path definitions — must be in DOM before any clip-path url() refs */}
      <PuzzleClipDefs/>
      <JigsawBackground/>
      <Hero         personal={personal} socials={socials}  stats={stats}/>
      <About        personal={personal} stats={stats}/>
      <Skills       skills={skills}/>
      <Projects     projects={projects}/>
      <Experience   experience={experience}/>
      <Testimonials testimonials={testimonials}/>
      <Contact      personal={personal} socials={socials}/>
    </div>
  );
}
 
