import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    text: "careerpilot's AI resume enhancement is incredible. Landed my dream job in 3 weeks!",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    featured: true,
  },
  {
    text: "The job tracking feature kept me organized throughout my search. Highly recommend.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Michael Rodriguez",
    role: "Product Manager at Meta",
  },
  {
    text: "Finally, a platform that understands what job seekers actually need.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Emily Johnson",
    role: "UX Designer at Apple",
  },
  {
    text: "The AI matching is incredibly accurate. Complete game changer for my career.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "David Kim",
    role: "Data Scientist at Netflix",
  },
  {
    text: "Used careerpilot to transition from startup to big tech. The resume analyzer helped me highlight the right achievements.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Lisa Thompson",
    role: "Engineering Lead at Stripe",
  },
  {
    text: "Clean interface, powerful features. Worth every minute spent on this platform.",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    name: "James Wilson",
    role: "Frontend Dev at Vercel",
  },
  {
    text: "The mock interview feature gave me the confidence I needed. Aced my final round.",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    name: "Amanda Foster",
    role: "Backend Engineer at Spotify",
  },
  {
    text: "Fellowship challenges helped me build real portfolio projects while earning.",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    name: "Ryan Martinez",
    role: "Full Stack Dev at Airbnb",
  },
  {
    text: "From application to offer in just 2 weeks. careerpilot streamlined my entire job search process beautifully.",
    image: "https://randomuser.me/api/portraits/women/9.jpg",
    name: "Jessica Lee",
    role: "ML Engineer at OpenAI",
  },
];

const stats = [
  { value: "4.9/5", label: "Average rating" },
  { value: "50K+", label: "Job seekers" },
  { value: "3x", label: "More interviews" },
  { value: "92%", label: "Would recommend" },
];

function TestimonialCard({ t, index }) {
  const rotation = [-1.5, 0.8, -0.5, 1.2, -0.8, 0.5, -1, 0.8, -0.5][index % 9];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      style={{ rotate: `${rotation}deg` }}
      className={`rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl ${
        t.featured ? "md:col-span-2 border-primary/20" : ""
      }`}
    >
      <div className="mb-4 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className={`font-medium leading-relaxed text-foreground ${t.featured ? "text-lg md:text-xl" : "text-sm"}`}>
        "{t.text}"
      </p>
      <div className="mt-5 flex items-center gap-3">
        <img
          src={t.image}
          alt={t.name}
          width={36}
          height={36}
          className="h-9 w-9 rounded-full border border-border object-cover"
        />
        <div>
          <p className="text-sm font-bold text-foreground">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden py-32 lg:py-40">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[11px] font-black uppercase tracking-[0.35em] text-primary/70">
            007 — Stories
          </span>
          <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-tighter text-foreground md:text-7xl">
            Real people.
            <br />
            <span className="text-muted-foreground/40">Real results.</span>
          </h2>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border/40 md:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-background/80 px-6 py-5 text-center">
              <div className="text-2xl font-black text-foreground md:text-3xl">{s.value}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Masonry grid */}
        <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <div key={t.name} className="mb-5 break-inside-avoid">
              <TestimonialCard t={t} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
