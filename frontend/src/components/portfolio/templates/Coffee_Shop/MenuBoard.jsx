import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, 
  Sparkles, 
  Trash2, 
  ExternalLink, 
  Plus, 
  ShoppingBag, 
  Clock, 
  Heart,
  MapPin,
  Send,
  Check,
  RefreshCw,
  CupSoda
} from 'lucide-react';

export default function MenuBoard({ data }) {
  // Default Coffee Shop theme mock data
  const defaultData = {
    personalInfo: {
      name: "Sophia Bennett",
      title: "Senior Full-Stack Developer & Coffee Artisan",
      bio: "Crafting rich, full-bodied web applications with a blend of robust backend APIs and velvety smooth user interfaces. Every line of code is carefully roasted to production-grade perfection.",
      location: "San Francisco, CA / Remote",
      avatar: null,
      socials: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com"
      }
    },
    menuCategories: [
      {
        id: "brewed-tech",
        title: "Brewed Tech (Core Skills)",
        description: "Freshly roasted languages and frameworks ready for deployment.",
        items: [
          { id: "skill-1", name: "React / Next.js Latte", price: "$4.50", desc: "Velvety component design layered over robust static-site generation. 100% hydration.", tag: "Frontend", rating: 5, caffeine: "High" },
          { id: "skill-2", name: "Node.js / Express Espresso", price: "$4.00", desc: "A concentrated shot of fast, single-threaded backend event loops. Highly asynchronous.", tag: "Backend", rating: 5, caffeine: "Extreme" },
          { id: "skill-3", name: "TypeScript Pour-Over", price: "$3.50", desc: "Slow-dripped type safety filtering out bugs before runtime. Clean, precise, aromatic.", tag: "Language", rating: 4, caffeine: "Medium" },
          { id: "skill-4", name: "Tailwind CSS Macchiato", price: "$3.00", desc: "A dollop of beautiful utility classes marked over clean, semantic HTML structure.", tag: "Styles", rating: 5, caffeine: "Low" }
        ]
      },
      {
        id: "specialty-blends",
        title: "Specialty Blends (Projects)",
        description: "Handcrafted full-scale applications brewed with passion.",
        items: [
          { id: "proj-1", name: "RoastMaster E-Commerce", price: "$12.00", desc: "Fullbean checkout platform featuring automated subscriptions, real-time inventory, and Stripe payouts.", tag: "Full-Stack", rating: 5, caffeine: "High", link: "https://github.com" },
          { id: "proj-2", name: "CafeSync Live POS", price: "$9.50", desc: "Cozy dashboard using WebSockets for instant table-order sync and live financial telemetry reporting.", tag: "Real-Time", rating: 4.5, caffeine: "High", link: "https://github.com" },
          { id: "proj-3", name: "AromaMatch AI Recommender", price: "$14.00", desc: "Machine learning recommendation system matching flavor notes with user preferences.", tag: "AI / Python", rating: 5, caffeine: "Medium", link: "https://github.com" }
        ]
      },
      {
        id: "add-ons",
        title: "Flavor Add-Ons (DevOps & Databases)",
        description: "Extra toppings to enrich system stability and storage scaling.",
        items: [
          { id: "addon-1", name: "Docker / Kubernetes Foam", price: "$1.50", desc: "Thick container layer keeping microservices isolated, floating, and easy to deploy.", tag: "DevOps", rating: 4, caffeine: "Low" },
          { id: "addon-2", name: "AWS Cloud Syrup", price: "$2.00", desc: "Sweet cloud integration involving ECS, Lambda, CloudFront, and secure S3 buckets.", tag: "Cloud", rating: 4, caffeine: "Medium" },
          { id: "addon-3", name: "PostgreSQL Fine Roast", price: "$1.00", desc: "Rich, highly-structured relational database tables built with optimized index keys.", tag: "Database", rating: 5, caffeine: "Low" }
        ]
      }
    ]
  };

  const profile = data?.personalInfo || defaultData.personalInfo;
  const categories = data?.menuCategories || defaultData.menuCategories;

  // Active Category State
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "brewed-tech");

  // Receipt Order State
  const [orderItems, setOrderItems] = useState([]);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [emailText, setEmailText] = useState("");

  // Coffee Brewer Simulator State
  const [brewBase, setBrewBase] = useState("");
  const [brewFlavor, setBrewFlavor] = useState("");
  const [brewSweetener, setBrewSweetener] = useState("");
  const [isBrewing, setIsBrewing] = useState(false);
  const [brewProgress, setBrewProgress] = useState(0);
  const [brewStageText, setBrewStageText] = useState("");
  const [brewedCup, setBrewedCup] = useState(null);

  // refs for timeout cleanup
  const brewTimeoutsRef = useRef([]);
  const inquiryTimeoutRef = useRef(null);

  // Sync category if external categories list changes
  useEffect(() => {
    if (categories.length > 0 && !categories.some(c => c.id === activeCategory)) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      brewTimeoutsRef.current.forEach(clearTimeout);
      if (inquiryTimeoutRef.current) {
        clearTimeout(inquiryTimeoutRef.current);
      }
    };
  }, []);

  const clearBrewTimeouts = () => {
    brewTimeoutsRef.current.forEach(clearTimeout);
    brewTimeoutsRef.current = [];
  };

  // Add Item to Order (functional updater to avoid stale closure)
  const addToOrder = (item) => {
    setOrderItems((prev) => {
      if (prev.some((o) => o.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  // Remove Item from Order (functional updater to avoid stale closure)
  const removeFromOrder = (id) => {
    setOrderItems((prev) => prev.filter((o) => o.id !== id));
  };

  // Calculate Order Stats
  const calculateTotal = () => {
    const sum = orderItems.reduce((acc, curr) => {
      const numericPrice = parseFloat(curr.price.replace('$', ''));
      return acc + numericPrice;
    }, 0);
    return sum.toFixed(2);
  };

  // Simulate Coffee Brewing
  const handleBrew = () => {
    if (!brewBase || !brewFlavor || !brewSweetener) return;
    clearBrewTimeouts();
    setIsBrewing(true);
    setBrewProgress(0);
    setBrewedCup(null);

    const stages = [
      { text: "Grinding roasted beans...", time: 600 },
      { text: "Compressing espresso puck...", time: 1200 },
      { text: "Extracting rich developers cremas...", time: 1800 },
      { text: "Steaming microfoam milk layer...", time: 2400 },
      { text: "Infusing sweeteners & code...", time: 3000 }
    ];

    stages.forEach((stage, idx) => {
      const tId = setTimeout(() => {
        setBrewStageText(stage.text);
        setBrewProgress((idx + 1) * 20);
        if (idx === stages.length - 1) {
          const innerTId = setTimeout(() => {
            setIsBrewing(false);
            setBrewedCup({
              name: `The ${brewFlavor}-Steamed ${brewBase} ${brewSweetener}`,
              desc: `A robust custom blend perfect for your next project. It pairs a rich ${brewBase} foundation with a high-performance ${brewFlavor} texture and is sweetened with clean, modern ${brewSweetener} guidelines. Perfect for high-frequency user traffic!`,
              temp: "Hot & Ready",
              rating: "⭐⭐⭐⭐⭐"
            });
          }, 600);
          brewTimeoutsRef.current.push(innerTId);
        }
      }, stage.time);
      brewTimeoutsRef.current.push(tId);
    });
  };

  // Handle Inquiry Form Submission
  const handleSendInquiry = (e) => {
    e.preventDefault();
    if (!emailText.trim()) return;
    if (inquiryTimeoutRef.current) clearTimeout(inquiryTimeoutRef.current);
    setInquirySubmitted(true);
    inquiryTimeoutRef.current = setTimeout(() => {
      setShowInquiryModal(false);
      setOrderItems([]);
      setInquirySubmitted(false);
      setEmailText("");
      setMessageText("");
    }, 2500);
  };

  return (
    <div className="w-full min-h-screen bg-[#161210] text-[#fbf9f3] relative overflow-hidden font-sans pb-16">
      
      {/* 1. CSS Wood Paneling Backdrop & Steam Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b120c] to-[#0c0806] bg-[linear-gradient(90deg,rgba(0,0,0,0.18)_1px,transparent_1px)] bg-[size:48px_100%] pointer-events-none z-0" />
      
      <style>{`
        @keyframes coffee-steam {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          15% { opacity: 0.65; }
          50% { transform: translateY(-15px) scaleX(1.3); opacity: 0.35; }
          100% { transform: translateY(-30px) scaleX(0.7); opacity: 0; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-steam-slow {
          animation: coffee-steam 2.5s infinite ease-in-out;
        }
        .animate-steam-mid {
          animation: coffee-steam 2s infinite ease-in-out 0.5s;
        }
        .animate-steam-fast {
          animation: coffee-steam 1.8s infinite ease-in-out 0.9s;
        }
      `}</style>
      
      {/* 2. Hanging Vintage Cafe Pendant Lights */}
      <div className="absolute top-0 left-[15%] w-40 h-[450px] pointer-events-none z-10 hidden sm:flex flex-col items-center">
        <div className="w-[3px] h-36 bg-gradient-to-b from-stone-900 to-stone-700" />
        <div className="w-8 h-8 bg-amber-900 rounded-t-md shadow-md border-b-2 border-amber-950" />
        <div className="w-12 h-12 bg-amber-400/80 rounded-full blur-[2px] shadow-[0_0_25px_rgba(245,158,11,0.7)] flex items-center justify-center -mt-1">
          <div className="w-5 h-7 bg-amber-200/90 rounded-full" />
        </div>
        <div className="w-[350px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.14),transparent_65%)] -mt-2" />
      </div>

      <div className="absolute top-0 left-[85%] w-40 h-[450px] pointer-events-none z-10 hidden sm:flex flex-col items-center">
        <div className="w-[3px] h-48 bg-gradient-to-b from-stone-900 to-stone-700" />
        <div className="w-8 h-8 bg-amber-900 rounded-t-md shadow-md border-b-2 border-amber-950" />
        <div className="w-12 h-12 bg-amber-400/80 rounded-full blur-[2px] shadow-[0_0_25px_rgba(245,158,11,0.7)] flex items-center justify-center -mt-1">
          <div className="w-5 h-7 bg-amber-200/90 rounded-full" />
        </div>
        <div className="w-[350px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.14),transparent_65%)] -mt-2" />
      </div>

      {/* Background Soft Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500 opacity-[0.05] rounded-full blur-[130px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-[#5c4033] opacity-20 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
        
        {/* Café Header Board - Double styled borders, wood details */}
        <header className="text-center mb-14 relative flex flex-col items-center">
          <div className="inline-block border-[6px] border-[#5c4033] bg-[#2d1a12] px-10 py-7 rounded-3xl shadow-[0_16px_36px_rgba(0,0,0,0.75)] border-double max-w-full relative">
            {/* Hanging chain/hooks detail */}
            <div className="absolute -top-6 left-12 w-2 h-6 bg-stone-700 rounded-t-full shadow-inner hidden sm:block" />
            <div className="absolute -top-6 right-12 w-2 h-6 bg-stone-700 rounded-t-full shadow-inner hidden sm:block" />
            
            <span className="text-amber-400 text-xs font-mono tracking-[0.25em] uppercase block mb-1.5 font-black">☕ Premium Coffee Shop Theme</span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-wide text-white font-serif uppercase">
              {profile.name}
            </h1>
            <p className="text-amber-200 text-sm sm:text-base mt-2.5 font-bold tracking-wider uppercase font-serif">
              ✦ {profile.title} ✦
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto mt-6 px-4">
            <p className="text-stone-200 text-base sm:text-lg leading-relaxed italic font-medium">
              "{profile.bio}"
            </p>
            <div className="flex flex-wrap justify-center items-center gap-y-2 gap-x-4 mt-5 text-stone-300 text-xs font-mono font-semibold">
              <span className="flex items-center gap-1.5 bg-stone-900/80 border border-stone-800 px-3.5 py-1.5 rounded-full shadow-md">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {profile.location}
              </span>
              <span className="hidden sm:inline text-amber-500">•</span>
              <span className="flex items-center gap-1.5 bg-stone-900/80 border border-stone-800 px-3.5 py-1.5 rounded-full shadow-md">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Open to Project Inquiries
              </span>
            </div>
          </div>
        </header>

        {/* Main Grid: Menu Board & Brewer/Receipt */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Chalkboard Menu Board (8 cols on desktop) */}
          <div className="lg:col-span-8 flex flex-col">
            
            {/* Menu Category Selection Tags - styled like hanging chalkboard tags */}
            <div className="flex gap-2.5 mb-0 overflow-x-auto pb-2 scrollbar-hide select-none">
              {categories.map((cat) => (
                <button type="button"
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-t-2xl font-serif text-sm tracking-wider uppercase transition-all duration-300 relative border-b-0 ${
                    activeCategory === cat.id 
                    ? 'bg-[#141b18] text-amber-300 border-2 border-amber-500/60 border-b-transparent shadow-[0_-5px_18px_rgba(245,158,11,0.2)] font-black'
                    : 'bg-[#1e2924]/80 text-stone-300 hover:text-white hover:bg-[#25332c] border border-stone-700'
                  }`}
                >
                  <Coffee className={`w-4 h-4 ${activeCategory === cat.id ? 'text-amber-300' : 'text-stone-400'}`} />
                  {cat.title.split(' ')[0]}
                  
                  {activeCategory === cat.id && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 w-full h-[3px] bg-amber-400"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* The Chalkboard - crisp contrast green board with rich mahogany border */}
            <div className="bg-[#141b18] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,transparent_100%),repeating-linear-gradient(45deg,rgba(255,255,255,0.005)_0px,rgba(255,255,255,0.005)_2px,transparent_2px,transparent_10px)] border-[14px] border-[#3e271a] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative">
              {/* Wood frame screw heads */}
              <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-stone-500 rounded-full border border-stone-700 shadow-inner" />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-stone-500 rounded-full border border-stone-700 shadow-inner" />
              <div className="absolute bottom-1 left-1 w-2.5 h-2.5 bg-stone-500 rounded-full border border-stone-700 shadow-inner" />
              <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-stone-500 rounded-full border border-stone-700 shadow-inner" />
              
              {/* Corner brackets */}
              <div className="absolute top-[-10px] left-[-10px] w-6 h-6 border-t-2 border-l-2 border-[#5c4033] pointer-events-none" />
              <div className="absolute top-[-10px] right-[-10px] w-6 h-6 border-t-2 border-r-2 border-[#5c4033] pointer-events-none" />
              <div className="absolute bottom-[-10px] left-[-10px] w-6 h-6 border-b-2 border-l-2 border-[#5c4033] pointer-events-none" />
              <div className="absolute bottom-[-10px] right-[-10px] w-6 h-6 border-b-2 border-r-2 border-[#5c4033] pointer-events-none" />
              
              {/* Decorative chalk coffee outline graphic in corner */}
              <div className="absolute top-4 right-4 text-white/5 pointer-events-none select-none">
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                  <line x1="6" y1="2" x2="6" y2="4" />
                  <line x1="10" y1="2" x2="10" y2="4" />
                  <line x1="14" y1="2" x2="14" y2="4" />
                </svg>
              </div>

              {/* Board Header details */}
              <div className="border-b border-[#2b3b34] pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl text-yellow-100 font-bold tracking-wide uppercase">
                    {categories.find(c => c.id === activeCategory)?.title}
                  </h2>
                  <p className="text-stone-200 text-xs sm:text-sm mt-0.5 font-semibold">
                    {categories.find(c => c.id === activeCategory)?.description}
                  </p>
                </div>
                <div className="text-right font-mono text-[11px] text-amber-300 font-bold tracking-widest uppercase bg-stone-900/60 px-3.5 py-1.5 rounded-lg border border-[#2b3b34]">
                  ⭐ Handcrafted Daily
                </div>
              </div>

              {/* Menu items list */}
              <div className="flex flex-col gap-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {categories.find(c => c.id === activeCategory)?.items.map((item) => {
                      const isAdded = orderItems.some(o => o.id === item.id);
                      return (
                        <div 
                          key={item.id}
                          className="border border-[#2b3b34] bg-[#1a2320]/90 hover:border-amber-500 hover:bg-[#202c27] p-5 rounded-xl transition-all duration-300 flex flex-col justify-between group shadow-lg"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <h3 className="font-serif text-lg text-white group-hover:text-amber-300 transition-colors font-bold tracking-wide">
                                {item.name}
                              </h3>
                              <span className="font-mono text-base text-amber-300 font-extrabold ml-2 shrink-0 bg-stone-900/40 px-2 py-0.5 rounded-md border border-[#2b3b34]">
                                {item.price}
                              </span>
                            </div>
                            
                            <div className="flex gap-2 items-center mb-3">
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                                {item.tag}
                              </span>
                              {item.caffeine && (
                                <span className="text-[10px] font-mono font-bold text-stone-300">
                                  ☕ Caffeine: {item.caffeine}
                                </span>
                              )}
                            </div>
                            
                            <p className="text-xs text-stone-200 font-semibold leading-relaxed mb-4">
                              {item.desc}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-[#23302b] pt-3.5">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Heart 
                                  key={i} 
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.floor(item.rating) 
                                    ? 'text-amber-400 fill-amber-400' 
                                    : 'text-stone-600'
                                  }`} 
                                />
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              {item.link && (
                                <a 
                                  href={item.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-xl border border-stone-600 text-stone-200 hover:text-white hover:bg-stone-800 transition-all shadow-sm"
                                  title="View Repo / Live Demo"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button type="button"
                                onClick={() => addToOrder(item)}
                                disabled={isAdded}
                                className={`flex items-center gap-1.5 text-xs font-mono font-extrabold px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                                  isAdded 
                                  ? 'bg-[#133020] text-emerald-300 cursor-default border border-[#22563a] font-bold'
                                  : 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-md shadow-amber-950/30'
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    Ordered
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3" />
                                    Add
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Chalkboard divider scribble */}
              <div className="my-6 text-[#2b3b34]">
                <svg className="w-full h-3 text-stone-600/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q10,1 20,5 T40,5 T60,5 T80,5 T100,5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
                </svg>
              </div>

              {/* Chalkboard dust disclaimer detail */}
              <div className="font-mono text-[10px] text-stone-400 font-bold select-none uppercase tracking-wider">
                * Experience rates simulated in coffee metrics.
              </div>
            </div>

            {/* Custom Brewer Simulator Box - Styled like a premium Copper/Brass Espresso Machine */}
            <div className="mt-8 bg-gradient-to-r from-[#2c221a] via-[#4d3222] to-[#2c221a] border-4 border-[#3e271a] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              
              {/* Copper plate rivet detail screws in corners */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-amber-600 rounded-full border border-amber-900 shadow-inner" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-amber-600 rounded-full border border-amber-900 shadow-inner" />
              <div className="absolute bottom-2 left-2 w-2 h-2 bg-amber-600 rounded-full border border-amber-900 shadow-inner" />
              <div className="absolute bottom-2 right-2 w-2 h-2 bg-amber-600 rounded-full border border-amber-900 shadow-inner" />

              <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-amber-800/40 relative z-10">
                <div className="p-2.5 rounded-xl bg-amber-950 border-2 border-amber-600/40 text-amber-400 shadow-lg">
                  <CupSoda className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-white font-extrabold tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    Custom Dev-Coffee Brewer
                  </h3>
                  <p className="text-xs text-amber-100 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    Select ingredients to brew a custom software blend.
                  </p>
                </div>
              </div>

              {/* Brewer Selection Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10">
                {/* 1. Base Select */}
                <div>
                  <label className="block text-xs font-mono text-amber-300 font-bold uppercase tracking-wider mb-2 drop-shadow">1. Base Blend</label>
                  <select 
                    value={brewBase}
                    onChange={(e) => setBrewBase(e.target.value)}
                    className="w-full bg-stone-900/90 border-2 border-amber-800 text-amber-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 cursor-pointer shadow-inner font-semibold"
                  >
                    <option value="" className="bg-[#2c221a]">-- Choose Base --</option>
                    <option value="Single Page App" className="bg-[#2c221a]">Single Page App (SPA)</option>
                    <option value="Server API" className="bg-[#2c221a]">RESTful Server API</option>
                    <option value="Full-Stack Application" className="bg-[#2c221a]">Full-Stack Blend</option>
                    <option value="Static Website" className="bg-[#2c221a]">Jamstack Website</option>
                  </select>
                </div>

                {/* 2. Flavor Select */}
                <div>
                  <label className="block text-xs font-mono text-amber-300 font-bold uppercase tracking-wider mb-2 drop-shadow">2. Flavor Syrup</label>
                  <select 
                    value={brewFlavor}
                    onChange={(e) => setBrewFlavor(e.target.value)}
                    className="w-full bg-stone-900/90 border-2 border-amber-800 text-amber-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 cursor-pointer shadow-inner font-semibold"
                  >
                    <option value="" className="bg-[#2c221a]">-- Choose Flavor --</option>
                    <option value="React" className="bg-[#2c221a]">React (Mild / Interactive)</option>
                    <option value="TypeScript" className="bg-[#2c221a]">TypeScript (Robust / Structural)</option>
                    <option value="Node.js" className="bg-[#2c221a]">Node.js (Strong / Eventful)</option>
                    <option value="Python" className="bg-[#2c221a]">Python (Rich / Scientific)</option>
                    <option value="Golang" className="bg-[#2c221a]">Golang (Highly Concentrated)</option>
                  </select>
                </div>

                {/* 3. Sweetener Select */}
                <div>
                  <label className="block text-xs font-mono text-amber-300 font-bold uppercase tracking-wider mb-2 drop-shadow">3. Sweetener</label>
                  <select 
                    value={brewSweetener}
                    onChange={(e) => setBrewSweetener(e.target.value)}
                    className="w-full bg-stone-900/90 border-2 border-amber-800 text-amber-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 cursor-pointer shadow-inner font-semibold"
                  >
                    <option value="" className="bg-[#2c221a]">-- Choose Sweetener --</option>
                    <option value="Tailwind CSS" className="bg-[#2c221a]">Tailwind Drizzle</option>
                    <option value="GraphQL / APIs" className="bg-[#2c221a]">GraphQL Sugar</option>
                    <option value="PostgreSQL DB" className="bg-[#2c221a]">PostgreSQL Relational Cream</option>
                    <option value="Redux Tooling" className="bg-[#2c221a]">Redux State Sprinkles</option>
                  </select>
                </div>
              </div>

              {/* Brewing Action Niche */}
              <div className="flex flex-col items-center justify-center border-2 border-[#1f1712] rounded-2xl p-6 bg-stone-950/80 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] relative z-10">
                {isBrewing ? (
                  <div className="w-full flex flex-col items-center py-4">
                    {/* Animated Coffee Machine Cup */}
                    <div className="relative w-20 h-24 mb-4 flex flex-col items-center justify-end bg-stone-900 border-2 border-amber-900/60 rounded-xl p-2 overflow-hidden shadow-inner">
                      
                      {/* Coffee dripping line */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-12 bg-amber-800 opacity-90 z-10 animate-bounce" />
                      
                      {/* Steam rising */}
                      <div className="absolute top-1 flex gap-1 z-20">
                        <span className="block w-1.5 h-6 bg-stone-100/35 rounded-full blur-[1px] animate-steam-slow translate-y-[-5px]" />
                        <span className="block w-1 h-5 bg-stone-100/45 rounded-full blur-[1px] animate-steam-mid translate-y-[-10px]" />
                        <span className="block w-1.5 h-6 bg-stone-100/35 rounded-full blur-[1px] animate-steam-fast translate-y-[-8px]" />
                      </div>

                      {/* Liquid filling up */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${brewProgress}%` }}
                        transition={{ duration: 0.3 }}
                        className="w-full bg-amber-600 rounded-b opacity-90 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]"
                      />
                    </div>

                    <div className="text-center w-full max-w-xs">
                      <p className="text-sm font-mono text-amber-300 font-bold mb-2 animate-pulse uppercase tracking-wider">{brewStageText}</p>
                      <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden border border-stone-800">
                        <motion.div 
                          className="bg-amber-400 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${brewProgress}%` }}
                          transition={{ ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </div>
                ) : brewedCup ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full flex flex-col md:flex-row items-center gap-6 bg-stone-900/90 border border-amber-900/40 p-5 rounded-2xl shadow-xl"
                  >
                    {/* SVG Cup Render */}
                    <div className="relative shrink-0 flex flex-col items-center justify-center p-4 bg-stone-950 border border-stone-800 rounded-2xl shadow-inner">
                      <div className="relative w-24 h-24 flex flex-col items-center justify-center">
                        {/* Steam effect */}
                        <div className="absolute top-[-25px] flex gap-1 justify-center w-full">
                          <span className="w-1.5 h-8 bg-stone-100/20 rounded-full blur-[1.5px] animate-steam-slow" />
                          <span className="w-1 h-6 bg-stone-100/25 rounded-full blur-[1.5px] animate-steam-mid" />
                          <span className="w-1.5 h-8 bg-stone-100/20 rounded-full blur-[1.5px] animate-steam-fast" />
                        </div>
                        {/* Cup outline */}
                        <div className="w-20 h-16 bg-amber-50 rounded-b-2xl border-x-4 border-b-4 border-amber-950 relative flex items-center justify-center shadow-lg">
                          {/* Handle */}
                          <div className="absolute right-[-14px] top-[15px] w-6 h-8 border-4 border-amber-950 rounded-r-full" />
                          <Coffee className="w-8 h-8 text-amber-800/80" />
                        </div>
                        {/* Saucer */}
                        <div className="w-24 h-2 bg-amber-950/80 rounded-full mt-2" />
                      </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h4 className="font-serif text-lg text-amber-300 font-bold">{brewedCup.name}</h4>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40 self-start sm:self-center">
                          {brewedCup.temp}
                        </span>
                      </div>
                      <p className="text-xs text-stone-200 leading-relaxed mb-4 font-semibold">{brewedCup.desc}</p>
                      
                      <div className="flex flex-wrap gap-2.5 items-center justify-center md:justify-start">
                        <button type="button"
                          onClick={() => {
                            addToOrder({
                              id: `custom-brew-${Date.now()}`,
                              name: brewedCup.name,
                              price: "$10.00",
                              desc: brewedCup.desc,
                              tag: "Custom Blend",
                              rating: 5
                            });
                          }}
                          className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-mono text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add custom brew to order
                        </button>
                        
                        <button type="button"
                          onClick={() => setBrewedCup(null)}
                          className="border border-stone-600 hover:bg-stone-800 text-stone-200 font-mono text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Brew Another
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs text-amber-100 font-semibold max-w-md leading-relaxed mb-5">
                      Select a Base, Flavor Syrup, and Sweetener in the panel above, then activate the brewer to generate a custom project card recipe.
                    </p>
                    <button type="button"
                      onClick={handleBrew}
                      disabled={!brewBase || !brewFlavor || !brewSweetener}
                      className={`font-mono text-sm px-6 py-3 rounded-xl font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        brewBase && brewFlavor && brewSweetener
                        ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-[0_4px_16px_rgba(245,158,11,0.4)] active:translate-y-[1px]'
                        : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                      }`}
                    >
                      🚀 Start Brewing
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT: Thermal Receipt Order Ticket (4 cols on desktop) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 mt-8 lg:mt-0">
            
            {/* The Ticket Receipt Panel */}
            <div className="relative">
              
              {/* Receipt Brass/Gold Clip detail */}
              <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 w-28 h-8 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 border border-amber-800 rounded shadow-md z-20 flex items-center justify-center">
                {/* Vintage clip screw detailing */}
                <span className="w-4 h-4 bg-amber-900 rounded-full border border-amber-950 flex items-center justify-center shadow-inner">
                  <span className="w-2 h-[2px] bg-amber-400 rotate-45" />
                </span>
              </div>

              {/* The Receipt slip - Crisp cream and deep espresso colors for readability */}
              <div className="bg-[#fbfaf5] text-[#2c1a11] pt-10 pb-6 px-6 rounded-b-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative border-t-8 border-stone-800 overflow-hidden">
                
                {/* Visual barcode background accent decoration */}
                <div className="absolute top-[-30px] right-[-30px] w-24 h-24 border-4 border-dashed border-[#e6e2da] rounded-full pointer-events-none" />

                {/* Visual red counter transaction stamp */}
                <div className="absolute bottom-20 right-6 border-4 border-red-700/35 text-red-700/35 font-mono font-black text-xl px-3 py-1 rounded uppercase tracking-wider rotate-[-12deg] pointer-events-none select-none">
                  BREWED
                </div>

                {/* Cafe details inside receipt */}
                <div className="text-center border-b border-dashed border-stone-300 pb-4 mb-4">
                  <h3 className="font-serif font-black tracking-widest text-lg uppercase mb-1">COFFEE PORTFOLIO</h3>
                  <p className="text-[10px] font-mono text-stone-600 font-bold leading-tight uppercase">
                    Sophia's Counter • Terminal #1
                  </p>
                  <p className="text-[9px] font-mono text-stone-500 font-bold mt-1.5">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Items container */}
                <div className="min-h-[180px] flex flex-col justify-between">
                  <div>
                    {orderItems.length === 0 ? (
                      <div className="text-center py-10 flex flex-col items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-stone-300 mb-3" />
                        <p className="text-xs font-serif italic text-stone-500 font-bold">Your order is empty</p>
                        <p className="text-[10px] font-mono text-stone-500 max-w-[180px] leading-normal mt-1.5 font-bold">
                          Click "+ Add" on skills or projects to assemble a project inquiry list.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3.5 max-h-[300px] overflow-y-auto pr-1">
                        {orderItems.map((item) => (
                          <div 
                            key={item.id}
                            className="flex justify-between items-start gap-2 text-xs group animate-[fadeIn_0.2s_ease-out]"
                          >
                            <div className="flex-1">
                              <div className="font-serif font-extrabold text-[#2c1a11] flex items-center gap-1.5">
                                <span className="text-amber-800">•</span>
                                {item.name}
                              </div>
                              <span className="text-[9px] font-mono text-amber-800 font-bold uppercase block pl-3.5 mt-0.5">
                                {item.tag}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 font-mono">
                              <span className="font-extrabold text-[#2c1a11]">{item.price}</span>
                              <button type="button" 
                                onClick={() => removeFromOrder(item.id)}
                                className="text-stone-400 hover:text-red-700 hover:bg-stone-200/50 p-1 rounded transition-colors cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Calculations */}
                  {orderItems.length > 0 && (
                    <div className="border-t border-dashed border-stone-300 pt-4 mt-6">
                      <div className="flex justify-between items-center text-xs font-mono mb-1.5 font-bold text-stone-600">
                        <span className="uppercase">Estimated Cost Index</span>
                        <span>${calculateTotal()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs font-mono mb-4 font-bold text-stone-600">
                        <span className="uppercase">Total Items selected</span>
                        <span>{orderItems.length} Blends</span>
                      </div>

                      {/* Double dashed lines for Total */}
                      <div className="border-t-2 border-double border-stone-300 pt-3 flex justify-between items-center">
                        <span className="font-serif font-black tracking-wide text-sm uppercase">Grand Total</span>
                        <span className="font-mono font-black text-[#2c1a11] text-base">${calculateTotal()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Receipt Footer Action - Highly visible buttons */}
                <div className="mt-8">
                  <button type="button"
                    disabled={orderItems.length === 0}
                    onClick={() => setShowInquiryModal(true)}
                    className="w-full font-mono text-xs font-black uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer bg-amber-900 text-white hover:bg-[#522b13] shadow-md shadow-amber-900/20 active:translate-y-[1px] disabled:bg-stone-300 disabled:text-stone-600 disabled:border disabled:border-stone-400/60 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Place Project Order
                  </button>
                </div>

                {/* Realistic Receipt Barcode decoration */}
                <div className="mt-6 flex flex-col items-center pt-4 border-t border-stone-200">
                  <div className="h-8 w-full bg-[repeating-linear-gradient(90deg,#2c1a11,#2c1a11_2px,transparent_2px,transparent_6px,#2c1a11_6px,#2c1a11_9px,transparent_9px,transparent_11px)] opacity-95" />
                  <span className="text-[8px] font-mono text-stone-500 tracking-[0.25em] font-extrabold mt-1.5">SOPHIA-PORTFOLIO-2026</span>
                </div>

                {/* Receipt bottom zigzag cuts */}
                <div className="absolute bottom-0 left-0 w-full h-[6px] bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,#161210_4px,#161210_8px),repeating-linear-gradient(-45deg,transparent,transparent_4px,#161210_4px,#161210_8px)] opacity-100 pointer-events-none" />
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Inquiry Modal - High-contrast light cream parchment modal */}
      <AnimatePresence>
        {showInquiryModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#fdfbf7] border-2 border-[#5c4033] max-w-lg w-full rounded-2xl p-6 sm:p-8 relative shadow-2xl overflow-hidden text-stone-900"
            >
              {/* Decorative coffee bean graphic */}
              <div className="absolute top-0 right-0 opacity-[0.04] select-none pointer-events-none text-8xl font-serif">☕</div>

              <div className="mb-6">
                <h3 className="font-serif text-2xl text-[#2c1a11] font-bold mb-1">📝 Enter Counter Details</h3>
                <p className="text-xs text-stone-600 font-medium">
                  Let's discuss the developer brews you've added to your ticket.
                </p>
              </div>

              {inquirySubmitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-emerald-100 border border-emerald-300 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Check className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="font-serif text-[#2c1a11] text-lg font-bold mb-1">Inquiry order received!</h4>
                  <p className="text-xs text-stone-600 max-w-xs leading-relaxed font-medium">
                    The barista will review your order ticket and follow up shortly at your email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-mono text-amber-800 font-bold uppercase tracking-wide mb-1.5">Email Address</label>
                    <input 
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={emailText}
                      onChange={(e) => setEmailText(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-amber-800 font-bold uppercase tracking-wide mb-1.5">Message / Project Spec</label>
                    <textarea 
                      rows={4}
                      placeholder="I'd love to hire you to build some of these brews..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30 resize-none font-medium"
                    />
                  </div>

                  {/* Summary of ordered items */}
                  <div className="p-3.5 bg-[#fcf7ee] rounded-xl border border-amber-200">
                    <span className="text-[10px] font-mono text-amber-800 font-bold uppercase tracking-wider block mb-1">Receipt Summary ({orderItems.length} items)</span>
                    <p className="text-xs text-stone-700 font-serif font-bold truncate">
                      {orderItems.map(o => o.name).join(', ')}
                    </p>
                  </div>

                  <div className="flex gap-3 justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => setShowInquiryModal(false)}
                      className="border border-stone-300 hover:bg-stone-100 text-stone-700 font-mono text-xs px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      className="bg-amber-800 hover:bg-amber-700 text-white font-mono text-xs px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Order
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
