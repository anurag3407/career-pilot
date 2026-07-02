
import { Terminal, Code2 } from 'lucide-react';
import { SectionHeading } from './Shared';
import data from '../../../../data/dummy_data.json';

export default function Skills() {
  return (
    <section className="py-24 bg-zinc-950 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionHeading icon={Terminal} className="flex items-center justify-center gap-4 mb-6">
            Skills
          </SectionHeading>
          <p className="text-zinc-400 max-w-2xl mx-auto">Core technologies and tools I use to bring ideas to life.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.skills.map((skill, index) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              key={index}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                rotateZ: index % 2 === 0 ? 2 : -2,
                boxShadow: "0px 10px 30px rgba(6, 182, 212, 0.2)"
              }}
              className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:border-cyan-500/40 transition-all cursor-crosshair shadow-md"
            >
              <div className="p-3 bg-zinc-800/80 rounded-xl text-cyan-400 shrink-0">
                <Code2 size={20} />
              </div>
              <div>
                <h4 className="text-white font-semibold line-clamp-1">{skill.name}</h4>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">{skill.level}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
