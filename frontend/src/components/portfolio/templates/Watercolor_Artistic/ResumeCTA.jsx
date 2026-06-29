import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Download, Eye } from 'lucide-react';

/* ─── Font loader ─────────────────────────────────────────── */
function GoogleFontLoader() {
  useEffect(() => {
    const linkId = 'watercolor-resumecta-fonts';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap';
      document.head.appendChild(link);
    }
  }, []);
  return null;
}

/* ─── Default Data Configuration ─── */
const DEFAULT_DATA = {
  eyebrow: 'Download Resume',
  heading: ['Ready to shape the', 'next creative', '<em>chapter</em>?'],
  body: 'Every breakthrough starts with a single dialogue. My digital resume captures the synergy of art and code — curated, polished, and ready to print.',
  tags: ['Curated', 'Print-ready', 'ATS-friendly', 'Artistic'],
  stats: [
    { value: '8+', label: 'Years in Craft' },
    { value: '120+', label: 'Art Deliveries' },
    { value: '40+', label: 'Happy Partners' },
  ],
  resumeUrl: '#',
  previewUrl: '#',
};

/* ─── Paper grain overlay ─────────────────────────────────── */
const PaperGrain = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none z-[1] mix-blend-multiply opacity-[0.18]"
    aria-hidden="true"
  >
    <filter id="rcta-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.72 0.68" numOctaves="4" seed="8" stitchTiles="stitch" result="noise" />
      <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
      <feBlend in="SourceGraphic" in2="gray" mode="multiply" />
    </filter>
    <rect width="100%" height="100%" filter="url(#rcta-grain)" opacity="1" fill="rgba(210,190,180,0.6)" />
  </svg>
);

