import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  FileText,
  Briefcase,
  Bot,
  Star,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import DotPattern from "./dot-pattern-1";
import { PatternText } from "./pattern-text";

const DeferredWorldMap = lazy(() => import("./WorldMap"));
const DeferredFeaturesCard = lazy(() => import("./FeaturesCard"));

const worldMapDots = [
  {
    start: { lat: 64.2008, lng: -149.4937 }, // Alaska
    end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  },
  {
    start: { lat: 64.2008, lng: -149.4937 }, // Alaska
    end: { lat: -15.7975, lng: -47.8919 }, // Brazil
  },
  {
    start: { lat: -15.7975, lng: -47.8919 }, // Brazil
    end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
  },
  {
    start: { lat: 51.5074, lng: -0.1278 }, // London
    end: { lat: 28.6139, lng: 77.209 }, // New Delhi
  },
  {
    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
    end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
  },
  {
    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
    end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  },
  {
    start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
    end: { lat: -33.8688, lng: 151.2093 }, // Sydney
  },
  {
    start: { lat: 40.7128, lng: -74.006 }, // New York
    end: { lat: 51.5074, lng: -0.1278 }, // London
  },
];

const trustLogos = [
  "Google",
  "Stripe",
  "Notion",
  "Vercel",
  "Airbnb",
  "Linear",
  "Figma",
  "OpenAI",
];

const stats = [
  { value: "10K+", label: "Active Jobs" },
  { value: "95%", label: "ATS Success" },
  { value: "2.5x", label: "Faster Hiring" },
  { value: "50K+", label: "Users" },
];

