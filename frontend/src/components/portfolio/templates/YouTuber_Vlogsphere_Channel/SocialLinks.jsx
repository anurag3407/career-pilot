import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const SocialLinks = ({ data }) => {
  const safeSocials = data.socials || {};

  const safeUrl = (url) => {
    if (!url) return '#';
    const normalized = String(url);
    if (!/^https?:\/\//i.test(normalized)) {
      return `https://${normalized}`;
    }
    return normalized;
  };

  const socials = [
    { icon: Youtube, label: 'YouTube', url: safeSocials.youtube || safeSocials.youtubeChannel, color: 'text-red-500 hover:text-red-400' },
    { icon: Instagram, label: 'Instagram', url: safeSocials.instagram, color: 'text-pink-500 hover:text-pink-400' },
    { icon: Linkedin, label: 'LinkedIn', url: safeSocials.linkedin, color: 'text-blue-500 hover:text-blue-400' },
    { icon: Twitter, label: 'Twitter', url: safeSocials.twitter, color: 'text-sky-500 hover:text-sky-400' },
    { icon: Facebook, label: 'Facebook', url: safeSocials.facebook, color: 'text-blue-600 hover:text-blue-500' },
  ];

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Connect With Me</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {socials.map((social, idx) => {
          const href = safeUrl(social.url);
          const isValid = href !== '#';

          if (isValid) {
            return (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-[#212121] hover:bg-[#303030] transition ${social.color}`}
              >
                <social.icon size={32} />
                <span className="text-gray-300">{social.label}</span>
              </a>
            );
          }

          return (
            <div
              key={idx}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-[#212121] opacity-70 cursor-default ${social.color}`}
            >
              <social.icon size={32} />
              <span className="text-gray-300">{social.label}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SocialLinks;
