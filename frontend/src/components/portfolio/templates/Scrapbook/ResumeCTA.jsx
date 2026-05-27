import React from 'react';
import { Download, FileText, ArrowRight } from 'lucide-react';

const ResumeCTA = () => {
  return (
    <section className="py-20 px-6 sm:px-12 lg:px-24 bg-[#EBE7DF] relative overflow-hidden flex items-center justify-center font-sans selection:bg-[#FFD166] selection:text-[#1A1A1A]">
      
      {/* Decorative Tape Element Top Center */}
      <div 
        className="absolute top-10 left-1/2 -translate-x-1/2 w-40 h-10 bg-[#D4CBB3]/60 backdrop-blur-sm -rotate-2 z-10 mix-blend-multiply opacity-90 border-l-2 border-r-2 border-[#C5BB9D]/30" 
        style={{ clipPath: 'polygon(3% 0%, 97% 2%, 99% 95%, 1% 98%)' }} 
      />

      {/* Main Container - Paper Cut-out */}
      <div className="relative max-w-4xl w-full bg-[#FDFBF7] border-4 border-[#1A1A1A] p-8 md:p-14 shadow-[12px_12px_0px_#1A1A1A] rounded-sm transform rotate-1 transition-transform hover:rotate-0 duration-300">
        
        {/* Additional Tape Corners */}
        <div className="absolute -top-5 -right-5 w-24 h-8 bg-[#D4CBB3]/70 -rotate-12 mix-blend-multiply" />
        <div className="absolute -bottom-5 -left-5 w-28 h-9 bg-[#D4CBB3]/70 rotate-6 mix-blend-multiply" />
        
        {/* Content Wrapper */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 relative z-10">
          
          {/* Text Section */}
          <div className="flex-1 space-y-5 text-center md:text-left">
            <h2 
              className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] tracking-tighter uppercase leading-none"
              style={{ fontFamily: '"Courier New", Courier, monospace' }}
            >
              Grab My <span className="relative inline-block">
                Resume
                <span className="absolute bottom-0 left-0 w-full h-3 bg-[#FFD166] -z-10 -rotate-1 transform translate-y-1"></span>
              </span>
            </h2>
            <p className="text-lg text-[#4A4843] font-medium max-w-lg mx-auto md:mx-0 leading-relaxed">
              Want the full story? Download my printable resume to see all my experiences, skills, and education laid out on paper. Perfect for your corkboard!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-4 w-full md:w-auto">
            {/* Primary Action */}
            <a 
              href="#download-resume"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#FF6B6B] text-white font-bold text-lg border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] hover:shadow-[0px_0px_0px_#1A1A1A] hover:translate-x-[8px] hover:translate-y-[8px] transition-all duration-200 ease-out whitespace-nowrap"
            >
              <Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" strokeWidth={2.5} />
              <span>Download PDF</span>
            </a>
            
            {/* Secondary Action */}
            <a 
              href="#view-resume"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#FDFBF7] text-[#1A1A1A] font-bold text-lg border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] hover:shadow-[0px_0px_0px_#1A1A1A] hover:translate-x-[8px] hover:translate-y-[8px] transition-all duration-200 ease-out whitespace-nowrap"
            >
              <FileText className="w-6 h-6 group-hover:-rotate-12 transition-transform duration-300" strokeWidth={2.5} />
              <span>View Online</span>
              <ArrowRight className="w-5 h-5 ml-1 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" strokeWidth={3} />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ResumeCTA;
