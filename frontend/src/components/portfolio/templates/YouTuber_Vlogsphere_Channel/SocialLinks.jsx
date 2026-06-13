import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const SocialLinks = ({ data }) => {
  const safeUrl = (url) => {
    if (!url || url === '#') return '#';
    const normalized = String(url);
    if (!/^https?:\/\//i.test(normalized)) {
      return '#';
    }
    return normalized;
  };

  const safeSocials = data.socials || {};
  const socials = [
    { icon: Youtube, label: 'YouTube', url: safeUrl(safeSocials.youtube) },
    { icon: Instagram, label: 'Instagram', url: safeUrl(safeSocials.instagram) },
    { icon: Linkedin, label: 'LinkedIn', url: safeUrl(safeSocials.linkedin) },
    { icon: Twitter, label: 'Twitter', url: safeUrl(safeSocials.twitter) },
    { icon: Facebook, label: 'Facebook', url: safeUrl(safeSocials.facebook) },
  ];

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Follow Me</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {socials.map((social, idx) => (
          <a
            key={idx}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#212121] hover:bg-[#303030] rounded-xl p-6 text-center transition"
          >
            <social.icon size={32} className="mx-auto text-white mb-2" />
            <p className="text-white font-semibold">{social.label}</p>
          </a>
        ))}
      </div>
    </motion.div>
  );
};

export default SocialLinks;
