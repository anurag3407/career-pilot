import React, { useState ,useEffect} from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import {AnimatePresence, motion, scale} from 'framer-motion'
export default function JetLandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [scrolled,setScrolled]=useState(false);
useEffect(()=>{
  const handleScroll=()=>{
    setScrolled(window.scrollY>20)
  }
  window.addEventListener('scroll',handleScroll)
  return()=>window.removeEventListener('scroll',handleScroll)
},[])
const MotionLink = motion(Link);
const menuVariants = {
  hidden: {opacity:0,
    scale:0.8 
  },
  show: {
    opacity:1,
    scale:1,
    duration:0.5,
    transition: {
      delayChildren:0.2,
      staggerChildren: 0.2,
    },
  },
};

const menuItemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-x-hidden font-inter bg-gray-50 py-24 md:py-32">
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
          <nav className={`fixed top-0 left-0 right-0 w-full z-50 px-2`}>
            <div className={`w-full max-w-7xl py-2 flex items-center justify-between transition-all duration-300 ${scrolled?'md:px-8':'md:px-20'}`}>
              <Link to="/" className="text-3xl text-[#B08D57] flex items-center gap-2  font-black">
                <img src="/speed.png" alt="logo" className="w-18 h-18 md:w-12 md:h-12 object-contain" />
                <span className="hidden md:block">CarrerPilot</span>
              </Link>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                {['Templates', 'Portfolio', 'Jobs', 'Resume'].map((item) => (
                  <Link 
                    key={item} 
                    to={`/${item.toLowerCase()}`}
                    className="text-gray-400 transition-all duration-300 hover:text-gray-700 font-medium cursor-pointer"
                  >
                    {item}
                  </Link>
                ))}
                <Link to="/login" className="text-blue-400 hover:text-gray-700 transition-colors font-medium cursor-pointer">Login</Link>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-gray-400 cursor-pointer mr-8 "
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={34} />}
              </button>
            </div>
          </nav> 

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div animate={{opacity:1,scale:1}} initial={{opacity:0,scale:0.8}} exit={{opacity:0,scale:0.8}} transition={{duration:0.5}} className="fixed top-20 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl z-50 md:hidden p-4 transition-all">
              <motion.div className="flex flex-col space-y-4 text-center" variants={menuVariants} initial="hidden" animate="show" exit="hidden">
                {['Templates', 'Portfolio', 'Jobs', 'Resume', 'Login'].map((item) => (
                  <MotionLink 
                    key={item} 
                    to={`/${item.toLowerCase()}`}
                    className="text-gray-900 font-medium py-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    variants={menuItemVariants}
                  >
                    {item}
                  </MotionLink>
                ))}
              </motion.div>
            </motion.div>
          )}
          </AnimatePresence>

          {/* Hero Content */}
          <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
            <span className="text-sm font-semibold text-gray-600 tracking-wider mb-4 uppercase">
              AI-Powered Career Acceleration
            </span>
            
            <div className="flex flex-col items-center">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal text-gray-500 leading-normal md:leading-none tracking-tighter">
                Dream Job.
              </h1>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal  md:leading-none tracking-tighter z-10" style={{ color: '#202A36', marginTop: '-12px' }}>
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
