import { Github, Linkedin, Twitter, Mail, MapPin } from "lucide-react";
import data from "../../../../../data/dummy_data.json";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center bg-linear-to-br from-green-500/10 to-purple-500/10 rounded-3xl p-8 border border-white/10">

        <motion.img
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          src={data.personal.avatar}
          alt=""
          className="rounded-3xl w-full max-w-md mx-auto"
        />

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-4xl font-bold mb-6">About Me</h2>

          <p className="text-slate-300 leading-relaxed">
            {data.personal.bio}
          </p>

          <div className="flex items-center gap-2 mt-6 text-slate-400">
            <MapPin size={18} />
            {data.personal.location}
          </div>

          <div className="flex gap-4 mt-8">
            <a href={data.socials.github}>
              <Github />
            </a>

            <a href={data.socials.linkedin}>
              <Linkedin />
            </a>

            <a href={data.socials.twitter}>
              <Twitter />
            </a>

            <a href={`mailto:${data.socials.email}`}>
              <Mail />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}