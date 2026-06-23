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
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { cn } from '../../lib/utils';

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
      } catch (err) {
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
    <motion.span
      className={cn(
        'inline-flex flex-wrap whitespace-pre-wrap relative align-bottom pb-[10px]',
        mainClassName
      )}
      {...rest}
      layout
    >
      <span className="sr-only">{texts[currentTextIndex]}</span>
      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        <motion.div
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
                  <motion.span
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
                  </motion.span>
                );
              })}
            </span>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.span>
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
  <motion.a
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
      <motion.div
        className="absolute bottom-[-2px] left-0 right-0 h-[1px] bg-[#0CF2A0]"
        variants={{ initial: { scaleX: 0, originX: 0.5 }, hover: { scaleX: 1, originX: 0.5 } }}
        initial="initial"
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    )}
  </motion.a>
);

const DropdownMenu = ({ children, isOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 origin-top z-40"
      >
        <div className="bg-[#111111] border border-gray-700/50 rounded-md shadow-xl p-2">
          {children}
        </div>
      </motion.div>
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
  }, [measure, handleMouseMove, animateDots]);

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
  badgeText = '150+ templates live',
  headlineBefore = 'Ship a stunning portfolio in',
  rotatingWords = ['minutes', 'one click', 'a weekend', 'one coffee'],
  description = 'Pick a template, fill a few fields, and your personal site is live on a global CDN. GitHub, resume, and 150+ creative themes — all in one builder.',
  primaryCta = { text: 'Start building free', to: '/portfolio-builder/templates' },
  secondaryCta = { text: 'See live examples', href: '#templates' },
}) => {
  /* ─── Entrance animations ─── */
  const contentDelay = 0.3;
  const itemDelayIncrement = 0.1;

  const bannerV = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: contentDelay } },
  };
  const headlineV = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement } },
  };
  const subV = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement * 2 } },
  };
  const formV = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement * 3 } },
  };
  const trialV = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement * 4 } },
  };
  const worksWithV = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement * 5 } },
  };

  return (
    <section className="relative text-gray-300 overflow-hidden">
      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 pb-20 min-h-[760px]">
        {/* Banner */}
        <motion.div variants={bannerV} initial="hidden" animate="visible" className="mb-6">
          <ShinyText
            text={badgeText}
            className="bg-[#1a1a1a] border border-gray-700 text-[#0CF2A0] px-4 py-1 rounded-full text-xs sm:text-sm font-medium cursor-pointer hover:border-[#0CF2A0]/50 transition-colors"
          />
        </motion.div>

        {/* Headline with rotating word */}
        <motion.h1
          variants={headlineV}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl lg:text-[64px] font-semibold text-white leading-tight max-w-4xl mb-4"
        >
          {headlineBefore}{' '}
          <span className="inline-block h-[1.2em] overflow-hidden align-bottom">
            <RotatingText
              texts={rotatingWords}
              mainClassName="text-[#0CF2A0] mx-1"
              staggerFrom="last"
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '110%', opacity: 0 }}
              staggerDuration={0.01}
              transition={{ type: 'spring', damping: 18, stiffness: 250 }}
              rotationInterval={2200}
              splitBy="characters"
              auto
              loop
            />
          </span>
          .
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={subV}
          initial="hidden"
          animate="visible"
          className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-8"
        >
          {description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={formV}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full max-w-md mx-auto mb-3"
        >
          <Link
            to={primaryCta.to}
            className="w-full sm:w-auto bg-[#0CF2A0] text-[#111111] px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-opacity-90 transition-colors duration-200 whitespace-nowrap shadow-sm hover:shadow-md flex-shrink-0 flex items-center justify-center gap-2"
          >
            <RocketIcon />
            {primaryCta.text}
          </Link>
          <a
            href={secondaryCta.href}
            className="w-full sm:w-auto px-5 py-2.5 rounded-md text-sm font-semibold border border-gray-700 text-gray-200 hover:border-[#0CF2A0] hover:text-white transition-colors duration-200 whitespace-nowrap flex-shrink-0"
          >
            {secondaryCta.text}
          </a>
        </motion.div>

        <motion.p
          variants={trialV}
          initial="hidden"
          animate="visible"
          className="text-xs text-gray-500 mb-10"
        >
          Free forever for individuals · No credit card · Deploy in under 10s
        </motion.p>

        {/* Trust row */}
        <motion.div
          variants={worksWithV}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center space-y-2"
        >
          <span className="text-xs uppercase text-gray-500 tracking-wider font-medium">
            Powers deploys to
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-gray-400">
            <span className="flex items-center gap-2 whitespace-nowrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              GitHub Pages
            </span>
            <span className="flex items-center gap-2 whitespace-nowrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#F38020">
                <path d="M16.5 16.5L24 9l-3.5-3.5-4.5 4.5-4.5-4.5L8 9l8.5 7.5zM0 9l3.5-3.5L8 9l-4.5 4.5L0 9zm8.5 4.5L12 9l3.5 4.5L12 18l-3.5-4.5z" />
              </svg>
              Cloudflare
            </span>
            <span className="flex items-center gap-2 whitespace-nowrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#00C7B7">
                <path d="M17.5 12.5c0-1.5-1-2.7-2.4-3.1.2-.5.3-1 .3-1.5 0-2.2-1.8-4-4-4-1.7 0-3.1 1-3.7 2.5C6 6.6 4.6 7.7 4 9.3 2.4 9.7 1.2 11.1 1.2 12.8c0 1.9 1.5 3.4 3.4 3.4h12.5c1.5 0 2.7-1.2 2.7-2.7 0-.4-.1-.7-.2-1z" />
              </svg>
              Netlify
            </span>
            <span className="flex items-center gap-2 whitespace-nowrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.56v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.39.97.01 1.95.14 2.86.39 2.18-1.49 3.14-1.18 3.14-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.15v3.19c0 .31.21.67.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
              </svg>
              Vercel
            </span>
            <span className="whitespace-nowrap text-gray-500 font-medium uppercase text-xs">
              + GitHub import
            </span>
          </div>
        </motion.div>
      </div>

      {/* Inline keyframes for the shine animation used by ShinyText */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};

export { PortfolioBuilderHero, InteractiveDotCanvas };
export default PortfolioBuilderHero;