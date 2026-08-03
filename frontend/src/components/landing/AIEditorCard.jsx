import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, MousePointerClick, Palette, MessageSquare, Wand2 } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * AIEditorCard — entry point sitting between the hero and the FeatureShowcase
 * on /portfolio-builder. Clicking the CTA opens AIBuilderModal in the parent.
 */
export default function AIEditorCard({ onOpen }) {
  const features = [
    { icon: MousePointerClick, label: 'Click any element' },
    { icon: Palette, label: 'Change colors live' },
    { icon: Wand2, label: 'Inline AI enhancer' },
  ];

  return (
    <section className="relative px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'group relative overflow-hidden rounded-3xl border border-neutral-800',
            'bg-gradient-to-br from-[#0f0f12] via-[#0a0a0d] to-[#0f0f12]',
            'p-8 md:p-12 shadow-2xl'
          )}
        >
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#E10600]/20 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-emerald-500/15 blur-[120px]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(to right,#808080 1px,transparent 1px),linear-gradient(to bottom,#808080 1px,transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* LEFT — copy + CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E10600]/40 bg-[#E10600]/10 px-3 py-1 text-xs font-mono uppercase tracking-widest text-[#ff6655]">
                <Sparkles className="h-3.5 w-3.5" />
                AI Portfolio Builder
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
                <span className="block">Edit your portfolio</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#E10600] via-[#ff6655] to-white">
                  like a cockpit.
                </span>
              </h2>

              <p className="text-neutral-400 text-base md:text-lg max-w-xl leading-relaxed">
                Open the F1 Racing template in a side-by-side editor. Click any element
                to edit text or change colors. Chat with the AI to rewrite whole sections.
                Save without deploying — your work stays in the browser.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {features.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-sm"
                  >
                    <Icon className="h-3.5 w-3.5 text-[#E10600]" />
                    {label}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={onOpen}
                  className={cn(
                    'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden',
                    'bg-[#E10600] text-white px-7 py-3.5 font-mono font-extrabold uppercase tracking-widest text-sm',
                    'border border-[#E10600] shadow-lg shadow-[#E10600]/30',
                    'transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#E10600]/40 active:translate-y-0',
                    '-skew-x-12'
                  )}
                >
                  <span className="relative flex items-center gap-2 skew-x-12">
                    <Sparkles className="h-4 w-4" />
                    Generate with AI
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </span>
                </button>

                <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                  Free · No signup · Save locally
                </span>
              </div>
            </div>

            {/* RIGHT — preview mockup card */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="relative rounded-2xl border border-neutral-800 bg-[#070709] overflow-hidden shadow-2xl"
              >
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-neutral-800 bg-[#0c0c10]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                  <span className="ml-3 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    F1_Racing / edit
                  </span>
                </div>

                {/* Faux split preview */}
                <div className="grid grid-cols-2">
                  <div className="p-4 border-r border-neutral-800 bg-[#070709]">
                    <div className="aspect-[4/5] rounded-md bg-gradient-to-br from-[#121216] to-[#070709] border border-neutral-800 p-3 space-y-2">
                      <div className="text-[8px] font-mono text-[#E10600] tracking-widest">
                        #33
                      </div>
                      <div className="text-xs font-bold text-white leading-tight">
                        ALEX VERSTAPPEN
                      </div>
                      <div className="text-[8px] text-neutral-500">Full-Stack Developer</div>
                      <div className="h-px bg-neutral-800 my-1.5" />
                      <div className="grid grid-cols-3 gap-1">
                        <div className="bg-neutral-900 border border-neutral-800 rounded p-1">
                          <div className="text-[6px] text-neutral-500 uppercase">Podiums</div>
                          <div className="text-[8px] text-white font-bold">42</div>
                        </div>
                        <div className="bg-neutral-900 border border-neutral-800 rounded p-1">
                          <div className="text-[6px] text-neutral-500 uppercase">Pace</div>
                          <div className="text-[8px] text-white font-bold">8 Yrs</div>
                        </div>
                        <div className="bg-neutral-900 border border-neutral-800 rounded p-1">
                          <div className="text-[6px] text-emerald-400 uppercase">Fast</div>
                          <div className="text-[8px] text-emerald-400 font-bold">99.9%</div>
                        </div>
                      </div>
                      {/* Highlighted editable element */}
                      <div className="relative bg-neutral-900/40 border border-dashed border-[#E10600]/70 rounded p-1.5">
                        <div className="text-[7px] text-neutral-300 leading-snug">
                          Engineering high-perf systems...
                        </div>
                        <span className="absolute -top-2 left-1.5 text-[6px] font-mono uppercase tracking-widest bg-[#E10600] text-white px-1 rounded">
                          ✎ editing
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-[#0c0c10] space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-3 w-3 text-[#E10600]" />
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                        Chat
                      </span>
                    </div>
                    <div className="rounded-md bg-white/5 border border-white/10 p-2">
                      <div className="text-[8px] text-neutral-300">
                        Make the bio sound more confident.
                      </div>
                    </div>
                    <div className="rounded-md bg-[#E10600]/10 border border-[#E10600]/30 p-2">
                      <div className="text-[8px] text-white">
                        Sure — here's a punchier version...
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-950 px-2 py-1.5">
                      <div className="flex-1 text-[8px] text-neutral-600">
                        Ask anything...
                      </div>
                      <Sparkles className="h-3 w-3 text-[#E10600]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}