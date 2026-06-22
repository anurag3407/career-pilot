import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function Skills({ skills = [] }) {
const groupedSkills = useMemo(() => {
return skills.reduce((acc, skill) => {
if (!acc[skill.category]) acc[skill.category] = [];
acc[skill.category].push(skill);
return acc;
}, {});
}, [skills]);

return ( <section
   id="skills"
   className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#faf8f5] via-[#f5f1ed] to-[#ede7de]"
 > <div className="max-w-6xl mx-auto"> <h2 className="text-5xl font-bold mb-16 text-[#3e3a37]">
Skills & Expertise </h2>

    <div className="space-y-12">
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div
          key={category}
          className="rounded-3xl p-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(240,235,230,0.4) 100%)",
            boxShadow: "0 12px 40px rgba(199,167,127,0.12)",
          }}
        >
          <h3 className="text-2xl font-semibold mb-8 text-[#8b6f47]">
            {category}
          </h3>

          <div className="space-y-6">
            {categorySkills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-[#3e3a37]">
                    {skill.name}
                  </span>
                  <span className="text-[#8b6f47]">
                    {skill.level}%
                  </span>
                </div>

                <div className="h-3 bg-[#e8ddd6] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg,#c7a77f,#b8956a)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


);
}
