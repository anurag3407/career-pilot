import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Contact() {
  const { portfolioData: data } = usePortfolio();
  const personal = data?.personal || {};
  const socials = data?.socials || [];

  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-indigo-100 shadow-sm text-indigo-500 font-medium text-sm tracking-wide mb-6">
          Get In Touch
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-700 tracking-tight mb-8">
          Let's Work Together
        </h2>
        <p className="text-lg text-slate-500 leading-relaxed mb-12 max-w-2xl mx-auto">
          Feel free to reach out for collaborations or just a friendly hello. 
          I am currently open to new opportunities!
        </p>

        <div className="bg-white/50 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/80 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-left">
            {personal.email && (
              <a href={`mailto:${personal.email}`} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/60 transition-colors group">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Email</h4>
                  <p className="text-slate-700 font-medium">{personal.email}</p>
                </div>
              </a>
            )}
            
            {personal.phone && (
              <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/60 transition-colors group">
                <div className="w-12 h-12 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Phone</h4>
                  <p className="text-slate-700 font-medium">{personal.phone}</p>
                </div>
              </div>
            )}

            {personal.location && (
              <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/60 transition-colors group">
                <div className="w-12 h-12 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Location</h4>
                  <p className="text-slate-700 font-medium">{personal.location}</p>
                </div>
              </div>
            )}
          </div>

          {socials && socials.length > 0 && (
            <div className="pt-8 border-t border-slate-200/50">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Connect with me</h4>
              <div className="flex flex-wrap justify-center gap-4">
                {socials.map((social, index) => (
                  <a 
                    key={index} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white border border-slate-100 shadow-sm rounded-full text-slate-600 font-medium hover:text-indigo-500 hover:shadow-md hover:-translate-y-1 transition-all flex items-center gap-2"
                  >
                    {social.platform} <ExternalLink size={16} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
