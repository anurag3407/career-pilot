import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Quote, Star } from "lucide-react";

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < count ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`} />
      ))}
    </div>
  );
}

export default function Testimonials({ data }) {
  const { testimonials } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase block mb-3">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            What Patients Say
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto text-base">Real stories from patients whose lives have been positively impacted through dedicated care.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {(testimonials ?? []).map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-100 rounded-3xl p-7 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 flex flex-col"
            >
              <Quote className="w-8 h-8 text-blue-200 mb-4" />
              <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-6 italic">
                "{t.feedback ?? t.review ?? t.content ?? t.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-200 to-teal-200 shrink-0 flex items-center justify-center">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name || "Profile Avatar"} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-sm font-bold">{(t.name ?? "P").charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-semibold text-sm truncate">{t.name ?? "Anonymous Patient"}</p>
                  {(t.role ?? t.condition ?? t.type) && (
                    <p className="text-slate-400 text-xs truncate">{t.role ?? t.condition ?? t.type}</p>
                  )}
                </div>
                <Stars count={t.rating ?? 5} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}