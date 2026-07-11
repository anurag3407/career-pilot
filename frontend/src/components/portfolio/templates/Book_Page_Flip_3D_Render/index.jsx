import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useResolvedData, 
  useBookSize, 
  useWheelFlip, 
  GoogleFontsLink 
} from './shared';
import { 
  Page1_FrontCover, 
  Page2_InsideCover, 
  Page3_TitlePage, 
  Page4_AboutIntro, 
  Page5_AboutStats, 
  Page6_SkillsIntro, 
  Page7_SkillsDetails, 
  Page8_ExperienceIntro, 
  Page9_ExperienceDetails, 
  Page10_ProjectsIntro, 
  Page11_ProjectsDetails, 
  Page12_EducationAchievements, 
  Page13_ContactEpilogue, 
  Page14_BackCover 
} from './BookPages';
import { Compass, BookOpen, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Book_Page_Flip_3D_Render({ data: localData, portfolioData }) {
  const bookRef = useRef(null);
  const data = useResolvedData(portfolioData, localData);
  const { width, height } = useBookSize();
  
  // Book states: 'closed' | 'opening' | 'open'
  const [bookState, setBookState] = useState('closed');
  const [currentPage, setCurrentPage] = useState(0);

  // Wheel scroll page flipping
  useWheelFlip(bookRef);

  // Sync current page state from react-pageflip
  const onPageChange = (e) => {
    setCurrentPage(e.data);
  };

  const handleOpenBook = () => {
    setBookState('opening');
    setTimeout(() => {
      setBookState('open');
    }, 1800); // Duration matches cover rotation transition
  };

  const handleCloseBook = () => {
    setBookState('closed');
    setCurrentPage(0);
  };

  const turnTo = (pageNo) => {
    if (bookState !== 'open') return;
    const pageFlip = bookRef.current?.pageFlip?.();
    if (pageFlip) {
      pageFlip.turnToPage(pageNo);
    }
  };

  const nextFlip = () => {
    const pageFlip = bookRef.current?.pageFlip?.();
    if (pageFlip) pageFlip.flipNext();
  };

  const prevFlip = () => {
    const pageFlip = bookRef.current?.pageFlip?.();
    if (pageFlip) pageFlip.flipPrev();
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#1c0f0a] font-serif select-none flex flex-col justify-between" style={{
      backgroundImage: `radial-gradient(circle at center, #351b11 0%, #150905 100%),
        repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 4px)`
    }}>
      <GoogleFontsLink />

      {/* Ambient glowing candlelight/library lamp in the corner */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_80%_20%,_rgba(253,186,116,0.12),_transparent_75%)] pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_20%_80%,_rgba(139,90,43,0.08),_transparent_70%)] pointer-events-none z-0 mix-blend-screen" />

      {/* Decorative Quill / Letter Outline on desk (aesthetic background) */}
      <div className="absolute right-12 bottom-12 opacity-5 pointer-events-none z-0 select-none">
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#e5c158" strokeWidth="0.5">
          <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
          <line x1="16" y1="8" x2="2" y2="22" />
          <line x1="17.5" y1="15" x2="9" y2="15" />
        </svg>
      </div>

      {/* HEADER BAR */}
      <header className="relative z-30 w-full px-6 py-4 flex items-center justify-between border-b border-[#e5c158]/10 bg-black/10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Compass className="text-[#c5a059] w-5 h-5 animate-spin-slow" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#c5a059] font-semibold">
            {data.personal.name} // Memoir
          </span>
        </div>
        
        {bookState === 'open' && (
          <button type="button" 
            onClick={handleCloseBook}
            className="flex items-center gap-2 border border-[#c5a059]/40 bg-black/30 hover:bg-[#c5a059]/10 text-[#c5a059] px-3.5 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-widest transition-all duration-300 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Close Book
          </button>
        )}
      </header>

      {/* MAIN CONTAINER FOR THE STAGES */}
      <main className="flex-1 flex items-center justify-center relative px-4 py-8 z-10">
        
        {/* ========================================================= */}
        {/* STAGE 1 & 2: CLOSED BOOK & 3D OPENING COVER HINGE */}
        {/* ========================================================= */}
        {bookState !== 'open' && (
          <div className="w-full flex flex-col items-center justify-center" style={{ perspective: '1600px' }}>
            
            {/* Wooden desk table shadow backdrop under the book */}
            <div className="absolute w-[440px] h-[580px] bg-black/55 blur-3xl pointer-events-none rounded-[80px]" style={{
              transform: bookState === 'closed' 
                ? 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(-40px) scale(1.1)'
                : 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(-80px) scale(1.3)'
            }} />

            {/* 3D Book wrapper */}
            <motion.div 
              onClick={bookState === 'closed' ? handleOpenBook : undefined}
              className="relative cursor-pointer select-none"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                transformStyle: 'preserve-3d'
              }}
              animate={bookState === 'closed' ? {
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 0.95,
                y: 0
              } : {
                // Stage 2: Camera pans straight and centers
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                y: 0
              }}
              transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
            >
              {/* Spine edge texture (book binder side) */}
              <div 
                className="absolute left-[-15px] top-[2px] bottom-[2px] w-[18px] bg-gradient-to-r from-[#170c08] via-[#24130d] to-[#170c08] rounded-l-[4px] border-r border-[#c5a059]/25 shadow-md"
                style={{
                  transform: 'rotateY(-90deg) translateZ(10px)',
                  transformOrigin: 'right center'
                }}
              />

              {/* Stacked Page Thickness (Simulating paper edges under the cover) */}
              <div className="absolute right-[2px] top-[6px] bottom-[6px] w-[10px] bg-[#ebdcb9] border-r border-t border-b border-[#c5a059]/20 rounded-r-sm shadow-inner" style={{
                backgroundImage: 'repeating-linear-gradient(to bottom, #d4af37/10 0px, #d4af37/10 1px, transparent 1px, transparent 3px)',
                transform: 'translateZ(-14px)'
              }} />

              {/* Inside pages container (visible while cover is opening) */}
              <div 
                className="absolute inset-0 bg-[#faf6ee] shadow-inner flex flex-col justify-between rounded-r-sm"
                style={{ transform: 'translateZ(-15px)' }}
              >
                {/* Simulated inner Title Page */}
                <div className="w-full h-full p-8 border-2 border-double border-[#8b5a2b]/20 m-2 flex flex-col items-center justify-center bg-[#FAF7EF] rounded-sm text-center">
                  <div className="text-[#8b5a2b] font-mono text-[9px] uppercase tracking-widest mb-2">CHAPTER I</div>
                  <h3 className="text-xl text-[#2b1810] font-serif font-black">{data.personal.name}</h3>
                  <div className="w-8 h-px bg-[#8b5a2b]/30 my-3" />
                  <p className="text-xs text-[#5d4037] font-serif italic max-w-64">"{data.personal.title}"</p>
                </div>
              </div>

              {/* Back Cover (Sits flat at the bottom of 3D stack) */}
              <div 
                className="absolute inset-0 bg-[#24130d] rounded-sm"
                style={{
                  transform: 'translateZ(-20px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
                }}
              />

              {/* FRONT COVER WITH 3D HINGE ROTATION */}
              <motion.div 
                className="absolute inset-0 select-none origin-left"
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden'
                }}
                animate={bookState === 'opening' ? {
                  rotateY: -180
                } : {
                  rotateY: 0
                }}
                transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
              >
                {/* Front Face: Leather Cover */}
                <div className="absolute inset-0 z-10 rounded-sm">
                  <Page1_FrontCover personal={data.personal} />
                </div>

                {/* Back Face: Inside cover (cream endpaper shown when flipped open) */}
                <div 
                  className="absolute inset-0 rounded-sm"
                  style={{
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <Page2_InsideCover personal={data.personal} />
                </div>
              </motion.div>

            </motion.div>

            {/* Click Invitation overlay */}
            <AnimatePresence>
              {bookState === 'closed' && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 1 }}
                  className="mt-8 text-center pointer-events-none select-none z-20"
                >
                  <span className="inline-flex items-center gap-2.5 bg-[#ebdcb9]/15 border border-[#c5a059]/40 px-6 py-2.5 backdrop-blur-md text-[#c5a059] font-mono text-[11px] uppercase tracking-[0.25em] rounded-sm cursor-pointer shadow-lg animate-pulse">
                    <BookOpen className="w-4 h-4" />
                    Open Biography
                  </span>
                  <p className="text-[#c5a059]/55 font-serif text-xs italic mt-2">
                    Click the cover to turn the page
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 3 & 4: PAGE-FLIP ENGINE (HTMLFlipBook active) */}
        {/* ========================================================= */}
        {bookState === 'open' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center justify-center"
          >
            {/* Realistic desk shadow below the active double-page book layout */}
            <div className="absolute w-[105%] h-[105%] bg-black/60 blur-3xl rounded-[100px] pointer-events-none z-0" />

            {/* Spine Gilt Border Highlights (Book boundary borders when open) */}
            <div className="absolute inset-y-[-8px] inset-x-[-12px] bg-transparent border-[6px] border-[#24130d] rounded-sm pointer-events-none z-30 shadow-[0_15px_45px_rgba(0,0,0,0.8)]" />
            <div className="absolute inset-y-[-6px] inset-x-[-10px] bg-transparent border border-[#c5a059]/35 rounded-sm pointer-events-none z-30" />

            <HTMLFlipBook
              ref={bookRef}
              width={width}
              height={height}
              maxShadowOpacity={0.6}
              drawShadow={true}
              showCover={true}
              size="fixed"
              flippingTime={700}
              usePortrait={false}
              startZIndex={0}
              autoSize={false}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={true}
              mobileScrollSupport={true}
              startPage={1} // Start directly on first double spread (Inside Cover & Title Page)
              onFlip={onPageChange}
              className="z-10 shadow-2xl"
            >
              {/* Child components represent pages 1 to 14 */}
              <Page1_FrontCover personal={data.personal} />
              <Page2_InsideCover personal={data.personal} />
              <Page3_TitlePage personal={data.personal} />
              <Page4_AboutIntro personal={data.personal} />
              <Page5_AboutStats personal={data.personal} />
              <Page6_SkillsIntro skills={data.skills} />
              <Page7_SkillsDetails skills={data.skills} />
              <Page8_ExperienceIntro experience={data.experience} />
              <Page9_ExperienceDetails experience={data.experience} />
              <Page10_ProjectsIntro projects={data.projects} />
              <Page11_ProjectsDetails projects={data.projects} />
              <Page12_EducationAchievements education={data.education} testimonials={data.testimonials} />
              <Page13_ContactEpilogue personal={data.personal} socials={data.socials} />
              <Page14_BackCover personal={data.personal} />
            </HTMLFlipBook>

            {/* Quick action overlay page-turn buttons */}
            {currentPage > 0 && (
              <button type="button" 
                onClick={prevFlip}
                className="absolute left-[-60px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-[#c5a059]/40 bg-black/40 hover:bg-[#c5a059]/20 text-[#c5a059] flex items-center justify-center transition-all duration-300 active:scale-90 z-40"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {currentPage < 13 && (
              <button type="button" 
                onClick={nextFlip}
                className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-[#c5a059]/40 bg-black/40 hover:bg-[#c5a059]/20 text-[#c5a059] flex items-center justify-center transition-all duration-300 active:scale-90 z-40"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </motion.div>
        )}
      </main>

      {/* FOOTER NAVIGATION & TABLE OF CONTENTS TABS */}
      <footer className="relative z-30 w-full px-6 py-4 border-t border-[#e5c158]/10 bg-black/15 flex flex-col md:flex-row items-center justify-between gap-4">
        {bookState === 'open' ? (
          <>
            {/* Elegant Vintage styled Page Jump tabs */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-3">
              {[
                { label: 'Cover', page: 0 },
                { label: 'Title', page: 2 },
                { label: 'Biography', page: 3 },
                { label: 'Skills', page: 5 },
                { label: 'Ledger', page: 7 },
                { label: 'Artifacts', page: 9 },
                { label: 'Academic', page: 11 },
                { label: 'Epilogue', page: 12 },
              ].map((tab, idx) => {
                // Determine if this tab matches the current page spread
                const isActive = (currentPage === tab.page || currentPage === tab.page + 1 || (tab.page === 0 && currentPage === 0));
                return (
                  <button type="button"
                    key={idx}
                    onClick={() => turnTo(tab.page)}
                    className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider rounded-sm transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#c5a059] text-[#1c0f0a] font-bold shadow-md' 
                        : 'border border-[#c5a059]/25 text-[#c5a059] hover:bg-[#c5a059]/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            
            <div className="text-[10px] font-mono tracking-widest text-[#c5a059]/60 uppercase">
              Leaf: {currentPage === 0 ? 'Cover' : `${currentPage} / 14`}
            </div>
          </>
        ) : (
          <div className="w-full text-center text-[#c5a059]/40 font-mono text-[10px] uppercase tracking-widest">
            Touch or click the volume to read the chronicle
          </div>
        )}
      </footer>
    </div>
  );
}