/* ─── Full-canvas background watercolor wash ──────────────── */
const BackgroundWash = () => (
  <svg
    viewBox="0 0 1440 900"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 w-full h-full pointer-events-none z-0"
    aria-hidden="true"
  >
    <defs>
      {/* Realistic watercolor displacement */}
      <filter id="rcta-wc-main" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="5" seed="19" result="turb" />
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="55" xChannelSelector="R" yChannelSelector="G" result="disp" />
        <feGaussianBlur in="disp" stdDeviation="22" result="blur" />
        <feComposite in="blur" in2="SourceGraphic" operator="over" />
      </filter>
      <filter id="rcta-wc-mid" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.018 0.024" numOctaves="4" seed="21" result="turb" />
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="40" xChannelSelector="G" yChannelSelector="R" result="disp" />
        <feGaussianBlur in="disp" stdDeviation="16" result="blur" />
      </filter>
      <filter id="rcta-wc-accent" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
        <feTurbulence type="turbulence" baseFrequency="0.03 0.025" numOctaves="3" seed="25" result="turb" />
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="28" xChannelSelector="R" yChannelSelector="B" result="disp" />
        <feGaussianBlur in="disp" stdDeviation="10" />
      </filter>
      <filter id="rcta-wc-ink" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.06 0.04" numOctaves="3" seed="18" result="turb" />
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="18" xChannelSelector="R" yChannelSelector="G" result="disp" />
        <feGaussianBlur in="disp" stdDeviation="3" />
      </filter>
      <filter id="rcta-bloom-soft" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="8" />
      </filter>

      {/* Large wash gradients */}
      <radialGradient id="rcta-wash-blush" cx="70%" cy="35%" r="55%">
        <stop offset="0%" stopColor="#f7b8d5" stopOpacity="0.72" />
        <stop offset="45%" stopColor="#f0aac8" stopOpacity="0.38" />
        <stop offset="80%" stopColor="#e8a0c0" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#e0a0c0" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="rcta-wash-sky" cx="25%" cy="25%" r="50%">
        <stop offset="0%" stopColor="#b0d4f8" stopOpacity="0.6" />
        <stop offset="50%" stopColor="#a8ccf4" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#a0c8f0" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="rcta-wash-peach" cx="35%" cy="80%" r="48%">
        <stop offset="0%" stopColor="#fcd0a0" stopOpacity="0.6" />
        <stop offset="55%" stopColor="#f8c898" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#f4c090" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="rcta-wash-lavender" cx="85%" cy="75%" r="42%">
        <stop offset="0%" stopColor="#cdb8f0" stopOpacity="0.55" />
        <stop offset="55%" stopColor="#c8b0ec" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#c0a8e8" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="rcta-wash-mint" cx="15%" cy="60%" r="40%">
        <stop offset="0%" stopColor="#a8e4cc" stopOpacity="0.45" />
        <stop offset="55%" stopColor="#a0dcc4" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#98d4bc" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="rcta-wash-coral" cx="50%" cy="15%" r="38%">
        <stop offset="0%" stopColor="#f8b4a0" stopOpacity="0.4" />
        <stop offset="60%" stopColor="#f4ac98" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#f0a490" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Primary large washes */}
    <ellipse cx="1020" cy="310" rx="520" ry="440" fill="url(#rcta-wash-blush)" filter="url(#rcta-wc-main)" />
    <ellipse cx="360" cy="220" rx="480" ry="400" fill="url(#rcta-wash-sky)" filter="url(#rcta-wc-main)" />
    <ellipse cx="490" cy="720" rx="460" ry="380" fill="url(#rcta-wash-peach)" filter="url(#rcta-wc-mid)" />
    <ellipse cx="1240" cy="680" rx="400" ry="340" fill="url(#rcta-wash-lavender)" filter="url(#rcta-wc-mid)" />
    <ellipse cx="200" cy="540" rx="360" ry="300" fill="url(#rcta-wash-mint)" filter="url(#rcta-wc-accent)" />
    <ellipse cx="720" cy="80" rx="380" ry="240" fill="url(#rcta-wash-coral)" filter="url(#rcta-wc-accent)" />

    {/* Secondary layered mid-tone washes */}
    <ellipse cx="840" cy="450" rx="300" ry="260" fill="rgba(240,176,210,0.22)" filter="url(#rcta-wc-mid)" />
    <ellipse cx="580" cy="350" rx="260" ry="220" fill="rgba(168,204,248,0.2)" filter="url(#rcta-wc-accent)" />
    <ellipse cx="1140" cy="200" rx="240" ry="200" fill="rgba(216,188,248,0.2)" filter="url(#rcta-wc-accent)" />
    <ellipse cx="340" cy="680" rx="280" ry="230" fill="rgba(200,240,218,0.18)" filter="url(#rcta-wc-accent)" />

    {/* Wet-on-wet bloom zones */}
    <circle cx="1060" cy="260" r="120" fill="rgba(248,160,196,0.28)" filter="url(#rcta-wc-ink)" />
    <circle cx="380" cy="300" r="100" fill="rgba(148,196,248,0.26)" filter="url(#rcta-wc-ink)" />
    <circle cx="1260" cy="600" r="90" fill="rgba(196,168,248,0.24)" filter="url(#rcta-wc-ink)" />
    <circle cx="240" cy="560" r="80" fill="rgba(148,228,196,0.22)" filter="url(#rcta-wc-ink)" />
    <circle cx="680" cy="820" r="110" fill="rgba(248,196,148,0.24)" filter="url(#rcta-wc-ink)" />

    {/* Ink diffusion tendrils */}
    <path d="M1320 180 C1240 160 1160 220 1100 180 C1040 140 1000 200 920 170" stroke="rgba(230,150,180,0.22)" strokeWidth="3" fill="none" filter="url(#rcta-wc-ink)" />
    <path d="M540 100 C480 140 420 100 360 150 C300 200 260 160 180 190" stroke="rgba(148,192,240,0.2)" strokeWidth="2.5" fill="none" filter="url(#rcta-wc-ink)" />
    <path d="M1360 560 C1280 520 1240 580 1160 540 C1080 500 1060 560 980 520" stroke="rgba(196,160,240,0.2)" strokeWidth="2" fill="none" filter="url(#rcta-wc-ink)" />
    <path d="M480 720 C420 680 360 740 290 700 C220 660 180 720 100 690" stroke="rgba(148,220,190,0.18)" strokeWidth="2.5" fill="none" filter="url(#rcta-wc-ink)" />

    {/* Scattered micro ink drops */}
    {[
      [1260, 140, '#f4a8c7', 7, 0.38], [920, 80, '#a8ccf4', 5, 0.35], [640, 180, '#d8b8f8', 6, 0.32],
      [340, 120, '#a8e4c8', 4, 0.3], [140, 280, '#f4cca8', 6, 0.3], [1340, 380, '#f4a8c7', 4, 0.28],
      [1100, 520, '#a8ccf4', 5, 0.3], [800, 680, '#d8b8f8', 5, 0.28], [440, 640, '#a8e4c8', 6, 0.26],
      [80, 740, '#f4cca8', 4, 0.28], [1200, 760, '#f4a8c7', 5, 0.25], [700, 60, '#d8b8f8', 4, 0.3],
      [260, 820, '#a8ccf4', 6, 0.25], [1380, 240, '#a8e4c8', 4, 0.27], [40, 460, '#f4a8c7', 5, 0.26],
    ].map(([cx, cy, fill, r, op], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={fill} opacity={op} filter="url(#rcta-bloom-soft)" />
    ))}
  </svg>
);

