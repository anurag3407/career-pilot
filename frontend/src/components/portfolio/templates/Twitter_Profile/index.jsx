import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Search, Bell, Mail, User, MoreHorizontal, 
  ArrowLeft, Calendar, Link as LinkIcon, MapPin,
  MessageCircle, Repeat2, Heart, Share, BarChart3,
  CheckCircle2, Code2, Briefcase, Star, BadgeCheck,
  Github, Linkedin, Twitter, ExternalLink, Flame
} from 'lucide-react';

/**
 * Twitter Profile Portfolio Template
 * Category: Famous UI Inspired
 * Description: Twitter/X profile layout with banner image, profile info section, and tweet-style project posts in a feed.
 */
export default function TwitterProfile() {
  const { portfolioData: data } = usePortfolio();

  const [activeTab, setActiveTab] = useState('Projects');

  // Format date safely
  const joinDate = "Joined September 2015"; // Simulated join date

  // Helpers to format numbers (e.g. 1.2M, 5.4K)
  const formatNumber = (num) => {
    if (num > 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num > 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const tabs = ['Projects', 'Experience', 'Skills', 'Mentions'];

  // Calculate total "tweets" to show in header
  const totalTweets = data.projects.length + data.experience.length + data.testimonials.length;

  return (
    <div className="min-h-screen bg-black text-[#e7e9ea] font-sans selection:bg-[#1d9bf0]/30 overflow-x-hidden">
      <div className="max-w-[1265px] mx-auto flex justify-center w-full">
        
        {/* LEFT SIDEBAR (Navigation) */}
        <header className="hidden sm:flex flex-col w-[88px] xl:w-[275px] h-screen sticky top-0 px-2 xl:px-4 py-3 justify-between">
          <div className="flex flex-col gap-2 w-full items-center xl:items-start">
            <div className="p-3 w-fit hover:bg-white/10 rounded-full transition-colors cursor-pointer mb-2">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-7 h-7 fill-current text-white">
                <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g>
              </svg>
            </div>

            <NavItem icon={<Home size={26} strokeWidth={2.5} />} label="Home" />
            <NavItem icon={<Search size={26} />} label="Explore" className="xl:hidden" />
            <NavItem icon={<Bell size={26} />} label="Notifications" />
            <a href={`mailto:${data.socials.email}`} className="w-full">
              <NavItem icon={<Mail size={26} />} label="Messages" />
            </a>
            <NavItem icon={<User size={26} strokeWidth={2.5} />} label="Profile" isActive />
            <NavItem icon={<MoreHorizontal size={26} />} label="More" />

            <button className="mt-4 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-full font-bold transition-colors w-[52px] h-[52px] xl:w-full xl:h-[52px] xl:px-8 text-[17px] flex items-center justify-center shadow-md">
              <span className="hidden xl:inline">Post</span>
              <span className="xl:hidden">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><g><path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path></g></svg>
              </span>
            </button>
          </div>

          {/* Mini Profile (Bottom Left) */}
          <div className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-full transition-colors cursor-pointer w-full mt-auto mb-3 xl:hover:bg-[#181818]">
            <img src={data.personal.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover shrink-0" />
            <div className="hidden xl:flex flex-col flex-1 truncate">
              <div className="font-bold text-[15px] text-[#e7e9ea] flex items-center gap-1">
                {data.personal.name} <BadgeCheck size={16} className="text-[#1d9bf0] fill-current" />
              </div>
              <div className="text-[#71767b] text-[15px]">@{data.personal.name.replace(/\s+/g, '').toLowerCase()}</div>
            </div>
            <MoreHorizontal size={18} className="hidden xl:block shrink-0 text-[#e7e9ea]" />
          </div>
        </header>

        {/* CENTER FEED */}
        <main className="w-full sm:w-[600px] border-x border-[#2f3336] min-h-screen relative shrink-0">
          
          {/* Header */}
          <div className="sticky top-0 z-20 bg-black/75 backdrop-blur-md px-4 py-1.5 flex items-center gap-7 h-[53px]">
            <div className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer shrink-0">
              <ArrowLeft size={20} className="text-[#e7e9ea]" />
            </div>
            <div className="flex flex-col">
              <div className="font-bold flex items-center gap-1 text-[#e7e9ea] text-xl leading-5 mt-1">
                {data.personal.name} <BadgeCheck size={18} className="text-[#1d9bf0] fill-current" />
              </div>
              <div className="text-[#71767b] text-[13px]">{totalTweets} posts</div>
            </div>
          </div>

          {/* Profile Section */}
          <div>
            {/* Banner */}
            <div className="h-[150px] sm:h-[200px] bg-[#333639] w-full relative">
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                alt="Banner" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Info */}
            <div className="px-4 pb-4 relative">
              {/* Avatar & Edit Button */}
              <div className="flex justify-between items-start mb-3">
                <div className="w-[100px] h-[100px] sm:w-[134px] sm:h-[134px] rounded-full border-4 border-black relative -mt-[15%] bg-black overflow-hidden">
                  <img src={data.personal.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <a href={`mailto:${data.socials.email}`} className="w-9 h-9 rounded-full border border-[#536471] flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Mail size={18} className="text-white" />
                  </a>
                  <button className="px-4 py-1.5 rounded-full border border-[#536471] text-white font-bold text-[15px] hover:bg-white/10 transition-colors">
                    Edit profile
                  </button>
                </div>
              </div>

              {/* Name & Handle */}
              <div className="mb-3">
                <div className="font-black text-xl flex items-center gap-1 leading-tight text-[#e7e9ea]">
                  {data.personal.name} <BadgeCheck size={20} className="text-[#1d9bf0] fill-current" />
                </div>
                <div className="text-[#71767b] text-[15px]">@{data.personal.name.replace(/\s+/g, '').toLowerCase()}</div>
              </div>

              {/* Bio & Title */}
              <div className="text-[15px] mb-3 text-[#e7e9ea] whitespace-pre-wrap leading-snug">
                <span className="font-bold block mb-1 text-[#1d9bf0]">{data.personal.title}</span>
                {data.personal.bio}
              </div>

              {/* Details */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-[#71767b] text-[15px] mb-3">
                {data.personal.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={18} /> {data.personal.location}
                  </div>
                )}
                {data.socials.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon size={18} /> 
                    <a href={data.socials.website} target="_blank" rel="noopener noreferrer" className="text-[#1d9bf0] hover:underline truncate max-w-[150px]">
                      {data.socials.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar size={18} /> {joinDate}
                </div>
              </div>

              {/* Following/Followers & Stats */}
              <div className="flex flex-wrap gap-5 text-[15px]">
                <div className="hover:underline cursor-pointer flex gap-1">
                  <span className="font-bold text-[#e7e9ea]">{data.stats.projectsCompleted}</span> <span className="text-[#71767b]">Following</span>
                </div>
                <div className="hover:underline cursor-pointer flex gap-1">
                  <span className="font-bold text-[#e7e9ea]">{formatNumber(43200)}</span> <span className="text-[#71767b]">Followers</span>
                </div>
                <div className="cursor-default flex gap-1 items-center">
                  <Flame size={16} className="text-orange-500" />
                  <span className="text-[#71767b]">{data.stats.yearsExperience} yrs exp</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#2f3336] overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 min-w-[100px] hover:bg-white/10 transition-colors relative flex items-center justify-center h-[53px]"
              >
                <div className={`text-[15px] font-bold ${activeTab === tab ? 'text-[#e7e9ea]' : 'text-[#71767b]'}`}>
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-[#1d9bf0] rounded-full"
                    />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Feed Content */}
          <div className="pb-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'Projects' && <ProjectsFeed data={data} />}
                {activeTab === 'Experience' && <ExperienceFeed data={data} />}
                {activeTab === 'Skills' && <SkillsFeed data={data} />}
                {activeTab === 'Mentions' && <TestimonialsFeed data={data} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:block w-[350px] pl-8 py-3 h-screen sticky top-0">
          {/* Search */}
          <div className="sticky top-0 bg-black z-20 pb-3 pt-1">
            <div className="bg-[#202327] rounded-full flex items-center px-4 py-3 focus-within:bg-transparent focus-within:border focus-within:border-[#1d9bf0] focus-within:text-[#1d9bf0] text-[#71767b]">
              <Search size={20} className="mr-3" />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent border-none outline-none text-[#e7e9ea] placeholder-[#71767b] w-full font-normal"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* What's happening (Stats/Skills) */}
            <div className="bg-[#16181c] rounded-2xl pt-3 pb-1 border border-[#2f3336]">
              <h2 className="text-xl font-bold px-4 mb-3 text-[#e7e9ea]">What's happening</h2>
              
              <div className="px-4 py-2 hover:bg-white/5 cursor-pointer transition-colors">
                <div className="flex justify-between items-start">
                  <div className="text-[#71767b] text-[13px]">Trending in Portfolio</div>
                  <MoreHorizontal size={18} className="text-[#71767b]" />
                </div>
                <div className="font-bold text-[#e7e9ea] mt-0.5">#{data.stats.happyClients} Happy Clients</div>
                <div className="text-[#71767b] text-[13px] mt-0.5">{formatNumber(125000)} posts</div>
              </div>
              
              {data.skills.slice(0, 3).map((skill, idx) => (
                <div key={idx} className="px-4 py-2 hover:bg-white/5 cursor-pointer transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="text-[#71767b] text-[13px]">Trending in {skill.category}</div>
                    <MoreHorizontal size={18} className="text-[#71767b]" />
                  </div>
                  <div className="font-bold text-[#e7e9ea] mt-0.5">#{skill.name}</div>
                  <div className="text-[#71767b] text-[13px] mt-0.5">{skill.level}% Mastery</div>
                </div>
              ))}

              <div className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors text-[#1d9bf0] text-[15px]">
                Show more
              </div>
            </div>

            {/* Who to follow (Connect) */}
            <div className="bg-[#16181c] rounded-2xl pt-3 pb-1 border border-[#2f3336]">
              <h2 className="text-xl font-bold px-4 mb-3 text-[#e7e9ea]">Who to follow</h2>
              
              {data.socials.github && (
                <FollowItem 
                  name="GitHub" 
                  handle="View Code" 
                  icon={<Github size={20} />} 
                  href={data.socials.github} 
                />
              )}
              {data.socials.linkedin && (
                <FollowItem 
                  name="LinkedIn" 
                  handle="Connect" 
                  icon={<Linkedin size={20} />} 
                  href={data.socials.linkedin} 
                />
              )}
              {data.socials.twitter && (
                <FollowItem 
                  name="Twitter/X" 
                  handle="Follow Me" 
                  icon={<Twitter size={20} />} 
                  href={data.socials.twitter} 
                />
              )}

              <div className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors text-[#1d9bf0] text-[15px]">
                Show more
              </div>
            </div>
            
            {/* Footer links */}
            <div className="text-[13px] text-[#71767b] px-4 flex flex-wrap gap-x-3 gap-y-1">
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Cookie Policy</a>
              <a href="#" className="hover:underline">Accessibility</a>
              <a href="#" className="hover:underline">Ads info</a>
              <span>© 2026 Portfolio Corp.</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

// Subcomponents

function NavItem({ icon, label, isActive, className = '' }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className={`p-3 xl:px-4 xl:py-3 w-fit xl:w-full hover:bg-white/10 rounded-full transition-colors cursor-pointer flex items-center gap-5 xl:hover:bg-[#181818] ${className}`}>
      <div className={`relative ${isActive ? 'text-[#e7e9ea]' : 'text-[#e7e9ea]'}`}>
        {icon}
      </div>
      <span className={`hidden xl:block text-xl text-[#e7e9ea] ${isActive ? 'font-bold' : 'font-normal'}`}>
        {label}
      </span>
    </div>
  );
}

function FollowItem({ name, handle, icon, href }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="px-4 py-3 flex justify-between items-center hover:bg-white/5 cursor-pointer transition-colors block">
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 bg-[#2f3336] rounded-full flex items-center justify-center text-[#e7e9ea]">
          {icon}
        </div>
        <div className="flex flex-col">
          <div className="font-bold text-[#e7e9ea] text-[15px] hover:underline">{name}</div>
          <div className="text-[#71767b] text-[15px]">{handle}</div>
        </div>
      </div>
      <button className="bg-white text-black font-bold text-sm px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
        Follow
      </button>
    </a>
  );
}

function Tweet({ 
  avatar, 
  name, 
  handle, 
  time = "2h", 
  content, 
  media, 
  stats, 
  isVerified = true,
  isRetweet = false,
  retweeterName,
  links
}) {
  const { portfolioData: data } = usePortfolio();

  return (
    <article className="border-b border-[#2f3336] px-4 pt-3 pb-2 hover:bg-white/[0.03] transition-colors cursor-pointer">
      
      {isRetweet && (
        <div className="flex items-center gap-2 text-[#71767b] text-[13px] font-bold mb-1 ml-6">
          <Repeat2 size={14} /> {retweeterName} reposted
        </div>
      )}

      <div className="flex gap-3">
        <div className="shrink-0">
          <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
        </div>
        
        <div className="flex flex-col w-full min-w-0">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1 text-[15px] truncate">
              <span className="font-bold text-[#e7e9ea] hover:underline truncate max-w-[120px] sm:max-w-full">{name}</span>
              {isVerified && <BadgeCheck size={16} className="text-[#1d9bf0] fill-current shrink-0" />}
              <span className="text-[#71767b] truncate">@{handle}</span>
              <span className="text-[#71767b] px-1">·</span>
              <span className="text-[#71767b] hover:underline">{time}</span>
            </div>
            <div className="text-[#71767b] hover:text-[#1d9bf0] p-2 -mr-2 rounded-full hover:bg-[#1d9bf0]/10 transition-colors shrink-0">
              <MoreHorizontal size={18} />
            </div>
          </div>
          
          {/* Content */}
          <div className="text-[#e7e9ea] text-[15px] whitespace-pre-wrap mt-1">
            {content}
          </div>

          {/* Links for Projects */}
          {links && (
            <div className="mt-2 flex gap-4 text-[14px]">
              {links.live && (
                <a href={links.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#1d9bf0] hover:underline">
                  <ExternalLink size={16} /> Live Demo
                </a>
              )}
              {links.github && (
                <a href={links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#1d9bf0] hover:underline">
                  <Github size={16} /> Repository
                </a>
              )}
            </div>
          )}

          {/* Media */}
          {media && (
            <div className="mt-3 rounded-2xl border border-[#2f3336] overflow-hidden">
              <img src={media} alt="Post media" className="w-full h-auto object-cover max-h-[500px]" />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between text-[#71767b] mt-3 max-w-[425px]">
            <ActionIcon icon={<MessageCircle size={18} />} count={stats?.replies || 12} color="group-hover:text-[#1d9bf0]" bg="group-hover:bg-[#1d9bf0]/10" />
            <ActionIcon icon={<Repeat2 size={18} />} count={stats?.retweets || 45} color="group-hover:text-[#00ba7c]" bg="group-hover:bg-[#00ba7c]/10" />
            <ActionIcon icon={<Heart size={18} />} count={stats?.likes || 142} color="group-hover:text-[#f91880]" bg="group-hover:bg-[#f91880]/10" />
            <ActionIcon icon={<BarChart3 size={18} />} count={stats?.views || "1.2K"} color="group-hover:text-[#1d9bf0]" bg="group-hover:bg-[#1d9bf0]/10" />
            <div className="flex gap-2">
              <ActionIcon icon={<Share size={18} />} color="group-hover:text-[#1d9bf0]" bg="group-hover:bg-[#1d9bf0]/10" hideCount />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ActionIcon({ icon, count, color, bg, hideCount }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className={`flex items-center gap-1 group cursor-pointer text-[13px]`}>
      <div className={`p-2 rounded-full transition-colors ${bg} ${color}`}>
        {icon}
      </div>
      {!hideCount && (
        <span className={`${color} transition-colors px-1 -ml-1`}>
          {count}
        </span>
      )}
    </div>
  );
}

// Feeds

function ProjectsFeed() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div>
      {data.projects.map((project, idx) => (
        <Tweet 
          key={project.id}
          avatar={data.personal.avatar}
          name={data.personal.name}
          handle={data.personal.name.replace(/\s+/g, '').toLowerCase()}
          time={`${idx * 2 + 1}h`}
          content={
            <div>
              {project.title} 🚀
              <br/><br/>
              {project.description}
              <br/><br/>
              <span className="text-[#1d9bf0]">
                {project.techStack.map(tech => `#${tech.replace(/\s+/g, '')} `)}
              </span>
            </div>
          }
          links={{
            live: project.liveUrl,
            github: project.githubUrl
          }}
          media={project.image}
          stats={{
            likes: (150 - idx * 10),
            retweets: (40 - idx * 3),
            replies: (12 - idx),
            views: `${(5.4 - idx * 0.5).toFixed(1)}K`
          }}
        />
      ))}
    </div>
  );
}

function ExperienceFeed() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div>
      {/* Pinned Tweet styling for current role */}
      {data.experience.map((exp, idx) => (
        <Tweet 
          key={exp.id}
          avatar={data.personal.avatar}
          name={data.personal.name}
          handle={data.personal.name.replace(/\s+/g, '').toLowerCase()}
          time={idx === 0 ? "Pinned" : `${idx + 1}d`}
          content={
            <div>
              💼 <span className="font-bold">{exp.role}</span> @ <span className="text-[#1d9bf0]">{exp.company}</span>
              <br/>
              🗓️ {exp.period}
              <br/><br/>
              {exp.description}
            </div>
          }
          stats={{
            likes: (300 - idx * 50),
            retweets: (80 - idx * 10),
            replies: (25 - idx * 5),
            views: `${(10.2 - idx * 2.1).toFixed(1)}K`
          }}
        />
      ))}
    </div>
  );
}

function SkillsFeed() {
  const { portfolioData: data } = usePortfolio();

  // Group skills into a thread
  const categories = [...new Set(data.skills.map(s => s.category))];
  
  return (
    <div>
      {categories.map((cat, idx) => (
        <Tweet 
          key={cat}
          avatar={data.personal.avatar}
          name={data.personal.name}
          handle={data.personal.name.replace(/\s+/g, '').toLowerCase()}
          time={`${idx * 5 + 10}m`}
          content={
            <div>
              My top skills in <span className="font-bold">{cat}</span> 🧵👇
              <br/><br/>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.skills.filter(s => s.category === cat).map(skill => (
                  <span key={skill.name} className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium border border-[#2f3336]">
                    {skill.name} • {skill.level}%
                  </span>
                ))}
              </div>
            </div>
          }
          stats={{
            likes: Math.floor(Math.random() * 500) + 50,
            retweets: Math.floor(Math.random() * 100) + 10,
            replies: Math.floor(Math.random() * 50) + 5
          }}
        />
      ))}
    </div>
  );
}

function TestimonialsFeed() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div>
      {data.testimonials.map((test, idx) => (
        <Tweet 
          key={test.id}
          avatar={test.avatar}
          name={test.name}
          handle={test.name.replace(/\s+/g, '').toLowerCase()}
          isVerified={true}
          isRetweet={true}
          retweeterName={data.personal.name}
          time={`${idx + 2}d`}
          content={
            <div>
              Just had the pleasure of working with <span className="text-[#1d9bf0]">@{data.personal.name.replace(/\s+/g, '').toLowerCase()}</span>.
              <br/><br/>
              "{test.text}"
              <br/><br/>
              Highly recommend them for any team! 👏
            </div>
          }
          stats={{
            likes: (800 - idx * 100),
            retweets: (150 - idx * 20),
            replies: (40 - idx * 5),
            views: `${(25.4 - idx * 5).toFixed(1)}K`
          }}
        />
      ))}
    </div>
  );
}
