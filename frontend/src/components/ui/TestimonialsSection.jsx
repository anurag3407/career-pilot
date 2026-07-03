import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { TestimonialsColumn } from "./testimonials-columns";

const testimonials = [
  {
    text: "careerpilot's AI resume enhancement is incredible. It helped me tailor my resume perfectly for each application. Landed my dream job in 3 weeks!",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah Chen",
    role: "Software Engineer at Google",
  },
  {
    text: "The job tracking feature kept me organized throughout my search. The AI suggestions were spot-on. Highly recommend to any serious job seeker.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Michael Rodriguez",
    role: "Product Manager at Meta",
  },
  {
    text: "Finally, a platform that understands what job seekers actually need. Simple, powerful, and the dark mode is gorgeous!",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Emily Johnson",
    role: "UX Designer at Apple",
  },
  {
    text: "The AI matching is incredibly accurate. Found positions I never would have discovered on my own. Complete game changer for my career.",
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
    text: "Clean interface, powerful features. The job alerts kept me updated on perfect matches. Worth every minute spent on this platform.",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    name: "James Wilson",
    role: "Frontend Dev at Vercel",
  },
  {
    text: "The mock interview feature gave me the confidence I needed. Practiced system design questions and aced my final round.",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    name: "Amanda Foster",
    role: "Backend Engineer at Spotify",
  },
  {
    text: "Fellowship challenges helped me build real portfolio projects while earning. The community support is unmatched.",
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

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const trustStats = [
  { value: "4.9/5", label: "Average rating" },
  { value: "50K+", label: "Job seekers" },
  { value: "3x", label: "More interviews" },
  { value: "92%", label: "Would recommend" },
];

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[400px] w-[760px] -translate-x-1/2 rounded-full bg-secondary/[0.08] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 backdrop-blur-md">
            <span className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Success Stories
            </span>
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-foreground md:text-6xl">
            Loved by <span className="gradient-text-animated">thousands</span> of
            job seekers
          </h2>
          <p className="mt-6 max-w-md text-lg font-medium text-muted-foreground">
            Join the community of professionals who accelerated their careers
            with careerpilot.
          </p>
        </motion.div>

        {/* Featured testimonial */}
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mb-16 max-w-3xl overflow-hidden rounded-[2rem] border border-border bg-card/50 p-8 text-center shadow-2xl shadow-primary/5 backdrop-blur-xl md:p-12"
        >
          <div className="absolute -inset-x-10 -top-10 h-32 bg-primary/10 blur-3xl" />
          <Quote className="relative mx-auto mb-6 h-10 w-10 text-primary/40" />
          <blockquote className="relative text-xl font-medium leading-relaxed text-foreground md:text-2xl">
            "careerpilot didn't just improve my resume — it changed how I
            approach my entire career. I went from zero callbacks to multiple
            offers in under a month."
          </blockquote>
          <figcaption className="relative mt-8 flex items-center justify-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/women/1.jpg"
              alt="Sarah Chen"
              width={52}
              height={52}
              className="h-14 w-14 rounded-full border-2 border-border object-cover"
            />
            <div className="text-left">
              <div className="text-base font-black tracking-tight text-foreground">
                Sarah Chen
              </div>
              <div className="text-sm font-bold uppercase tracking-tight text-muted-foreground">
                Software Engineer at Google
              </div>
            </div>
          </figcaption>
        </motion.figure>

        {/* Trust stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border/60 md:grid-cols-4"
        >
          {trustStats.map((s) => (
            <div
              key={s.label}
              className="bg-card/40 px-6 py-6 text-center backdrop-blur-sm"
            >
              <div className="text-2xl font-black text-foreground md:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Marquee columns */}
        <div className="mask-[linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] flex max-h-200 justify-center gap-6 overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={25} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={35}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={30}
          />
        </div>
      </div>
    </section>
  );
}
