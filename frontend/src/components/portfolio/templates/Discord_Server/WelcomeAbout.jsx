import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Message, Embed, Divider } from './MessageComponents';

export function WelcomeContent({ data }) {
  const p = data.personal;
  const st = data.stats;
  return (
    <div className="py-4 space-y-1">
      {/* Welcome banner */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-[#5865F2] to-[#EB459E] rounded-lg p-6 sm:p-8 text-center"
        >
          <img src={p.avatar} alt={p.name || "Profile Avatar"} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 border-4 border-white/20 object-cover" />
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">{p.name}</h1>
          <p className="text-white/80 text-base sm:text-lg mb-4">{p.title}</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-white/90 text-sm">
            <div className="flex items-center gap-1"><MapPin className="w-4 h-4" />{p.location}</div>
            <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />{st.yearsExperience}+ Years</div>
            <div className="flex items-center gap-1"><Sparkles className="w-4 h-4" />{st.projectsCompleted} Projects</div>
          </div>
        </motion.div>
      </div>

      <Divider text="Welcome to the server" />

      <Message
        avatar="https://cdn.discordapp.com/embed/avatars/0.png"
        name="PortfolioBot"
        timestamp="Today at 12:00 AM"
        isBot
        index={0}
      >
        <div className="space-y-2">
          <p>👋 Welcome to <span className="font-semibold text-white">{p.name}'s Portfolio Server</span>!</p>
          <p>Feel free to explore the channels on the left to learn more:</p>
          <div className="bg-[#2B2D31] rounded-lg p-3 mt-2 text-sm space-y-1 border-l-4 border-[#5865F2]">
            <p><span className="text-[#00AFF4]">#about-me</span> — Learn about {p.name.split(' ')[0]}</p>
            <p><span className="text-[#00AFF4]">#skills</span> — Tech stack & expertise</p>
            <p><span className="text-[#00AFF4]">#projects</span> — Featured work & builds</p>
            <p><span className="text-[#00AFF4]">#experience</span> — Career timeline</p>
            <p><span className="text-[#00AFF4]">#testimonials</span> — What others say</p>
            <p><span className="text-[#00AFF4]">#contact</span> — Get in touch</p>
          </div>
        </div>
      </Message>

      <Message
        avatar="https://cdn.discordapp.com/embed/avatars/0.png"
        name="PortfolioBot"
        timestamp="Today at 12:01 AM"
        isBot
        index={1}
      >
        <Embed
          color="#23A559"
          title="📊 Quick Stats"
          fields={[
            { name: '🗓 Experience', value: `${st.yearsExperience}+ years` },
            { name: '🚀 Projects', value: `${st.projectsCompleted} completed` },
            { name: '😊 Clients', value: `${st.happyClients} happy` },
          ]}
          footer="Last updated — Today"
        />
      </Message>
    </div>
  );
}

export function AboutContent({ data }) {
  const p = data.personal;
  return (
    <div className="py-4 space-y-1">
      <Divider text="About Me" />
      <Message avatar={p.avatar} name={p.name} timestamp="Today at 12:05 AM" index={0}>
        <p className="mb-3">{p.bio}</p>
      </Message>
      <Message avatar={p.avatar} name={p.name} timestamp="Today at 12:06 AM" index={1}>
        <Embed
          color="#EB459E"
          title="✨ Profile Card"
          description={p.tagline || 'Building the future, one line of code at a time.'}
          fields={[
            { name: '📍 Location', value: p.location },
            { name: '💼 Role', value: p.title },
            { name: '📧 Email', value: data.socials.email },
          ]}
          image={p.avatar}
        />
      </Message>
      <Message
        avatar="https://cdn.discordapp.com/embed/avatars/0.png"
        name="PortfolioBot"
        timestamp="Today at 12:07 AM"
        isBot
        index={2}
      >
        <p>Check out <span className="text-[#00AFF4]">#skills</span> to see {p.name.split(' ')[0]}'s tech stack! 🛠️</p>
      </Message>
    </div>
  );
}
