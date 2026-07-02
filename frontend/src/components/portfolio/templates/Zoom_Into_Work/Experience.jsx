
import { Briefcase } from 'lucide-react';
import { SectionHeading } from './Shared';
import data from '../../../../data/dummy_data.json';

export default function Experience() {
  return (
    <section className="py-24 bg-zinc-950 px-4 relative z-10 overflow-hidden border-t border-zinc-900">
      <div className="max-w-4xl mx-auto relative z-10">
        <SectionHeading icon={Briefcase}>Experience</SectionHeading>
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
          {data.experience.map((exp, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={index} 
              whileHover={{ x: index % 2 === 0 ? 10 : -10, scale: 1.01 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active cursor-default"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-zinc-950 bg-cyan-500 text-zinc-950 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow flex-none z-10">
                <Briefcase size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-zinc-900/40 p-6 sm:p-8 rounded-2xl border border-zinc-800/80 group-hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                  <h3 className="font-bold text-xl text-white">{exp.role}</h3>
                  <span className="text-sm font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full mt-2 sm:mt-0 border border-cyan-500/20">{exp.period}</span>
                </div>
                <h4 className="text-lg text-zinc-300 mb-4">{exp.company}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
