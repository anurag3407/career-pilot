import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Star } from "lucide-react";
import SectionLabel from "./SectionLabel";
import data from "../../../../data/dummy_data.json";

export default function Testimonials() {
  const { testimonials } = data;
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % (testimonials?.length || 1)), 4500);
    return () => clearInterval(t);
  }, [testimonials?.length]);

  return (
    <section id="testimonials" ref={ref} className="py-28 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Testimonials</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-16"
        >
          Kind words
        </motion.h2>

        <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-start">
          {/* Featured */}
          <div className="relative min-h-[260px]">
            <AnimatePresence mode="wait">
              {testimonials?.map((t, i) =>
                i === active ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                    transition={{ duration: 0.55 }}
                    className="absolute inset-0 bg-white border border-[#f0f0f0] rounded-3xl p-8 shadow-sm"
                  >
                    {/* Pink accent bar */}
                    <div className="w-10 h-1 bg-[#ea4c89] rounded-full mb-6" />

                    {/* Stars */}
                    <div className="flex gap-1 mb-5">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} size={13} className="fill-[#ea4c89] text-[#ea4c89]" />
                      ))}
                    </div>

                    <p className="text-[#444] text-lg md:text-xl leading-relaxed font-light mb-8 italic">
                      "{t.text}"
                    </p>

                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`}
                        alt={t.name}
                        className="w-11 h-11 rounded-full border-2 border-[#ea4c89]/20 object-cover"
                      />
                      <div>
                        <div className="text-[#1a1a1a] font-semibold text-sm">{t.name}</div>
                        <div className="text-[#ea4c89] text-xs">{t.role}</div>
                      </div>
                    </div>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar thumbnails */}
          <div className="flex flex-col gap-2.5">
            {testimonials?.map((t, i) => (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                whileHover={{ x: 3 }}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  i === active
                    ? "bg-[#fef0f5] border-[#ea4c89]/25"
                    : "bg-white border-[#f0f0f0] hover:border-[#ea4c89]/15"
                }`}
              >
                <img
                  src={t.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`}
                  alt={t.name}
                  className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
                />
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${i === active ? "text-[#ea4c89]" : "text-[#666]"}`}>
                    {t.name}
                  </div>
                  <div className="text-[10px] text-[#bbb] truncate">{t.role}</div>
                </div>
                {i === active && (
                  <motion.div layoutId="activePip" className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ea4c89] flex-shrink-0" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}