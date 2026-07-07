import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const MotionSpan = motion.span;
const MotionDiv = motion.div;
const MotionA = motion.a;
const MotionH1 = motion.h1;
const MotionP = motion.p;

/* ─── Rotating word effect (rotates "Templates", "Projects", "Skills", "Deploys") ─── */

const RotatingText = forwardRef(function RotatingText(
  {
    texts,
    transition = { type: 'spring', damping: 25, stiffness: 300 },
    initial = { y: '100%', opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: '-120%', opacity: 0 },
    animatePresenceMode = 'wait',
    animatePresenceInitial = false,
    rotationInterval = 2200,
    staggerDuration = 0.01,
    staggerFrom = 'last',
    loop = true,
    auto = true,
    splitBy = 'characters',
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    ...rest
  },
  ref
) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const splitIntoCharacters = (text) => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      try {
        const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
        return Array.from(segmenter.segment(text), (segment) => segment.segment);
      } catch {
        return text.split('');
      }
    }
    return text.split('');
  };

  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex] ?? '';
    if (splitBy === 'characters') {
      const words = currentText.split(/(\s+)/);
      let charCount = 0;
      return words.filter((part) => part.length > 0).map((part) => {
        const isSpace = /^\s+$/.test(part);
        const chars = isSpace ? [part] : splitIntoCharacters(part);
        const startIndex = charCount;
        charCount += chars.length;
        return { characters: chars, isSpace, startIndex };
      });
    }
    if (splitBy === 'words') {
      return currentText.split(/(\s+)/).filter((word) => word.length > 0).map((word, i) => ({
        characters: [word], isSpace: /^\s+$/.test(word), startIndex: i,
      }));
    }
    if (splitBy === 'lines') {
      return currentText.split('\n').map((line, i) => ({
        characters: [line], isSpace: false, startIndex: i,
      }));
    }
    return currentText.split(splitBy).map((part, i) => ({
      characters: [part], isSpace: false, startIndex: i,
    }));
  }, [texts, currentTextIndex, splitBy]);

  const totalElements = useMemo(
    () => elements.reduce((sum, el) => sum + el.characters.length, 0),
    [elements]
  );

  const getStaggerDelay = useCallback((index, total) => {
    if (total <= 1 || !staggerDuration) return 0;
    const stagger = staggerDuration;
    switch (staggerFrom) {
      case 'first': return index * stagger;
      case 'last': return (total - 1 - index) * stagger;
      case 'center': {
        const center = (total - 1) / 2;
        return Math.abs(center - index) * stagger;
      }
      case 'random': return Math.random() * (total - 1) * stagger;
      default:
        if (typeof staggerFrom === 'number') {
          const fromIndex = Math.max(0, Math.min(staggerFrom, total - 1));
          return Math.abs(fromIndex - index) * stagger;
        }
        return index * stagger;
    }
  }, [staggerFrom, staggerDuration]);

  const handleIndexChange = useCallback((newIndex) => {
    setCurrentTextIndex(newIndex);
    onNext?.(newIndex);
  }, [onNext]);

  const next = useCallback(() => {
    const nextIndex = currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1;
    if (nextIndex !== currentTextIndex) handleIndexChange(nextIndex);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const previous = useCallback(() => {
    const prevIndex = currentTextIndex === 0 ? (loop ? texts.length - 1 : currentTextIndex) : currentTextIndex - 1;
    if (prevIndex !== currentTextIndex) handleIndexChange(prevIndex);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const jumpTo = useCallback((index) => {
    const validIndex = Math.max(0, Math.min(index, texts.length - 1));
    if (validIndex !== currentTextIndex) handleIndexChange(validIndex);
  }, [texts.length, currentTextIndex, handleIndexChange]);

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) handleIndexChange(0);
  }, [currentTextIndex, handleIndexChange]);

  useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [next, previous, jumpTo, reset]);

  useEffect(() => {
    if (!auto || texts.length <= 1) return undefined;
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [next, rotationInterval, auto, texts.length]);

  return (
    <MotionSpan
      className={cn(
        'inline-flex flex-wrap whitespace-pre-wrap relative align-bottom pb-[10px]',
        mainClassName
      )}
      {...rest}
      layout
    >
      <span className="sr-only">{texts[currentTextIndex]}</span>
      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        <MotionDiv
          key={currentTextIndex}
          className={cn(
            'inline-flex flex-wrap relative',
            splitBy === 'lines' ? 'flex-col items-start w-full' : 'flex-row items-baseline'
          )}
          layout
          aria-hidden="true"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {elements.map((elementObj, elementIndex) => (
            <span
              key={elementIndex}
              className={cn(
                'inline-flex',
                splitBy === 'lines' ? 'w-full' : '',
                splitLevelClassName
              )}
              style={{ whiteSpace: 'pre' }}
            >
              {elementObj.characters.map((char, charIndex) => {
                const globalIndex = elementObj.startIndex + charIndex;
                return (
                  <MotionSpan
                    key={`${char}-${charIndex}`}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    transition={{
                      ...transition,
                      delay: getStaggerDelay(globalIndex, totalElements),
                    }}
                    className={cn(
                      'inline-block leading-none tracking-tight',
                      elementLevelClassName
                    )}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </MotionSpan>
                );
              })}
            </span>
          ))}
        </MotionDiv>
      </AnimatePresence>
    </MotionSpan>
  );
});

