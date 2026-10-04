
import { User, MapPin, Briefcase } from 'lucide-react';
import { SectionHeading, AnimatedCounter } from './Shared';
import data from '../../../../data/dummy_data.json';

export default function About() {
  return (
    <section className="py-24 bg-zinc-950 px-4 relative z-10 border-t border-zinc-900/50">
      <div className="max-w-5xl mx-auto">
        <SectionHeading icon={User} className="flex items-center justify-center md:justify-start gap-4 mb-12">
          About
        </SectionHeading>
        
        <motion.div 
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-zinc-900/40 border border-zinc-800/60 p-8 md:p-12 rounded-4xl shadow-xl backdrop-blur-sm hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] transition-shadow duration-500"
        >
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-zinc-300 text-lg md:text-xl leading-relaxed mb-8 text-center md:text-left"
          >
            {data.personal.bio}
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-6 border-t border-zinc-800/50 pt-8 mt-8 justify-center md:justify-start">
            <div className="flex items-center gap-3 text-zinc-400">
              <div className="p-3 bg-zinc-950 rounded-full border border-zinc-800">
                <MapPin size={20} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-600 font-bold mb-1">Base of Operations</p>
                <p className="text-white font-medium">{data.personal.location || "Earth"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-zinc-400">
              <div className="p-3 bg-zinc-950 rounded-full border border-zinc-800">
                <Briefcase size={20} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-600 font-bold mb-1">Current Role</p>
                <p className="text-white font-medium">{data.personal.title}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <motion.div whileHover={{ y: -10, scale: 1.05 }} className="text-center p-8 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 shadow-lg hover:border-cyan-500/50 transition-colors cursor-default">
            <h4 className="text-5xl font-black text-cyan-400 mb-2">
              <AnimatedCounter to={data.stats.yearsExperience} suffix="+" />
            </h4>
            <p className="text-zinc-500 text-sm uppercase tracking-widest font-semibold">Years Experience</p>
          </motion.div>
          <motion.div whileHover={{ y: -10, scale: 1.05 }} className="text-center p-8 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 shadow-lg hover:border-indigo-500/50 transition-colors cursor-default">
            <h4 className="text-5xl font-black text-indigo-400 mb-2">
              <AnimatedCounter to={data.stats.projectsCompleted} suffix="+" />
            </h4>
            <p className="text-zinc-500 text-sm uppercase tracking-widest font-semibold">Projects Shipped</p>
          </motion.div>
          <motion.div whileHover={{ y: -10, scale: 1.05 }} className="text-center p-8 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 shadow-lg hover:border-rose-400/50 transition-colors cursor-default">
            <h4 className="text-5xl font-black text-rose-400 mb-2">
              <AnimatedCounter to={data.stats.happyClients} />
            </h4>
            <p className="text-zinc-500 text-sm uppercase tracking-widest font-semibold">Happy Clients</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
