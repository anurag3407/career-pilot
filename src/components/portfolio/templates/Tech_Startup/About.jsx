import React, { useEffect } from "react";
import { Rocket, Lightbulb, Zap, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[-100px] w-[450px] h-[450px] bg-purple-500/20 blur-[120px] rounded-full" />
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-20">

        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-10 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Building the Future of Career Growth
          </h1>

          <p className="mt-6 text-muted-foreground text-lg md:text-xl">
            We design and build modern AI-powered career tools that help students
            and professionals grow faster, smarter, and more confidently.
          </p>
        </div>

        {/* Stats Row */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <p className="text-3xl font-bold text-cyan-400">10K+</p>
            <p className="text-muted-foreground mt-2">Resumes Built</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <p className="text-3xl font-bold text-purple-400">5K+</p>
            <p className="text-muted-foreground mt-2">Jobs Matched</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <p className="text-3xl font-bold text-pink-400">98%</p>
            <p className="text-muted-foreground mt-2">User Satisfaction</p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:scale-[1.03] transition">
            <Rocket className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold">Fast Execution</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              From idea to product in record time — built for speed and scalability.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:scale-[1.03] transition">
            <Lightbulb className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold">Smart Innovation</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              AI-powered tools that simplify job search and career growth.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:scale-[1.03] transition">
            <Zap className="w-10 h-10 text-pink-400 mb-4" />
            <h3 className="text-xl font-semibold">Scalable System</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Built like a real startup product — modular, fast, and production-ready.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">
            Ready to upgrade your career?
          </h2>
          <p className="text-muted-foreground mt-3">
            Start building your future with Career Pilot tools.
          </p>

          <Link
            to="/register"
            className="inline-block mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:scale-105 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}