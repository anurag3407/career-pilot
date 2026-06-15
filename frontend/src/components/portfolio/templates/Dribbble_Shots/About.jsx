import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, MapPin } from "lucide-react";
import SectionLabel from "./SectionLabel";
import data from "../../../../data/dummy_data.json";

export default function About() {
  const { personal, socials } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" ref={ref} className="py-28 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>About</SectionLabel>

        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-16 items-center mt-10">
          {/* Image side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative h-[420px]">
              {/* Main image */}
              <div className="absolute top-0 left-0 w-[72%] h-[85%] rounded-[2rem] overflow-hidden shadow-xl border border-[#ea4c89]/10">
                <img
                  src={personal?.avatar}
                  alt="About"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#ea4c89]/10 to-transparent" />
              </div>

              {/* Floating accent */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 right-0 w-[52%] h-[50%] rounded-[2rem] bg-gradient-to-br from-[#ea4c89]/15 to-[#ffb3d1]/20 border border-[#ea4c89]/20 shadow-lg flex items-center justify-center backdrop-blur-sm"
              >
                <div className="text-center">
                  <div className="text-4xl font-black text-[#ea4c89]">{data.stats?.yearsExperience || 8}+</div>
                  <div className="text-[10px] text-[#ea4c89]/70 tracking-widest uppercase mt-1">Years of craft</div>
                </div>
              </motion.div>

              {/* Ping dot */}
              <motion.div
                animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute top-[81%] left-[26%] w-3 h-3 rounded-full border-2 border-[#ea4c89] bg-[#ea4c89]/30"
              />
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] leading-tight mb-6">
              Crafting pixels <br />
              <span className="text-[#ea4c89]">with purpose</span>
            </h2>
            <p className="text-[#777] leading-relaxed mb-8 text-sm md:text-base">{personal?.bio}</p>

            <div className="space-y-2 mb-8">
              {[
                ["Name",     personal?.name],
                ["Based in", personal?.location],
                ["Role",     personal?.title],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-6 py-3 border-b border-[#f0f0f0]">
                  <span className="text-[#ccc] text-[10px] uppercase tracking-widest w-16 pt-0.5">{k}</span>
                  <span className="text-[#444] text-sm font-medium">{v}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {[
                { icon: Github,   href: socials?.github },
                { icon: Linkedin, href: socials?.linkedin },
                { icon: Twitter,  href: socials?.twitter },
                { icon: Mail,     href: `mailto:${socials?.email}` },
              ].map(({ icon: Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, scale: 1.1 }}
                  className="w-10 h-10 rounded-xl bg-white border border-[#ebebeb] shadow-sm flex items-center justify-center text-[#bbb] hover:text-[#ea4c89] hover:border-[#ea4c89]/30 transition-colors"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}