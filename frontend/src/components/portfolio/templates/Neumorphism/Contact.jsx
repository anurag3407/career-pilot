import React from 'react';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Contact({ personal, socials }) {
  if (!personal) return null;

  return (
    <section className="py-20 px-6 bg-gray-100 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-700 tracking-wide">
          Get In Touch
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="p-8 rounded-3xl bg-gray-100 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff]">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Details</h3>
            <div className="space-y-6">
              {personal.email && (
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-gray-100 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff]">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">Email</p>
                    <a href={`mailto:${personal.email}`} className="text-gray-800 font-medium hover:text-blue-600 transition-colors">
                      {personal.email}
                    </a>
                  </div>
                </div>
              )}
              {personal.phone && (
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-gray-100 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff]">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">Phone</p>
                    <p className="text-gray-800 font-medium">{personal.phone}</p>
                  </div>
                </div>
              )}
              {personal.location && (
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-gray-100 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff]">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">Location</p>
                    <p className="text-gray-800 font-medium">{personal.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="p-8 rounded-3xl bg-gray-100 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff]">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Socials</h3>
            {socials && socials.length > 0 ? (
              <div className="grid grid-cols-2 gap-6">
                {socials.map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-100 shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff] hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 group"
                  >
                    <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                      {social.platform}
                    </span>
                    <ExternalLink className="w-4 h-4 mt-2 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No social links provided.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
