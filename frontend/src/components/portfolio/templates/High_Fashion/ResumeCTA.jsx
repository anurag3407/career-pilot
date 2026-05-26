import { ArrowRight, Download, Sparkles } from "lucide-react";

export default function ResumeCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0e0c0a] text-[#f6f1ea]">
      <div className="absolute -top-40 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#d9b26f]/40 via-[#d9b26f]/10 to-transparent blur-3xl" />
      <div className="absolute -bottom-48 -left-24 h-80 w-80 rounded-full bg-gradient-to-tr from-[#7b5c2f]/40 via-[#7b5c2f]/10 to-transparent blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_rgba(255,255,255,0)_55%)]" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f1d6a3]/30 bg-[#15120f]/60 px-3 py-1 text-xs uppercase tracking-[0.28em] text-[#f1d6a3]">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#f1d6a3] animate-pulse" />
              High Fashion Edit
            </div>

            <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
              Your resume, tailored like haute couture.
            </h2>
            <p className="mt-4 max-w-xl text-sm text-[#d8d1c7] sm:text-base">
              Craft a runway-ready profile with a refined layout, luxurious typography, and a
              polished narrative. Make every line feel intentional, elegant, and unforgettable.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-[#d9b26f] px-6 py-3 text-sm font-semibold text-[#1a140b] shadow-[0_10px_30px_rgba(217,178,111,0.35)] transition-transform hover:-translate-y-0.5">
                Build My Resume
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-[#f1d6a3]/40 px-6 py-3 text-sm font-semibold text-[#f6f1ea] transition-colors hover:bg-[#1c1813]">
                Download Lookbook
                <Download className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-xs text-[#bfb7ac]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#f1d6a3]" />
                Editorial-grade layouts
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#f1d6a3]" />
                ATS-friendly structure
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#f1d6a3]" />
                Luxury typography pairing
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-[#f1d6a3]/25 bg-gradient-to-br from-[#1a1511] via-[#12100d] to-[#0b0a08] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-[#f1d6a3]">Runway Score</span>
                <span className="rounded-full border border-[#f1d6a3]/30 px-3 py-1 text-xs text-[#f6f1ea]">2026 Edit</span>
              </div>

              <div className="mt-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#d8d1c7]">Elegance</span>
                  <span className="text-lg font-semibold text-[#f1d6a3]">98</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#2a241c]">
                  <div className="h-2 w-[92%] rounded-full bg-gradient-to-r from-[#f1d6a3] via-[#d9b26f] to-[#b0813d]" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#d8d1c7]">Impact</span>
                  <span className="text-lg font-semibold text-[#f1d6a3]">94</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#2a241c]">
                  <div className="h-2 w-[88%] rounded-full bg-gradient-to-r from-[#f1d6a3] via-[#d9b26f] to-[#b0813d]" />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#f1d6a3]/20 bg-[#14110e] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#a69c8f]">Reviews</p>
                  <p className="mt-2 text-2xl font-semibold text-[#f6f1ea]">4.9/5</p>
                  <p className="text-xs text-[#bfb7ac]">Industry stylists</p>
                </div>
                <div className="rounded-2xl border border-[#f1d6a3]/20 bg-[#14110e] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#a69c8f]">Placements</p>
                  <p className="mt-2 text-2xl font-semibold text-[#f6f1ea]">+72%</p>
                  <p className="text-xs text-[#bfb7ac]">Interview uplift</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
