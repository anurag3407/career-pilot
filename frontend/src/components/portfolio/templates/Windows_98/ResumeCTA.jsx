import React, { useState } from 'react';
import { Download, Globe, Mail, Phone } from 'lucide-react';

/**
 * ResumeCTA Component - Windows 98 Theme
 * 
 * A retro-styled call-to-action section for downloading resumes and portfolio links.
 * Features authentic Windows 98 window chrome, beveled buttons, and responsive layout.
 * 
 * @component
 * @example
 * <ResumeCTA 
 *   resumeUrl="/resume.pdf"
 *   portfolioUrl="https://portfolio.com"
 *   email="john@example.com"
 *   phone="+1 (555) 123-4567"
 * />
 */
export default function ResumeCTA({
  resumeUrl = '#',
  portfolioUrl = '#',
  email = 'contact@example.com',
  phone = '+1 (555) 123-4567',
  fullName = 'John Doe',
}) {
  const [hovered, setHovered] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    // Simulate download delay for UX feedback
    setTimeout(() => setDownloading(false), 1200);
    // In real implementation, trigger actual download
    if (resumeUrl !== '#') {
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = `${fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      link.click();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-teal-600 via-teal-500 to-blue-400 p-4 sm:p-6 flex items-center justify-center font-sans">
      {/* Outer Window Frame */}
      <div className="w-full max-w-2xl shadow-xl" style={{ 
        backgroundColor: '#c0c0c0',
        border: '2px solid',
        borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
      }}>
        
        {/* Window Title Bar */}
        <div className="flex items-center justify-between" style={{
          backgroundColor: '#000080',
          color: '#ffffff',
          padding: '2px 2px',
          gap: '2px'
        }}>
          <div className="flex items-center gap-2 flex-1 px-1">
            <div className="w-4 h-4 bg-white" style={{
              background: 'linear-gradient(135deg, #c0c0c0 0%, #dfdfdf 50%, #ffffff 100%)'
            }} />
            <span className="text-xs font-bold tracking-wide">Resume.exe</span>
          </div>
          
          {/* Window Control Buttons */}
          <div className="flex gap-1">
            <button className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white hover:bg-white hover:text-black transition-colors"
              style={{ border: '1px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf' }}>
              _
            </button>
            <button className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white hover:bg-white hover:text-black transition-colors"
              style={{ border: '1px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf' }}>
              □
            </button>
            <button className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white hover:bg-red-600 transition-colors"
              style={{ border: '1px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf' }}>
              ×
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-3 bg-gray-200" style={{ backgroundColor: '#c0c0c0' }}>
          
          {/* Header Section */}
          <div className="mb-4 pb-4 border-b-2" style={{
            borderColor: '#808080 #dfdfdf #dfdfdf #808080',
          }}>
            <h2 className="text-lg font-bold mb-1" style={{ color: '#000080', letterSpacing: '0.5px' }}>
              Get Started Now
            </h2>
            <p className="text-xs" style={{ color: '#000080', lineHeight: '1.6' }}>
              Download my resume or explore my work. I'm ready for your next opportunity.
            </p>
          </div>

          {/* CTA Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            
            {/* Resume Download Card */}
            <div 
              className="p-3 transition-all cursor-pointer"
              style={{
                backgroundColor: '#c0c0c0',
                border: '2px solid',
                borderColor: hovered === 'resume' ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
              }}
              onMouseEnter={() => setHovered('resume')}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 flex items-center justify-center" style={{
                    backgroundColor: '#c0c0c0',
                    border: '1px solid',
                    borderColor: hovered === 'resume' ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
                  }}>
                    <Download size={16} style={{ color: '#000080' }} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold mb-1" style={{ color: '#000080' }}>
                    DOWNLOAD RESUME
                  </h3>
                  <p className="text-xs leading-tight mb-2" style={{ color: '#000080' }}>
                    Get my latest resume in PDF format. Updated 2024.
                  </p>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="text-xs font-bold px-3 py-1 transition-all w-full sm:w-auto"
                    style={{
                      backgroundColor: '#c0c0c0',
                      color: '#000000',
                      border: '2px solid',
                      borderColor: downloading ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
                      cursor: downloading ? 'wait' : 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                    onMouseDown={(e) => !downloading && (e.currentTarget.style.borderColor = '#808080 #dfdfdf #dfdfdf #808080')}
                    onMouseUp={(e) => !downloading && (e.currentTarget.style.borderColor = '#dfdfdf #808080 #808080 #dfdfdf')}
                  >
                    {downloading ? '⏳ Saving...' : '↓ Download'}
                  </button>
                </div>
              </div>
            </div>

            {/* Portfolio Card */}
            <div 
              className="p-3 transition-all cursor-pointer"
              style={{
                backgroundColor: '#c0c0c0',
                border: '2px solid',
                borderColor: hovered === 'portfolio' ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
              }}
              onMouseEnter={() => setHovered('portfolio')}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 flex items-center justify-center" style={{
                    backgroundColor: '#c0c0c0',
                    border: '1px solid',
                    borderColor: hovered === 'portfolio' ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
                  }}>
                    <Globe size={16} style={{ color: '#000080' }} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold mb-1" style={{ color: '#000080' }}>
                    VIEW PORTFOLIO
                  </h3>
                  <p className="text-xs leading-tight mb-2" style={{ color: '#000080' }}>
                    See my projects, work samples, and code contributions.
                  </p>
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold px-3 py-1 transition-all inline-block"
                    style={{
                      backgroundColor: '#c0c0c0',
                      color: '#000000',
                      border: '2px solid',
                      borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#808080 #dfdfdf #dfdfdf #808080';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#dfdfdf #808080 #808080 #dfdfdf';
                    }}
                  >
                    → Visit →
                  </a>
                </div>
              </div>
            </div>
            
          </div>

          {/* Contact Section */}
          <div 
            className="p-3"
            style={{
              backgroundColor: '#c0c0c0',
              border: '1px solid',
              borderColor: '#808080 #dfdfdf #dfdfdf #808080',
            }}
          >
            <h3 className="text-xs font-bold mb-2" style={{ color: '#000080', textTransform: 'uppercase' }}>
              Get in Touch
            </h3>
            <div className="space-y-2">
              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail size={14} style={{ color: '#000080', flexShrink: 0 }} />
                <a 
                  href={`mailto:${email}`}
                  className="text-xs hover:underline"
                  style={{ color: '#000080', textDecoration: 'none' }}
                >
                  {email}
                </a>
              </div>
              
              {/* Phone */}
              <div className="flex items-center gap-2">
                <Phone size={14} style={{ color: '#000080', flexShrink: 0 }} />
                <a 
                  href={`tel:${phone.replace(/\D/g, '')}`}
                  className="text-xs hover:underline"
                  style={{ color: '#000080', textDecoration: 'none' }}
                >
                  {phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div 
          className="h-5 flex items-center px-1 text-xs"
          style={{
            backgroundColor: '#c0c0c0',
            borderTop: '1px solid',
            borderTopColor: '#dfdfdf',
            color: '#000080',
          }}
        >
          <span>Ready</span>
          <div className="ml-auto text-xs text-right">
            <span>Windows 98 Portfolio Builder</span>
          </div>
        </div>
      </div>

      {/* Desktop Icons - Optional decorative element */}
      <style>{`
        @font-feature-settings: "kern" 1;
        * {
          font-family: 'MS Sans Serif', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
    </div>
  );
}