/* ─── Shiny badge text ─── */

const ShinyText = ({ text, className = '' }) => (
  <span className={cn('relative overflow-hidden inline-block', className)}>
    {text}
    <span
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        backgroundSize: '200% 100%',
        animation: 'shine 2s infinite linear',
        opacity: 0.5,
        pointerEvents: 'none',
      }}
    />
  </span>
);

/* ─── Inline icons ─── */

const ChevronDownIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-3 h-3 ml-1 inline-block transition-transform duration-200 group-hover:rotate-180"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const MenuIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const ExternalLinkIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 transition-opacity"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
    />
  </svg>
);

const RocketIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
    />
  </svg>
);

/* ─── Nav subcomponents ─── */

const NavLink = ({ href = '#', children, hasDropdown = false, className = '', onClick }) => (
  <MotionA
    href={href}
    onClick={onClick}
    className={cn(
      'relative group text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 flex items-center py-1',
      className
    )}
    whileHover="hover"
  >
    {children}
    {hasDropdown && <ChevronDownIcon />}
    {!hasDropdown && (
      <MotionDiv
        className="absolute bottom-[-2px] left-0 right-0 h-[1px] bg-[#0CF2A0]"
        variants={{ initial: { scaleX: 0, originX: 0.5 }, hover: { scaleX: 1, originX: 0.5 } }}
        initial="initial"
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    )}
  </MotionA>
);

const DropdownMenu = ({ children, isOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <MotionDiv
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 origin-top z-40"
      >
        <div className="bg-[#111111] border border-gray-700/50 rounded-md shadow-xl p-2">
          {children}
        </div>
      </MotionDiv>
    )}
  </AnimatePresence>
);

const DropdownItem = ({ href = '#', children, icon }) => (
  <a
    href={href}
    className="group flex items-center justify-between w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/30 hover:text-white rounded-md transition-colors duration-150"
  >
    <span>{children}</span>
    {icon &&
      React.cloneElement(icon, {
        className: 'w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 transition-opacity',
      })}
  </a>
);

/* ─── Interactive dot canvas (full-page) ─── */