// Stagger orchestration for the headline column
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const rise = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HeroSection() {
  const deferredContentRef = useRef(null);
  const [shouldLoadDeferredContent, setShouldLoadDeferredContent] =
    useState(false);
  const prefersReduced = useReducedMotion();

  // Pointer spotlight that follows the cursor across the hero
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(20);
  const spotX = useSpring(pointerX, { stiffness: 120, damping: 30 });
  const spotY = useSpring(pointerY, { stiffness: 120, damping: 30 });

  // Scroll-linked parallax for the foreground content
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const handlePointerMove = (e) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set(((e.clientX - rect.left) / rect.width) * 100);
    pointerY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  useEffect(() => {
    const target = deferredContentRef.current;

    if (!target || shouldLoadDeferredContent) {
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoadDeferredContent(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadDeferredContent(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [shouldLoadDeferredContent]);

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* ── Layered premium background ─────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Aurora mesh */}
        <div className="aurora-layer aurora-1" />
        <div className="aurora-layer aurora-2" />
        <div className="aurora-layer aurora-3" />

        {/* Perspective grid floor */}
        <div className="premium-grid absolute inset-0" />

        {/* Cursor-tracking spotlight */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: useMotionTemplate`radial-gradient(600px circle at ${spotX}% ${spotY}%, rgba(var(--primary-rgb), 0.12), transparent 60%)`,
          }}
        />

        {/* Film grain */}
        <div className="noise-overlay absolute inset-0 mix-blend-overlay" />

        {/* Top + bottom fades to blend into the page */}
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent" />
      </div>

      {/* ── Foreground content ─────────────────────────────────── */}
      <motion.div
        style={{ y: prefersReduced ? 0 : contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-4xl text-center"
        >
          {/* Badge */}
          <motion.div variants={rise} className="flex justify-center">
            <div className="shine-sweep group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-border bg-card/60 px-4 py-2 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                AI-Powered Career Acceleration
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={rise}
            className="mt-8 flex flex-col items-center justify-center text-5xl font-bold leading-[1.04] tracking-tight text-foreground md:text-8xl"
          >
            <span className="block text-center">Land your dream job with</span>
            <span className="block mt-6 relative flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)] blur-[30px]"
              />
              <span className="relative inline-flex items-center justify-center border border-red-500 px-6 py-2 md:px-8 md:py-4">
                <DotPattern width={5} height={5} />
                <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-red-500 text-white" />
                <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-red-500 text-white" />
                <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-red-500 text-white" />
                <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-red-500 text-white" />
                <PatternText text="CAREERPILOT" className="relative z-20" />
              </span>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={rise}
            className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground md:text-xl"
          >
            The intelligent job search platform that enhances your resume with
            AI, matches you with perfect opportunities, and tracks your
            applications—all in one place.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={rise}
            className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl p-[1.5px] shadow-xl shadow-primary/25 transition-transform duration-300 hover:scale-[1.03]"
            >
              {/* Rotating conic glow ring */}
              <span className="absolute inset-[-200%] animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--primary)_25%,var(--secondary)_50%,transparent_75%)] opacity-80" />
              <span className="relative inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-primary-foreground">
                Get Started Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/60 px-8 py-4 font-bold text-foreground backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-muted"
            >
              Explore Jobs
            </Link>
          </motion.div>

          {/* Social proof line */}
          <motion.div
            variants={rise}
            className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground"
          >
            <div className="flex -space-x-2">
              {[
                "from-sky-400 to-blue-600",
                "from-violet-400 to-purple-600",
                "from-pink-400 to-rose-600",
                "from-emerald-400 to-teal-600",
              ].map((g, i) => (
                <span
                  key={i}
                  className={`h-7 w-7 rounded-full border-2 border-background bg-linear-to-br ${g}`}
                />
              ))}
            </div>
            <span className="flex items-center gap-1">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </span>
              <span className="font-semibold text-foreground">4.9/5</span>
              from 50,000+ professionals
            </span>
          </motion.div>
        </motion.div>

        {/* ── Floating product preview ─────────────────────────── */}
        <ProductPreview prefersReduced={prefersReduced} />

        {/* ── Trust marquee ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
            Trusted by talent hired at
          </p>
          <div className="marquee-mask relative mt-6 overflow-hidden">
            <div className="flex w-max animate-marquee gap-12 pr-12">
              {[...trustLogos, ...trustLogos].map((logo, i) => (
                <span
                  key={i}
                  className="text-xl font-bold tracking-tight text-muted-foreground/50 transition-colors hover:text-foreground"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Stats ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border/60 md:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-card/40 px-6 py-8 text-center backdrop-blur-sm transition-colors hover:bg-card"
            >
              <div className="text-3xl font-black text-foreground transition-colors group-hover:text-primary md:text-4xl">
                <AnimatedCounter value={stat.value} duration={2000} />
              </div>
              <div className="mt-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── World Map ────────────────────────────────────────── */}
        <div ref={deferredContentRef} className="relative mt-24">
          <div className="relative mb-10 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Global <span className="gradient-text-animated">Connectivity</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base font-medium text-muted-foreground md:text-lg">
              Connect with opportunities worldwide. Work remotely from anywhere
              or find on-site roles across continents.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-4xl border border-border bg-card/30 p-1 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-secondary/5" />
            <div className="relative min-h-80 p-4">
              {shouldLoadDeferredContent ? (
                <Suspense fallback={<DeferredContentShell className="min-h-80" />}>
                  <DeferredWorldMap
                    dots={worldMapDots}
                    lineColor="var(--primary)"
                  />
                </Suspense>
              ) : (
                <DeferredContentShell className="min-h-80" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-10">
          {shouldLoadDeferredContent ? (
            <Suspense
              fallback={<DeferredContentShell className="min-h-[780px]" />}
            >
              <DeferredFeaturesCard />
            </Suspense>
          ) : (
            <DeferredContentShell className="min-h-[780px]" />
          )}
        </div>
      </motion.div>
    </section>
  );
}

/* Floating, tilt-on-hover product preview card */
function ProductPreview({ prefersReduced }) {
  const ref = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 150, damping: 18 });
  const sRotY = useSpring(rotY, { stiffness: 150, damping: 18 });

  const onMove = (e) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotY.set(px * 10);
    rotX.set(-py * 10);
  };

  const onLeave = () => {
    rotX.set(0);
    rotY.set(0);
  };

  const previewCards = [
    {
      icon: FileText,
      title: "AI Resume Score",
      meta: "ATS Optimized",
      value: "98",
      tint: "from-sky-500/20 to-blue-500/5",
      bar: "98%",
    },
    {
      icon: Briefcase,
      title: "Matched Roles",
      meta: "Updated live",
      value: "247",
      tint: "from-violet-500/20 to-purple-500/5",
      bar: "82%",
    },
    {
      icon: Bot,
      title: "Mock Interview",
      meta: "Avg. confidence",
      value: "A+",
      tint: "from-pink-500/20 to-rose-500/5",
      bar: "91%",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto mt-20 max-w-5xl"
      style={{ perspective: 1200 }}
    >
      {/* Glow behind the card */}
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-primary/20 blur-3xl animate-pulse-glow" />

      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: sRotX, rotateY: sRotY, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-2 shadow-2xl backdrop-blur-xl"
      >
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          <div className="ml-3 flex-1 rounded-md bg-muted/60 px-3 py-1 text-left text-xs text-muted-foreground">
            app.careerpilot.io/dashboard
          </div>
        </div>

        {/* Card grid */}
        <div className="grid gap-3 rounded-2xl bg-background/40 p-4 sm:grid-cols-3">
          {previewCards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.15, duration: 0.6 }}
              style={{ transform: "translateZ(40px)" }}
              className={`relative overflow-hidden rounded-2xl border border-border bg-linear-to-br ${c.tint} p-4 text-left`}
            >
              <div className="flex items-center justify-between">
                <c.icon className="h-5 w-5 text-primary" />
                <span className="text-2xl font-black text-foreground">
                  {c.value}
                </span>
              </div>
              <p className="mt-3 text-sm font-bold text-foreground">
                {c.title}
              </p>
              <p className="text-xs text-muted-foreground">{c.meta}</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: c.bar }}
                  transition={{ delay: 1.2 + i * 0.15, duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-linear-to-r from-primary to-secondary"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeferredContentShell({ className = "" }) {
  return (
    <div
      className={`w-full animate-pulse rounded-3xl border border-dashed border-border/60 bg-muted/20 ${className}`}
      aria-hidden="true"
    />
  );
}
