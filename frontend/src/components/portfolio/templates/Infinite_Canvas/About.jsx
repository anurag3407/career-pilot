import React from "react";
import { motion } from "framer-motion";
import { User, MapPin } from "lucide-react";
import CanvasCard from "./CanvasCard";

export default function About({ data }) {
  const { personal } = data;

  return (
    <div className="absolute top-[850px] left-[5%] md:left-[8%] w-[90%] md:w-[500px]">
      <CanvasCard delay={0.2} rotate={-2}>
        <div className="flex items-center gap-3 mb-6">
          <User className="text-cyan-400" size={22} />
          <h2 className="text-2xl font-bold">About Me</h2>
        </div>

        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <img
              src={personal.avatar}
              alt={personal.name}
              className="w-20 h-20 rounded-2xl object-cover border border-white/10"
            />

            <div>
              <h3 className="font-bold text-lg">{personal.name}</h3>

              <p className="text-gray-400 text-sm">
                {personal.title}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                <MapPin size={14} />
                <span>{personal.location}</span>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-gray-300 leading-7"
          >
            {personal.bio}
          </motion.p>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Focus
              </p>
              <p className="font-semibold mt-2">
                Product Engineering
              </p>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Passion
              </p>
              <p className="font-semibold mt-2">
                User Experience
              </p>
            </div>
          </div>
        </div>
      </CanvasCard>
    </div>
  );
}