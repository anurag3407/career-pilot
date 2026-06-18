import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function ZenQuote({ 
  quote = "Simplicity is the ultimate sophistication.", 
  author = "Leonardo da Vinci" 
}) {
  return (
    <section className="w-full py-24 md:py-32 bg-white flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-10"
      >
        {/* Subtle, thin quotation mark (hidden from screen readers) */}
        <Quote size={48} strokeWidth={1} className="text-slate-200" aria-hidden="true" />
        
        {/* The Quote */}
        <blockquote className="text-3xl md:text-5xl lg:text-6xl font-light text-slate-800 leading-snug md:leading-tight tracking-tight">
          "{quote}"
        </blockquote>
        
        {/* The Author & Separator */}
        <div className="flex flex-col items-center gap-6 mt-4">
          <div className="w-12 h-[1px] bg-slate-300"></div>
          <cite className="text-xs md:text-sm uppercase tracking-[0.3em] text-slate-400 font-medium not-italic">
            {author}
          </cite>
        </div>
      </motion.div>
    </section>
  );
}