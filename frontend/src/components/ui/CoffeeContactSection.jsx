import { motion } from "framer-motion";
import { Coffee, Mail, MapPin, Phone } from "lucide-react";

export default function CoffeeContactSection() {
  return (
    <section id="contact" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/40 to-background" />

      {/* Coffee Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-card mb-8">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Coffee & Conversation
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
              Let’s brew your next big opportunity
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Whether you have questions, feedback, or collaboration ideas,
              our team is always ready for a meaningful conversation over coffee.
            </p>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border mb-10 max-w-md">
  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
    <Coffee className="w-6 h-6 text-amber-400" />
  </div>

  <div>
    <p className="font-bold text-foreground">
      Fresh Ideas Daily
    </p>
    <p className="text-sm text-muted-foreground">
      Brewing innovation for ambitious careers.
    </p>
  </div>
</div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">
                  hello@careerpilot.dev
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">
                  +91 98765 43210
                </span>
              </div>

              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">
                  Remote • Worldwide
                </span>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-card/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-8 shadow-2xl">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Message
                </label>
                <textarea
                  rows="5"
                  placeholder="Write your message..."
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}