const InteractiveDotCanvas = ({
  accent = '#0CF2A0',
  spacing = 25,
  opacityMin = 0.4,
  opacityMax = 0.5,
  radius = 1,
  interactionRadius = 150,
  opacityBoost = 0.6,
  radiusBoost = 2.5,
  className = '',
}) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const dotsRef = useRef([]);
  const gridRef = useRef({});
  const sizeRef = useRef({ width: 0, height: 0 });
  const mouseRef = useRef({ x: null, y: null });

  const GRID_CELL_SIZE = useMemo(
    () => Math.max(50, Math.floor(interactionRadius / 1.5)),
    [interactionRadius]
  );

  const accentRgb = useMemo(() => {
    if (typeof window === 'undefined') return { r: 12, g: 242, b: 160 };
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    return { r: data[0], g: data[1], b: data[2] };
  }, [accent]);

  const handleMouseMove = useCallback((event) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      mouseRef.current = { x: null, y: null };
      return;
    }
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top + window.scrollY,
    };
  }, []);

  const createDots = useCallback(() => {
    const { width, height } = sizeRef.current;
    if (width === 0 || height === 0) return;
    const newDots = [];
    const newGrid = {};
    const cols = Math.ceil(width / spacing);
    const rows = Math.ceil(height / spacing);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing + spacing / 2;
        const y = j * spacing + spacing / 2;
        const cellX = Math.floor(x / GRID_CELL_SIZE);
        const cellY = Math.floor(y / GRID_CELL_SIZE);
        const cellKey = `${cellX}_${cellY}`;
        if (!newGrid[cellKey]) newGrid[cellKey] = [];
        const dotIndex = newDots.length;
        newGrid[cellKey].push(dotIndex);
        const baseOpacity = Math.random() * (opacityMax - opacityMin) + opacityMin;
        newDots.push({
          x,
          y,
          targetOpacity: baseOpacity,
          currentOpacity: baseOpacity,
          opacitySpeed: Math.random() * 0.005 + 0.002,
          baseRadius: radius,
          currentRadius: radius,
        });
      }
    }
    dotsRef.current = newDots;
    gridRef.current = newGrid;
  }, [spacing, GRID_CELL_SIZE, opacityMin, opacityMax, radius]);

  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = window.innerWidth;
    const height = document.documentElement.scrollHeight;
    if (sizeRef.current.width !== width || sizeRef.current.height !== height) {
      canvas.width = width;
      canvas.height = height;
      sizeRef.current = { width, height };
      createDots();
    }
  }, [createDots]);

  const animateDots = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const dots = dotsRef.current;
    const grid = gridRef.current;
    const { width, height } = sizeRef.current;
    const { x: mouseX, y: mouseY } = mouseRef.current;
    const irSq = interactionRadius * interactionRadius;

    if (!ctx || !dots || !grid || width === 0 || height === 0) {
      animationFrameId.current = requestAnimationFrame(animateDots);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const active = new Set();
    if (mouseX !== null && mouseY !== null) {
      const mcx = Math.floor(mouseX / GRID_CELL_SIZE);
      const mcy = Math.floor(mouseY / GRID_CELL_SIZE);
      const sr = Math.ceil(interactionRadius / GRID_CELL_SIZE);
      for (let i = -sr; i <= sr; i++) {
        for (let j = -sr; j <= sr; j++) {
          const key = `${mcx + i}_${mcy + j}`;
          if (grid[key]) grid[key].forEach((idx) => active.add(idx));
        }
      }
    }

    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      dot.currentOpacity += dot.opacitySpeed;
      if (
        dot.currentOpacity >= dot.targetOpacity ||
        dot.currentOpacity <= opacityMin
      ) {
        dot.opacitySpeed = -dot.opacitySpeed;
        dot.currentOpacity = Math.max(
          opacityMin,
          Math.min(dot.currentOpacity, opacityMax)
        );
        dot.targetOpacity =
          Math.random() * (opacityMax - opacityMin) + opacityMin;
      }

      let interactionFactor = 0;
      if (mouseX !== null && mouseY !== null && active.has(i)) {
        const dx = dot.x - mouseX;
        const dy = dot.y - mouseY;
        const distSq = dx * dx + dy * dy;
        if (distSq < irSq) {
          const distance = Math.sqrt(distSq);
          interactionFactor = Math.max(0, 1 - distance / interactionRadius);
          interactionFactor *= interactionFactor;
        }
      }

      const finalOpacity = Math.min(
        1,
        dot.currentOpacity + interactionFactor * opacityBoost
      );
      const finalRadius = dot.baseRadius + interactionFactor * radiusBoost;

      ctx.beginPath();
      ctx.fillStyle = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, ${finalOpacity.toFixed(3)})`;
      ctx.arc(dot.x, dot.y, finalRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    animationFrameId.current = requestAnimationFrame(animateDots);
  }, [
    GRID_CELL_SIZE,
    interactionRadius,
    opacityBoost,
    radiusBoost,
    opacityMin,
    opacityMax,
    accentRgb,
  ]);

  useEffect(() => {
    measure();
    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };
    const handleScroll = () => {
      // recompute on scroll only if the document height actually changed
      const h = document.documentElement.scrollHeight;
      if (h !== sizeRef.current.height) measure();
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId.current = requestAnimationFrame(animateDots);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
    // `measure`, `handleMouseMove`, and `animateDots` are wrapped in
    // useCallback with stable deps upstream — adding them here would
    // re-bind window listeners on every state change, which causes
    // MaxListeners warnings in StrictMode.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
      style={{ opacity: 0.8 }}
    />
  );
};

/* ─── Hero (content only — background handled by InteractiveDotCanvas at page level) ─── */

const PortfolioBuilderHero = ({
  badgeText = 'Portfolio Builder',
  headlineBefore = 'Build portfolios that get noticed,',
  rotatingWords = ['not ignored.', 'not forgotten.', 'not skipped.'],
  description = 'Launch a polished personal website with templates, GitHub projects, custom sections, and one-click deployment — built for students, developers, and job seekers.',
  primaryCta = { text: 'Open Portfolio Builder', to: '/portfolio-builder/templates' },
  secondaryCta = { text: 'See examples', href: '#templates' },
  previewName = 'Your Name',
}) => {
  const contentDelay = 0.3;
  const itemDelayIncrement = 0.1;

  const bannerV = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: contentDelay },
    },
  };

  const headlineV = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay: contentDelay + itemDelayIncrement },
    },
  };

  const subV = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement * 2 },
    },
  };

  const formV = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement * 3 },
    },
  };

  const previewV = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.55, delay: contentDelay + itemDelayIncrement * 4 },
    },
  };

  const statsV = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement * 5 },
    },
  };

  const heroStats = [
    { value: '150+', label: 'Templates live' },
    { value: '10s', label: 'Deploy time' },
    { value: '4+', label: 'Hosting options' },
  ];

  const valuePills = [
    'No-code setup',
    'GitHub import',
    'Responsive templates',
  ];

  const previewHighlights = [
    { label: 'Projects', value: '6', color: 'bg-emerald-400' },
    { label: 'Skills', value: '12', color: 'bg-sky-400' },
    { label: 'Sections', value: '5', color: 'bg-violet-400' },
  ];

  const deployTargets = ['GitHub Pages', 'Cloudflare', 'Netlify', 'Vercel'];

  const previewInitials = previewName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'YN';

  const primaryButton = (
    <span className="inline-flex items-center justify-center gap-2">
      <RocketIcon className="h-4 w-4" aria-hidden="true" />
      {primaryCta.text}
    </span>
  );

  const secondaryButton = (
    <span className="inline-flex items-center justify-center gap-2">
      {secondaryCta.text}
      <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
    </span>
  );

  return (
    <section className="relative isolate overflow-hidden px-4 pb-20 pt-28 text-white sm:px-6 sm:pb-24 sm:pt-32 lg:px-8 lg:pb-28 lg:pt-36">
      <div className="absolute inset-x-0 top-20 -z-10 mx-auto h-72 max-w-4xl rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
        <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
          <MotionDiv
            variants={bannerV}
            initial="hidden"
            animate="visible"
            className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.12)] backdrop-blur"
          >
            <ShinyText text={badgeText} />
          </MotionDiv>

          <MotionH1
            variants={headlineV}
            initial="hidden"
            animate="visible"
            className="max-w-3xl text-balance text-5xl font-black leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-6xl xl:text-7xl"
          >
            {headlineBefore}{' '}
            <span className="block text-emerald-300">
              <RotatingText
                texts={rotatingWords}
                mainClassName="inline-flex overflow-hidden align-bottom pb-1"
                splitLevelClassName="inline-flex"
                elementLevelClassName="inline-block"
                rotationInterval={2400}
                staggerDuration={0.015}
              />
            </span>
          </MotionH1>

          <MotionP
            variants={subV}
            initial="hidden"
            animate="visible"
            className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-8 text-slate-300 sm:text-xl lg:mx-0"
          >
            {description}
          </MotionP>

          <MotionDiv
            variants={formV}
            initial="hidden"
            animate="visible"
            className="mt-9 flex flex-col items-stretch justify-center gap-4 sm:flex-row lg:justify-start"
          >
            {primaryCta.to ? (
              <Link
                to={primaryCta.to}
                aria-label={primaryCta.text}
                className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-emerald-400 px-7 py-4 text-base font-bold text-slate-950 shadow-[0_18px_45px_rgba(16,185,129,0.24)] transition hover:-translate-y-0.5 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                {primaryButton}
              </Link>
            ) : (
              <a
                href={primaryCta.href}
                aria-label={primaryCta.text}
                className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-emerald-400 px-7 py-4 text-base font-bold text-slate-950 shadow-[0_18px_45px_rgba(16,185,129,0.24)] transition hover:-translate-y-0.5 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                {primaryButton}
              </a>
            )}

            <a
              href={secondaryCta.href}
              aria-label={secondaryCta.text}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-base font-bold text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              {secondaryButton}
            </a>
          </MotionDiv>

          <MotionDiv
            variants={statsV}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400 lg:justify-start"
          >
            {valuePills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5"
              >
                {pill}
              </span>
            ))}
          </MotionDiv>

          <MotionDiv
            variants={statsV}
            initial="hidden"
            animate="visible"
            className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 sm:max-w-xl lg:max-w-none"
          >
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-black text-white sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </MotionDiv>
        </div>

        <MotionDiv
          variants={previewV}
          initial="hidden"
          animate="visible"
          className="relative mx-auto w-full max-w-xl lg:max-w-none"
          aria-label="Portfolio Builder preview mockup"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-emerald-400/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl sm:p-5">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                  Portfolio preview
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Sample layout generated from portfolio details
                </p>
              </div>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">
                Ready
              </span>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 to-sky-400 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/20">
                    {previewInitials}
                  </div>
                  <p className="mt-5 text-2xl font-black text-white">
                    {previewName}
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                    Frontend developer portfolio with projects, skills,
                    experience, and contact sections.
                  </p>
                </div>

                <div className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  Published
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {previewHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-slate-900/80 p-3"
                  >
                    <div className={cn('mb-3 h-2 w-8 rounded-full', item.color)} />
                    <div className="text-xl font-black text-white">
                      {item.value}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {['AI Resume Builder', 'GitHub Project Visualizer', 'CareerPilot Dashboard'].map(
                  (project) => (
                    <div
                      key={project}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                    >
                      <span className="text-sm font-semibold text-slate-200">
                        {project}
                      </span>
                      <span className="text-xs font-medium text-emerald-300">
                        Featured
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Powers deploys to
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {deployTargets.map((target) => (
                  <span
                    key={target}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-300"
                  >
                    {target}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>

      <style>
        {`
          @keyframes shine {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
        `}
      </style>
    </section>
  );
};
export { InteractiveDotCanvas };
export default PortfolioBuilderHero;