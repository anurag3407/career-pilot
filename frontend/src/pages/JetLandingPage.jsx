import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JetLandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <section className="relative h-screen overflow-hidden font-inter bg-gray-50">
      {/* Background Video */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4" type="video/mp4" />
        </video>


        {/* Content wrapper */}
        <div className="relative h-full flex flex-col z-10">
          {/* Navigation Bar */}
          <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-white/30 backdrop-blur-md border-b border-white/20 shadow-sm">
            <div className="w-full max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
              <Link to="/" className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                <img src="/speed.png" alt="logo" className="w-8 h-8 object-contain" />
                careerpilot
              </Link>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                {['Templates', 'Portfolio', 'Jobs', 'Resume'].map((item) => (
                  <Link 
                    key={item} 
                    to={`/${item.toLowerCase()}`}
                    className="text-gray-900 hover:text-gray-700 transition-colors font-medium cursor-pointer"
                  >
                    {item}
                  </Link>
                ))}
                <Link to="/login" className="text-gray-900 hover:text-gray-700 transition-colors font-medium cursor-pointer">Login</Link>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-gray-900 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="fixed top-20 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl z-50 md:hidden p-4 transition-all">
              <div className="flex flex-col space-y-4 text-center">
                {['Templates', 'Portfolio', 'Jobs', 'Resume', 'Login'].map((item) => (
                  <Link 
                    key={item} 
                    to={`/${item.toLowerCase()}`}
                    className="text-gray-900 font-medium py-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Hero Content */}
          <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-80 text-center">
            <span className="text-sm font-semibold text-gray-600 tracking-wider mb-4 uppercase">
              AI-Powered Career Acceleration
            </span>
            
            <div className="flex flex-col items-center">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal text-gray-500 leading-none tracking-tighter">
                Dream Job.
              </h1>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal leading-none tracking-tighter z-10" style={{ color: '#202A36', marginTop: '-12px' }}>
                On Autopilot.
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mt-6">
              The intelligent platform that enhances your resume, matches you with perfect opportunities, and lands your dream job.
            </p>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.location.href='/jobs'}
                className="px-6 py-3 rounded-full bg-gray-300 text-gray-800 font-medium hover:bg-gray-400 transition-colors">
                Explore Jobs
              </button>
              <button 
                onClick={() => window.location.href='/register'}
                className="px-6 py-3 rounded-full text-white font-medium transition-colors" 
                style={{ backgroundColor: '#202A36' }} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a2229'} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#202A36'}
              >
                Get Started Free
              </button>
            </div>
          </main>
        </div>
    </section>
  );
}
