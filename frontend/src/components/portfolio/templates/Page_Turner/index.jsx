import React, { useRef } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { motion, useBookSize, useWheelFlip } from './shared'
import HeroPage from './HeroPage'
import AboutPage from './AboutPage'
import SkillsPage from './SkillsPage'
import ProjectsPage from './ProjectsPage'
import ExperiencePage from './ExperiencePage'
import TestimonialsPage from './TestimonialsPage'
import ContactPage from './ContactPage'
import BackCoverPage from './BackCoverPage'

export default function PageTurner() {
  const bookRef = useRef(null)
  const { width, height } = useBookSize()

  useWheelFlip(bookRef)

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(180deg,#0f172a_0%,#111827_100%)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-screen w-full items-stretch justify-stretch"
      >
        <HTMLFlipBook
          ref={bookRef}
          width={width}
          height={height}
          maxShadowOpacity={0.45}
          drawShadow={true}
          showCover={true}
          size="fixed"
          
          flippingTime={650}
          usePortrait={true}
          startZIndex={0}
          autoSize={false}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={true}
          mobileScrollSupport={true}
          startPage={0}
          className="h-screen w-screen"
        >
          <HeroPage />
          <AboutPage />
          <SkillsPage />
          <ProjectsPage />
          <ExperiencePage />
          <TestimonialsPage />
          <ContactPage />
          <BackCoverPage />
        </HTMLFlipBook>
      </motion.div>
    </div>
  )
}
