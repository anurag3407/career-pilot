import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

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

export default function HeroSection() {
  const deferredContentRef = useRef(null);
  const [shouldLoadDeferredContent, setShouldLoadDeferredContent] = useState(false);

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
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Effects - Premium Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 z-10">
        <div
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              AI-Powered Career Acceleration
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-8xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
            <span
              className="block"
            >
              Land your dream job
            </span>
            <span
              className="block"
            >
              with{" "}
              <span className="gradient-text">careerpilot</span>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            The intelligent job search platform that enhances your resume with AI,
            matches you with perfect opportunities, and tracks your applications—all in one place.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/25 overflow-hidden"
            >
              <span className="relative z-10">Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border bg-card hover:bg-muted text-foreground font-bold rounded-2xl transition-all duration-300 backdrop-blur-sm"
            >
              Explore Jobs
            </Link>
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap justify-center gap-8 md:gap-20 mt-20 pt-10 border-t border-border"
          >
            {[
              { value: "10K+", label: "Active Jobs" },
              { value: "95%", label: "ATS Success" },
              { value: "2.5x", label: "Faster Hiring" },
              { value: "50K+", label: "Users" },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-2xl md:text-4xl font-black text-foreground group-hover:text-primary transition-colors">
                  <AnimatedCounter value={stat.value} duration={2000} />
                </div>

                <div className="text-sm font-semibold text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* World Map Section */}
        <div
          ref={deferredContentRef}
          className="mt-24 relative"
        >
          <div className="text-center mb-10 relative">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Global{" "}
              <span className="text-primary">
                Connectivity
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mt-4 font-medium">
              Connect with opportunities worldwide. Work remotely from anywhere
              or find on-site roles across continents.
            </p>
          </div>

          <div className="relative p-1 rounded-4xl border border-border bg-card/30 backdrop-blur-xl shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-secondary/5" />
            <div className="relative p-4 min-h-80">
              {shouldLoadDeferredContent ? (
                <Suspense fallback={<DeferredContentShell className="min-h-80" />}>
                  <DeferredWorldMap dots={worldMapDots} lineColor="var(--primary)" />
                </Suspense>
              ) : (
                <DeferredContentShell className="min-h-80" />
              )}
            </div>
          </div>
        </div>
        <div className="mt-10">
          {shouldLoadDeferredContent ? (
            <Suspense fallback={<DeferredContentShell className="min-h-[780px]" />}>
              <DeferredFeaturesCard />
            </Suspense>
          ) : (
            <DeferredContentShell className="min-h-[780px]" />
          )}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-background to-transparent z-10" />
    </section>
  );
}

function DeferredContentShell({ className = "" }) {
  return (
    <div
      className={`w-full rounded-3xl border border-dashed border-border/60 bg-muted/20 animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

