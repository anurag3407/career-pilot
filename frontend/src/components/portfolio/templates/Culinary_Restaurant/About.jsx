import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed,
  Award,
  ChefHat,
  Flame,
  Sparkles,
  Clock,
  Quote,
  Heart,
  Calendar,
  Compass,
  ArrowRight,
  Star,
  Trophy,
  Leaf,
  Users,
  MapPin,
  TrendingUp
} from 'lucide-react';

const IconMap = {
  UtensilsCrossed,
  Award,
  ChefHat,
  Flame,
  Sparkles,
  Clock,
  Heart,
  Calendar,
  Compass,
  Star,
  Trophy,
  Leaf,
  Users,
  MapPin,
  TrendingUp
};

export default function About({
  title = "Where culinary art meets timeless tradition",
  subtitle = "Our Story",
  established = "EST. 2004",
  storyTitle = "A Legacy of Taste",
  story = "Our culinary journey began with a simple belief: that dining should be a sensory celebration. Over the last two decades, we have refined our craft, marrying classical gastronomy techniques with modern culinary imagination to deliver unforgettable plates that tell a story of heritage and passion. What started as a modest 40-seat dining room has blossomed into an award-winning culinary destination, yet our commitment to excellence remains unchanged. Every dish we create is a testament to our dedication to the art of cooking, our respect for ingredients, and our passion for creating moments that linger in memory long after the last bite.",
  chef = {
    name: "Executive Chef Vance",
    quote:
      "A plate of food is a canvas where we paint our respect for the soil, the sea, and the seasonality. Every ingredient has a voice; our role is simply to let it sing in perfect harmony.",
    role: "Culinary Director & Founder",
    signature: "Julian Vance"
  },
  pillars = [
    {
      title: "Artisanal Sourcing",
      description:
        "We work directly with local organic growers and day-boat fishermen to secure ingredients at their peak freshness.",
      icon: "Sparkles"
    },
    {
      title: "Masterful Technique",
      description:
        "Our kitchen honors time-tested classical foundations while fearlessly exploring new culinary frontiers.",
      icon: "Flame"
    },
    {
      title: "Sensory Harmony",
      description:
        "Each dish is meticulously choreographed to balance texture, temperature, flavor profile, and visual aesthetics.",
      icon: "UtensilsCrossed"
    },
    {
      title: "Sustainable Practices",
      description:
        "Zero-waste kitchen philosophy, composting programs, and partnerships with biodynamic farms.",
      icon: "Leaf"
    },
    {
      title: "Community Focus",
      description:
        "Supporting local food banks, culinary education programs, and neighborhood initiatives.",
      icon: "Heart"
    }
  ],
  tabs = [
    {
      id: "heritage",
      label: "Our Heritage",
      title: "Honoring the Craft",
      content:
        "For over twenty years, our kitchen has stood as a beacon of culinary dedication. We began as a small boutique dining room and have grown into a celebrated culinary destination. Through it all, we have remained true to our founding principle: to create exceptional, honest dishes that elevate local ingredients to their highest potential."
    },
    {
      id: "sustainability",
      label: "Eco-Gastronomy",
      title: "Respecting the Land",
      content:
        "Sustainability is not a buzzword for us; it is our foundation. We practice a zero-waste philosophy in our kitchen, composting organics, repurposing trimmings, and choosing partners who utilize biodynamic and sustainable farming techniques. Eating well should mean eating in harmony with the planet."
    },
    {
      id: "experience",
      label: "The Ambience",
      title: "An Immersive Sanctuary",
      content:
        "We believe the perfect dining experience extends far beyond the plate. Our dining room is crafted with natural stone, brass accents, and ambient lighting designed to evoke a sense of warm intimacy. It is a sanctuary where time slows down, conversations flow, and memories are savored."
    },
    {
      id: "awards",
      label: "Recognition",
      title: "Celebrated Excellence",
      content:
        "Our commitment to culinary excellence has been recognized by the industry's most prestigious institutions. From Michelin recommendations to James Beard nominations, these honors reflect our unwavering dedication to the craft and the trust our guests place in us every evening."
    },
    {
      id: "philosophy",
      label: "Our Philosophy",
      title: "The Art of Hospitality",
      content:
        "At our core, we believe that great food is about connection—between farmer and chef, between kitchen and table, between tradition and innovation. Every plate tells a story, every meal creates a memory, and every guest becomes part of our extended family."
    }
  ],
  statistics = [
    { value: "20+", label: "Years of Excellence", icon: "Calendar" },
    { value: "50K+", label: "Dishes Crafted", icon: "UtensilsCrossed" },
    { value: "15", label: "Industry Awards", icon: "Trophy" },
    { value: "4.9", label: "Guest Rating", icon: "Star" }
  ],
  timeline = [
    {
      year: "2004",
      title: "The Beginning",
      description:
        "Opened our doors with a vision of authentic, ingredient-driven cuisine."
    },
    {
      year: "2010",
      title: "First Recognition",
      description:
        "Received our first major culinary award and expanded to 80 seats."
    },
    {
      year: "2016",
      title: "Sustainability Pioneer",
      description:
        "Implemented zero-waste kitchen and partnered with 20+ local farms."
    },
    {
      year: "2024",
      title: "Two Decades",
      description:
        "Celebrating 20 years of culinary excellence and community impact."
    }
  ]
}) {

  // Defensive tab handling
  const initialTabId = tabs?.[0]?.id ?? null;

  const [activeTab, setActiveTab] = useState(initialTabId);

  useEffect(() => {
    if (!tabs?.length) {
      setActiveTab(null);
      return;
    }

    const tabExists = tabs.some((tab) => tab.id === activeTab);

    if (!tabExists) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  const activeTabContent =
    tabs?.find((t) => t.id === activeTab) ?? tabs?.[0] ?? null;

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section className="bg-[#0B0907] text-[#E8E6E3] font-sans py-20 px-4 md:px-8 lg:px-16 overflow-hidden relative min-h-screen flex flex-col justify-center">

      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#8B5A2B]/10 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10">

        {/* Decorative Top Border Line */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="h-[1px] w-12 bg-[#D4AF37]/30" />
          <span className="text-[#D4AF37] tracking-[0.25em] text-xs font-semibold uppercase">
            {established}
          </span>
          <div className="h-[1px] w-12 bg-[#D4AF37]/30" />
        </div>

        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[#D4AF37] font-serif italic text-lg block mb-2">
            {subtitle}
          </span>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white tracking-wide font-normal leading-tight">
            {title}
          </h2>

          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-6" />
        </motion.div>

        {/* Story + Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="lg:col-span-7 space-y-8"
          >

            <div className="space-y-4">
              <h3 className="text-2xl font-serif text-white tracking-wide">
                {storyTitle}
              </h3>

              <p className="text-[#C2BFB9] leading-relaxed text-base md:text-lg">
                {story}
              </p>
            </div>

            {/* Tabs */}
            {tabs?.length > 0 && (
              <>
                <div className="border-b border-[#D4AF37]/20 pb-2">
                  <div className="flex flex-wrap gap-6 md:gap-8">

                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative pb-3 text-sm tracking-wider uppercase font-semibold transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'text-[#D4AF37]'
                            : 'text-[#C2BFB9]/60 hover:text-[#C2BFB9]'
                        }`}
                      >
                        {tab.label}

                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeTabUnderline"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30
                            }}
                          />
                        )}
                      </button>
                    ))}

                  </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[140px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >

                      <h4 className="text-xl font-serif text-[#D4AF37] italic font-medium">
                        {activeTabContent?.title ?? ""}
                      </h4>

                      <p className="text-[#C2BFB9] leading-relaxed text-sm md:text-base">
                        {activeTabContent?.content ?? ""}
                      </p>

                    </motion.div>
                  </AnimatePresence>
                </div>
              </>
            )}

          </motion.div>
        </div>
      </div>
    </section>
  );
}
