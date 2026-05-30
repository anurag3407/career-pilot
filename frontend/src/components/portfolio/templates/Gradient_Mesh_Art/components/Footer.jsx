import React from "react";
import data from "../../../../../data/dummy_data.json";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative px-6 md:px-20 py-16 border-t border-white/10">

      {/* top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-400/40 to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">

        {/* LEFT */}
        <div>
          <h3 className="text-xl font-bold">
            {data.personal.name}
          </h3>

          <p className="text-gray-400 mt-2 max-w-md">
            Building modern digital experiences with clean UI, motion, and
            performance-first design.
          </p>
        </div>

        {/* SOCIALS */}
        <div className="flex gap-4">
          {[
            { icon: Github, link: data.socials.github },
            { icon: Linkedin, link: data.socials.linkedin },
            { icon: Twitter, link: data.socials.twitter },
          ].map((s, i) => (
            <a
              key={i}
              href={s.link}
              className="
                p-4 rounded-2xl 
                bg-white/5 
                border border-white/10 
                hover:bg-white/10 
                hover:scale-110 
                transition
              " target="_blank" rel="noopener noreferrer"
            >
              <s.icon />
            </a>
          ))}
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} {data.personal.name}. All rights reserved.
      </div>
    </footer>
  );
}