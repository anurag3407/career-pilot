
import React from 'react';

import { motion } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 

  Sparkles
} from 'lucide-react';


const Contact = ({data}) => {
  const { socials, personal } = data;
  
  return (
    <footer id="contact" className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-amber-50 py-16 md:py-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      {/* Glow effects */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-amber-500 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-500 rounded-full blur-3xl opacity-20" />
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <Sparkles className="w-6 h-6 text-amber-400" />
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif tracking-tight">
            Visit the Gallery
          </h2>
          
          <p className="text-xl md:text-2xl mb-10 font-serif text-amber-100">
            Ready to collaborate on your next masterpiece?
          </p>
          
          <div className="flex justify-center gap-6 md:gap-8 mb-12">
            {[
              { icon: Github, url: socials?.github, label: 'GitHub' },
              { icon: Linkedin, url: socials?.linkedin, label: 'LinkedIn' },
              { icon: Twitter, url: socials?.twitter, label: 'Twitter' },
              { icon: Mail, url: socials?.email ? `mailto:${socials.email}` : '#', label: 'Email' }
            ].map((social, index) => social.url && social.url !== '#' && (
              <motion.a
                key={social.label}
                href={social.url}
                target={social.label !== 'Email' ? '_blank' : undefined}
                rel={social.label !== 'Email' ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.3, y: -8 }}
                className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-amber-900 hover:from-amber-300 hover:to-amber-500 transition-all shadow-xl hover:shadow-2xl border-2 border-amber-300"
                aria-label={social.label}
              >
                <social.icon className="w-7 h-7 md:w-8 md:h-8" />
              </motion.a>
            ))}
          </div>
          
          {personal?.email && (
            <motion.a 
              href={`mailto:${personal.email}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="inline-block px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl hover:shadow-2xl font-semibold text-lg md:text-xl border-2 border-amber-300"
            >
              Get in Touch
            </motion.a>
          )}
        </motion.div>
        
        <div className="mt-16 pt-12 border-t border-amber-800 text-sm text-amber-300">
          <p>&copy; {new Date().getFullYear()} {personal.name}. All rights reserved.</p>
          <p className="mt-3 font-serif italic text-amber-400">Museum Gallery Portfolio Template • Crafted with ❤️</p>
        </div>
      </div>
    </footer>
  );
};


export default Contact;