/* ─── Glass card (Tailwind) ───────────────────────────────── */
const GlassCard = ({ children, className = '' }) => (
  <div
    className={`
      bg-[rgba(255,255,255,0.48)]
      backdrop-blur-[18px]
      border border-[rgba(255,255,255,0.75)]
      rounded-[20px]
      shadow-[0_4px_32px_rgba(200,160,200,0.13),inset_0_1px_0_rgba(255,255,255,0.85)]
      ${className}
    `}
  >
    {children}
  </div>
);

/* ─── ResumeCTA ───────────────────────────────────────────── */
export default function ResumeCTA({ data = DEFAULT_DATA }) {
  const { eyebrow, heading, body, tags, stats, resumeUrl, previewUrl } = {
    ...DEFAULT_DATA,
    ...data,
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className={`
        relative min-h-screen w-full overflow-hidden
        flex items-center justify-center
        bg-[linear-gradient(135deg,#fdf6f0_0%,#fef0f5_30%,#f5f0ff_60%,#f0f8ff_100%)]
        font-['DM_Sans',sans-serif]
      `}
    >
      <GoogleFontLoader />

      {/* ── Full-canvas watercolor washes ── */}
      <BackgroundWash />

      {/* ── Paper grain ── */}
      <PaperGrain />

      {/* ── Animated ambient blobs ── */}
      <div className="absolute inset-0 pointer-events-none z-[3]">
        <div
          className={`
            absolute -right-[5%] -top-[10%] w-[55%] h-[65%]
            rounded-[30%_70%_60%_40%/40%_50%_60%_50%]
            bg-[radial-gradient(ellipse,rgba(248,180,210,0.38)_0%,rgba(248,200,230,0.15)_60%,transparent_100%)]
            blur-[55px] animate-pulse
          `}
        />
        <div
          className={`
            absolute -left-[8%] top-[10%] w-[50%] h-[60%]
            rounded-[60%_40%_30%_70%/50%_70%_30%_50%]
            bg-[radial-gradient(ellipse,rgba(180,210,255,0.3)_0%,rgba(200,220,255,0.12)_60%,transparent_100%)]
            blur-[65px] animate-pulse [animation-duration:4s]
          `}
        />
        <div
          className={`
            absolute right-[20%] -bottom-[5%] w-[60%] h-[50%]
            rounded-[50%_50%_30%_70%/60%_40%_60%_40%]
            bg-[radial-gradient(ellipse,rgba(255,210,180,0.3)_0%,rgba(255,220,200,0.12)_60%,transparent_100%)]
            blur-[50px] animate-pulse [animation-duration:5s]
          `}
        />
        <div
          className={`
            absolute right-[40%] top-[20%] w-[35%] h-[40%]
            rounded-[40%_60%_70%_30%/50%_40%_60%_50%]
            bg-[radial-gradient(ellipse,rgba(210,180,255,0.25)_0%,transparent_70%)]
            blur-[75px] animate-pulse [animation-duration:6s]
          `}
        />
        <div
          className={`
            absolute left-[5%] bottom-[10%] w-[30%] h-[35%]
            rounded-[60%_40%_50%_50%]
            bg-[radial-gradient(ellipse,rgba(160,230,210,0.25)_0%,transparent_70%)]
            blur-[55px] animate-pulse [animation-duration:7s]
          `}
        />
      </div>

      {/* ── Main centered layout ── */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <GlassCard className="px-6 py-10 sm:px-10 sm:py-14 md:px-14 md:py-16 flex flex-col items-center text-center gap-8">

          {/* Eyebrow tag */}
          <div
            className={`
              transition-opacity duration-[600ms] delay-200
              ${mounted ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <span
              className={`
                inline-flex items-center gap-2
                bg-[rgba(255,255,255,0.62)]
                border border-[rgba(220,180,220,0.45)]
                rounded-full px-4 py-1.5
              `}
            >
              <span className="w-2 h-2 rounded-full bg-[#b080d0] animate-pulse" />
              <span className="text-xs font-medium text-[#8060a0] tracking-[0.08em] uppercase">
                {eyebrow}
              </span>
            </span>
          </div>

          {/* Heading — dynamically rendered from data */}
          <div
            className={`
              transition-all duration-700 delay-300
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
            `}
          >
            {heading.map((line, idx) => {
              const parts = line.split(/(<em>.*?<\/em>)/g);
              return (
                <h2
                  key={idx}
                  className="font-['Cormorant_Garamond',_Georgia,_serif] font-light text-4xl md:text-6xl lg:text-[72px] leading-[1.02] tracking-[-0.02em] text-[#2a1830] m-0"
                >
                  {parts.map((part, pIdx) => {
                    if (part.startsWith('<em>') && part.endsWith('</em>')) {
                      return (
                        <em
                          key={pIdx}
                          className="italic bg-[linear-gradient(135deg,#d870a8_0%,#9060d0_50%,#60a0e8_100%)] bg-clip-text text-transparent"
                        >
                          {part.replace(/<\/?em>/g, '')}
                        </em>
                      );
                    }
                    return part;
                  })}
                </h2>
              );
            })}
          </div>

          {/* Decorative rule */}
          <div
            className={`
              flex items-center gap-4 w-full max-w-xs
              transition-opacity duration-[600ms] delay-[400ms]
              ${mounted ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <div className="h-px w-12 bg-[linear-gradient(90deg,rgba(210,130,180,0.65),transparent)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[rgba(210,130,180,0.55)]" />
            <div className="h-px flex-1 bg-[rgba(210,130,180,0.15)]" />
          </div>

          {/* Body */}
          <p
            className={`
              text-[17px] leading-[1.75] text-[#6a5070] font-light max-w-md m-0
              transition-all duration-700 delay-500
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            {body}
          </p>

          {/* Tags — from data prop */}
          <div
            className={`
              flex flex-wrap justify-center gap-2
              transition-opacity duration-[600ms] delay-[550ms]
              ${mounted ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className={`
                  text-xs font-normal text-[#9070b0]
                  bg-[rgba(200,170,230,0.2)]
                  border border-[rgba(200,170,230,0.35)]
                  rounded-full px-3.5 py-1.5
                  tracking-[0.02em]
                `}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div
            className={`
              flex flex-wrap justify-center gap-6 sm:gap-10 pt-2
              transition-opacity duration-700 delay-700
              ${mounted ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="text-center cursor-default hover:-translate-y-0.5 transition-transform duration-300"
              >
                <div className="font-['Cormorant_Garamond',_serif] text-[28px] font-normal text-[#3a2048] leading-none">
                  {value}
                </div>
                <div className="text-[11px] text-[#a090b0] tracking-[0.06em] uppercase mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div
            className={`
              flex flex-col sm:flex-row justify-center gap-3
              transition-all duration-700 delay-[600ms]
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            <a
              href={resumeUrl}
              download
              className={`
                inline-flex items-center justify-center gap-2
                bg-[linear-gradient(135deg,#e88ab0_0%,#d070a0_100%)]
                text-white rounded-full
                px-8 py-3.5 text-sm font-medium
                tracking-[0.02em] no-underline cursor-pointer
                shadow-[0_4px_20px_rgba(210,100,160,0.3)]
                hover:-translate-y-0.5
                hover:shadow-[0_8px_28px_rgba(210,100,160,0.4)]
                transition-all duration-200
                font-['DM_Sans',sans-serif]
              `}
            >
              <Download size={16} strokeWidth={2.5} />
              Download PDF
            </a>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                inline-flex items-center justify-center gap-2
                bg-[rgba(255,255,255,0.5)] text-[#8860a0]
                border border-[rgba(200,160,220,0.4)]
                rounded-full px-8 py-3.5 text-sm font-normal
                tracking-[0.02em] no-underline cursor-pointer
                backdrop-blur-[8px]
                hover:bg-[rgba(255,255,255,0.78)]
                hover:-translate-y-0.5
                transition-all duration-200
                font-['DM_Sans',sans-serif]
              `}
            >
              <Eye size={16} strokeWidth={2} />
              Preview Online
            </a>
          </div>

        </GlassCard>
      </div>
    </section>
  );
}

/* ─── Type Validation ─── */
ResumeCTA.propTypes = {
  data: PropTypes.shape({
    eyebrow: PropTypes.string,
    heading: PropTypes.arrayOf(PropTypes.string),
    body: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    stats: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })
    ),
    resumeUrl: PropTypes.string,
    previewUrl: PropTypes.string,
  }),
};
