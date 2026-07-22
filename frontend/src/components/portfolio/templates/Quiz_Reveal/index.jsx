import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Briefcase,
  Check,
  ChevronRight,
  Code2,
  ExternalLink,
  Github,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Twitter,
  Unlock,
  UserRound,
  Zap,
} from 'lucide-react';

const sectionMeta = [
  { id: 'hero', title: 'Hero', icon: Sparkles },
  { id: 'about', title: 'About', icon: UserRound },
  { id: 'skills', title: 'Skills', icon: Code2 },
  { id: 'projects', title: 'Projects', icon: Zap },
  { id: 'experience', title: 'Experience', icon: Briefcase },
  { id: 'testimonials', title: 'Testimonials', icon: MessageCircle },
  { id: 'contact', title: 'Contact', icon: Mail },
];

const quizQuestions = [
  {
    question: 'Which technology powers most modern frontend apps?',
    options: ['React', 'Spreadsheets', 'Fax machines', 'Rotary phones'],
    answer: 'React',
  },
  {
    question: 'What does Git help developers manage?',
    options: ['Source code versions', 'Coffee temperature', 'Office chairs', 'Keyboard brightness'],
    answer: 'Source code versions',
  },
  {
    question: 'Which CSS approach is used by this portfolio template?',
    options: ['Tailwind CSS', 'Table layouts', 'Inline-only styling', 'Printed style guides'],
    answer: 'Tailwind CSS',
  },
  {
    question: 'What makes a portfolio project more convincing?',
    options: ['Clear outcomes and links', 'Hidden details', 'No context', 'Broken previews'],
    answer: 'Clear outcomes and links',
  },
  {
    question: 'What do testimonials add to a professional profile?',
    options: ['Social proof', 'Compile errors', 'Empty space', 'Random noise'],
    answer: 'Social proof',
  },
  {
    question: 'What should a visitor do after discovering great work?',
    options: ['Start a conversation', 'Close the tab', 'Forget the name', 'Ignore the links'],
    answer: 'Start a conversation',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const safeArray = (value) => (Array.isArray(value) ? value : []);

const sanitizeExternalUrl = (url) => {
  if (typeof url !== 'string') return '#';

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return '#';

  try {
    const parsedUrl = new URL(trimmedUrl);
    return ['http:', 'https:', 'mailto:'].includes(parsedUrl.protocol) ? trimmedUrl : '#';
  } catch {
    return '#';
  }
};

function GlassPanel({ children, className = '' }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className={`w-full max-w-full rounded-2xl border border-white/10 bg-white/[0.06] shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:rounded-[1.75rem] ${className}`}>
      {children}
    </div>
  );
}

function EmptyState({ label }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.04] p-5 text-sm text-slate-400">
      {label} will appear here when portfolio data is available.
    </div>
  );
}

function ProgressTracker({ unlockedCount, activeQuestion, totalQuestions }) {
  const { portfolioData: data } = usePortfolio();

  const progress = Math.round(((unlockedCount - 1) / totalQuestions) * 100);

  return (
    <GlassPanel className="z-30 p-3 sm:sticky sm:top-4 sm:p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3 lg:block">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200 sm:text-xs sm:tracking-[0.24em]">
            <Trophy className="h-4 w-4" />
            Quest Progress
            </div>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              {unlockedCount} of {sectionMeta.length} sections unlocked
            </p>
          </div>
          <div className="shrink-0 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-slate-300 sm:hidden">
            <span className="font-bold text-white">{Math.min(activeQuestion + 1, totalQuestions)}</span>
            <span className="text-slate-500">/{totalQuestions}</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 lg:max-w-xl">
          <div className="h-3 overflow-hidden rounded-full bg-slate-900 ring-1 ring-white/10">
            <Motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-emerald-300"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 90, damping: 18 }}
            />
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1 sm:gap-2">
            {sectionMeta.map((section, index) => {
              const isUnlocked = index < unlockedCount;
              const isNext = index === unlockedCount;

              return (
                <div
                  key={section.id}
                  className={`group relative flex h-9 min-w-0 flex-col items-center justify-center rounded-lg border text-[9px] font-semibold uppercase tracking-wide transition sm:h-12 sm:rounded-xl sm:text-[10px] ${
                    isUnlocked
                      ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100 shadow-lg shadow-cyan-500/10'
                      : isNext
                        ? 'border-fuchsia-300/40 bg-fuchsia-300/10 text-fuchsia-100'
                        : 'border-white/10 bg-slate-950/70 text-slate-500'
                  }`}
                >
                  {isUnlocked ? React.createElement(section.icon, { className: 'h-3.5 w-3.5 sm:h-4 sm:w-4' }) : <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  <span className="mt-1 hidden sm:block">{section.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 sm:block">
          <span className="text-slate-500">Question</span>{' '}
          <span className="font-bold text-white">{Math.min(activeQuestion + 1, totalQuestions)}</span>
          <span className="text-slate-500">/{totalQuestions}</span>
        </div>
      </div>
    </GlassPanel>
  );
}

function QuizCard({ question, questionIndex, totalQuestions, disabled, onCorrect, resetSignal }) {
  const { portfolioData: data } = usePortfolio();

  const [selected, setSelected] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const unlockTimeoutRef = useRef(null);

  const clearUnlockTimeout = useCallback(() => {
    if (unlockTimeoutRef.current) {
      window.clearTimeout(unlockTimeoutRef.current);
      unlockTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearUnlockTimeout();
    setSelected('');
    setIsCorrect(null);
  }, [clearUnlockTimeout, resetSignal]);

  useEffect(() => clearUnlockTimeout, [clearUnlockTimeout]);

  const chooseAnswer = (option) => {
    if (disabled || isCorrect === true) return;

    const correct = option === question.answer;
    setSelected(option);
    setIsCorrect(correct);

    if (correct) {
      clearUnlockTimeout();
      unlockTimeoutRef.current = window.setTimeout(() => {
        onCorrect();
        setSelected('');
        setIsCorrect(null);
        unlockTimeoutRef.current = null;
      }, 650);
    }
  };

  if (!question) {
    return (
      <GlassPanel className="overflow-hidden p-6">
        <div className="flex items-center gap-3 text-emerald-200">
          <ShieldCheck className="h-6 w-6" />
          <div>
            <h3 className="text-xl font-bold text-white">Portfolio fully unlocked</h3>
            <p className="text-sm text-slate-400">Every section is now available to explore.</p>
          </div>
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="overflow-hidden">
      <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/10 via-fuchsia-400/10 to-emerald-400/10 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100 sm:text-xs sm:tracking-[0.2em]">
            <Play className="h-3.5 w-3.5" />
            Unlock Round {questionIndex + 1}
          </div>
          <div className="text-xs font-semibold text-slate-400">
            {questionIndex + 1}/{totalQuestions}
          </div>
        </div>
        <h2 className="mt-4 text-xl font-black tracking-tight text-white sm:mt-5 sm:text-3xl">
          {question.question}
        </h2>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
        {question.options.map((option) => {
          const isSelected = selected === option;
          const showCorrect = isSelected && isCorrect === true;
          const showWrong = isSelected && isCorrect === false;

          return (
            <Motion.button
              key={option}
              type="button"
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => chooseAnswer(option)}
              className={`group flex min-h-14 items-center justify-between gap-3 rounded-2xl border p-3 text-left text-sm font-semibold transition sm:min-h-16 sm:p-4 ${
                showCorrect
                  ? 'border-emerald-300/70 bg-emerald-400/20 text-emerald-50 shadow-lg shadow-emerald-500/20'
                  : showWrong
                    ? 'border-rose-300/60 bg-rose-400/15 text-rose-100'
                    : 'border-white/10 bg-slate-950/70 text-slate-200 hover:border-cyan-300/50 hover:bg-cyan-300/10'
              }`}
            >
              <span>{option}</span>
              {showCorrect ? (
                <Check className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5 text-slate-500 transition group-hover:text-cyan-200" />
              )}
            </Motion.button>
          );
        })}
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-sm sm:px-5">
        <AnimatePresence mode="wait">
          {isCorrect === false && (
            <Motion.p
              key="wrong"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-rose-200"
            >
              Not quite. Try another answer to open the next portfolio module.
            </Motion.p>
          )}
          {isCorrect === true && (
            <Motion.p
              key="correct"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-emerald-200"
            >
              Correct. Access granted.
            </Motion.p>
          )}
          {isCorrect === null && (
            <Motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-slate-400"
            >
              Choose the best answer to reveal {sectionMeta[questionIndex + 1]?.title || 'the next section'}.
            </Motion.p>
          )}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
}

function LockedOverlay({ title }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="relative z-10 flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-4 text-center sm:min-h-40 sm:rounded-3xl sm:p-6">
      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-fuchsia-300/30 bg-fuchsia-300/10 text-fuchsia-100 shadow-lg shadow-fuchsia-500/10">
        <Lock className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-white">{title} locked</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        Answer the active quiz prompt to reveal this part of the portfolio.
      </p>
    </div>
  );
}

function RevealSection({ id, title, icon: Icon, index, unlocked, children }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <Motion.section
      id={id}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.04 }}
      className="relative"
    >
      <GlassPanel className={`relative overflow-hidden p-4 sm:p-7 ${unlocked ? '' : 'min-h-48 sm:min-h-56'}`}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6 sm:gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl border sm:h-11 sm:w-11 ${unlocked ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-slate-950 text-slate-500'}`}>
              {unlocked ? React.createElement(Icon, { className: 'h-5 w-5' }) : <Lock className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:text-xs sm:tracking-[0.24em]">Level {index + 1}</p>
              <h2 className="truncate text-xl font-black text-white sm:text-3xl">{title}</h2>
            </div>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest sm:text-xs ${unlocked ? 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100' : 'border-white/10 bg-slate-900 text-slate-500'}`}>
            {unlocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
            {unlocked ? 'Unlocked' : 'Locked'}
          </span>
        </div>

        {unlocked ? (
          <Motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {children}
          </Motion.div>
        ) : (
          <LockedOverlay title={title} />
        )}
      </GlassPanel>
    </Motion.section>
  );
}

function StatTile({ value, label }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-center">
      <div className="text-xl font-black text-white">{value ?? '0'}+</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

function Hero({ personal, stats }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100 sm:px-4 sm:text-xs sm:tracking-[0.24em]">
          <Sparkles className="h-4 w-4" />
          Quiz Reveal Portfolio
        </div>
        <h1 className="mt-5 break-words text-4xl font-black tracking-tight text-white sm:mt-6 sm:text-6xl lg:text-7xl">
          {personal?.name || 'Portfolio Name'}
        </h1>
        <p className="mt-4 max-w-2xl text-lg font-semibold text-cyan-100 sm:text-2xl">
          {personal?.title || 'Creative Professional'}
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:mt-5 sm:text-base sm:leading-8">
          {personal?.tagline || personal?.bio || 'A polished portfolio experience is ready to be unlocked.'}
        </p>
        {personal?.location && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
            <MapPin className="h-4 w-4 text-fuchsia-200" />
            {personal.location}
          </div>
        )}
      </div>

      <div className="relative mx-auto w-full max-w-xs sm:max-w-sm">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-cyan-400/30 via-fuchsia-400/20 to-emerald-300/20 blur-3xl" />
        <div className="relative rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-cyan-950/40">
          {personal?.avatar ? (
            <img
              src={personal.avatar}
              alt={personal?.name || 'Portfolio avatar'}
              className="aspect-square w-full rounded-[1.5rem] object-cover"
            />
          ) : (
            <div className="grid aspect-square w-full place-items-center rounded-[1.5rem] bg-slate-900 text-slate-500">
              <UserRound className="h-20 w-20" />
            </div>
          )}
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            <StatTile value={stats?.yearsExperience} label="Years" />
            <StatTile value={stats?.projectsCompleted} label="Projects" />
            <StatTile value={stats?.happyClients} label="Clients" />
          </div>
        </div>
      </div>
    </div>
  );
}

function About({ personal }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="grid gap-5 md:grid-cols-[0.85fr_1.15fr] md:items-center">
      {personal?.avatar ? (
        <img
          src={personal.avatar}
          alt={personal?.name || 'Portfolio avatar'}
          className="mx-auto aspect-[4/5] w-full max-w-xs rounded-3xl object-cover ring-1 ring-white/10 md:max-w-none"
        />
      ) : (
        <div className="grid aspect-[4/5] w-full place-items-center rounded-3xl bg-slate-950 text-slate-500 ring-1 ring-white/10">
          <UserRound className="h-16 w-16" />
        </div>
      )}
      <div className="space-y-5">
        <p className="text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
          {personal?.bio || 'No biography has been added yet.'}
        </p>
        <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-100">Signal</p>
          <p className="mt-2 text-lg font-black text-white sm:text-xl">
            {personal?.tagline || 'Building thoughtful digital products.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function Skills({ skills }) {
  const { portfolioData: data } = usePortfolio();

  if (!skills.length) return <EmptyState label="Skills" />;

  const grouped = skills.reduce((acc, skill) => {
    const category = skill.category || 'Core';
    acc[category] = [...(acc[category] || []), skill];
    return acc;
  }, {});

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 sm:rounded-3xl sm:p-5">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-white">
            <Star className="h-5 w-5 text-fuchsia-200" />
            {category}
          </h3>
          <div className="space-y-4">
            {items.map((skill) => (
              <div key={`${category}-${skill.name}`}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-200">{skill.name}</span>
                  <span className="text-cyan-200">{skill.level ?? 0}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-900">
                  <Motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-300"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level ?? 0}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Projects({ projects }) {
  const { portfolioData: data } = usePortfolio();

  if (!projects.length) return <EmptyState label="Projects" />;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {projects.map((project, index) => (
        <ProjectCard key={`${project.title}-${index}`} project={project} index={index} />
      ))}
    </div>
  );
}

function ProjectCard({ project, index }) {
  const { portfolioData: data } = usePortfolio();

  const liveUrl = sanitizeExternalUrl(project.liveUrl);
  const githubUrl = sanitizeExternalUrl(project.githubUrl);

  return (
    <Motion.article
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 sm:rounded-3xl"
    >
      {project.image ? (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={project.image}
            alt={project.title || `Project ${index + 1}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        </div>
      ) : (
        <div className="grid aspect-video place-items-center bg-slate-900 text-slate-500">
          <Code2 className="h-12 w-12" />
        </div>
      )}
      <div className="p-4 sm:p-5">
        <h3 className="text-xl font-black text-white">{project.title || 'Untitled Project'}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
          {project.description || 'Project details are coming soon.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {safeArray(project.techStack).map((tech) => (
            <span key={tech} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a href={liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-100">
              Live <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {project.githubUrl && (
            <a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white transition hover:border-fuchsia-200 hover:bg-fuchsia-300/10">
              Code <Github className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </Motion.article>
  );
}

function Experience({ experience }) {
  const { portfolioData: data } = usePortfolio();

  if (!experience.length) return <EmptyState label="Experience" />;

  return (
    <div className="relative space-y-4">
      <div className="absolute bottom-6 left-5 top-6 hidden w-px bg-gradient-to-b from-cyan-300 via-fuchsia-300 to-emerald-300 sm:block" />
      {experience.map((item, index) => (
        <div key={`${item.company}-${item.role}-${index}`} className="relative rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:ml-12 sm:rounded-3xl sm:p-5">
          <div className="absolute -left-[3.25rem] top-6 hidden h-5 w-5 rounded-full border-4 border-slate-950 bg-cyan-300 shadow-lg shadow-cyan-300/30 sm:block" />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-black text-white">{item.role || 'Role'}</h3>
              <p className="font-semibold text-cyan-100">{item.company || 'Company'}</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-300">
              {item.period || 'Timeline'}
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">{item.description || 'Experience details are coming soon.'}</p>
        </div>
      ))}
    </div>
  );
}

function Testimonials({ testimonials }) {
  const { portfolioData: data } = usePortfolio();

  if (!testimonials.length) return <EmptyState label="Testimonials" />;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {testimonials.map((testimonial, index) => (
        <Motion.figure
          key={`${testimonial.name}-${index}`}
          whileHover={{ y: -5 }}
          className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:rounded-3xl sm:p-5"
        >
          <div className="flex items-center gap-4">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.name || 'Testimonial avatar'}
                className="h-14 w-14 rounded-2xl object-cover"
              />
            ) : (
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-900 text-slate-500">
                <UserRound className="h-6 w-6" />
              </div>
            )}
            <figcaption>
              <h3 className="font-black text-white">{testimonial.name || 'Anonymous'}</h3>
              <p className="text-sm text-cyan-100">{testimonial.role || 'Collaborator'}</p>
            </figcaption>
          </div>
          <blockquote className="mt-5 text-sm leading-7 text-slate-300">
            "{testimonial.text || 'No testimonial text has been added yet.'}"
          </blockquote>
        </Motion.figure>
      ))}
    </div>
  );
}

function Contact({ personal, socials }) {
  const { portfolioData: data } = usePortfolio();

  const links = [
    { label: 'Email', value: socials?.email, href: sanitizeExternalUrl(socials?.email ? `mailto:${socials.email}` : ''), icon: Mail },
    { label: 'GitHub', value: socials?.github, href: sanitizeExternalUrl(socials?.github), icon: Github },
    { label: 'LinkedIn', value: socials?.linkedin, href: sanitizeExternalUrl(socials?.linkedin), icon: Linkedin },
    { label: 'Twitter', value: socials?.twitter, href: sanitizeExternalUrl(socials?.twitter), icon: Twitter },
  ].filter((link) => link.value);

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 p-5 sm:rounded-3xl sm:p-6">
        <Award className="h-10 w-10 text-fuchsia-100" />
        <h3 className="mt-4 text-2xl font-black text-white sm:text-3xl">Final level cleared.</h3>
        <p className="mt-3 text-slate-300">
          Connect with {personal?.name || 'this portfolio owner'} and turn the unlocked story into a real conversation.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {links.length ? links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.label === 'Email' ? undefined : '_blank'}
            rel={link.label === 'Email' ? undefined : 'noreferrer'}
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
          >
            <span className="flex items-center gap-3 font-bold text-white">
              {React.createElement(link.icon, { className: 'h-5 w-5 text-cyan-100' })}
              {link.label}
            </span>
            <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-100" />
          </a>
        )) : <EmptyState label="Contact links" />}
      </div>
    </div>
  );
}

export default function QuizReveal() {
  const { portfolioData: data } = usePortfolio();

  const portfolio = data || {};
  const personal = portfolio.personal || {};
  const socials = portfolio.socials || {};
  const stats = portfolio.stats || {};
  const skills = safeArray(portfolio.skills);
  const projects = safeArray(portfolio.projects);
  const experience = safeArray(portfolio.experience);
  const testimonials = safeArray(portfolio.testimonials);

  const [unlockedCount, setUnlockedCount] = useState(1);
  const [resetSignal, setResetSignal] = useState(0);
  const currentQuestionIndex = Math.min(unlockedCount - 1, quizQuestions.length);
  const isComplete = unlockedCount === sectionMeta.length;

  const unlockNext = () => {
    setUnlockedCount((count) => Math.min(count + 1, sectionMeta.length));
  };

  const resetQuest = () => {
    setResetSignal((signal) => signal + 1);
    setUnlockedCount(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'hero':
        return <Hero personal={personal} stats={stats} />;
      case 'about':
        return <About personal={personal} />;
      case 'skills':
        return <Skills skills={skills} />;
      case 'projects':
        return <Projects projects={projects} />;
      case 'experience':
        return <Experience experience={experience} />;
      case 'testimonials':
        return <Testimonials testimonials={testimonials} />;
      case 'contact':
        return <Contact personal={personal} socials={socials} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030712] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-24 left-0 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-5 px-3 py-4 sm:gap-8 sm:px-6 sm:py-6 lg:px-8">
        <ProgressTracker
          unlockedCount={unlockedCount}
          activeQuestion={currentQuestionIndex}
          totalQuestions={quizQuestions.length}
        />

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_390px] xl:items-start xl:gap-8">
          <div className="order-2 min-w-0 space-y-5 sm:space-y-8 xl:order-1">
            {sectionMeta.map((section, index) => (
              <RevealSection
                key={section.id}
                id={section.id}
                title={section.title}
                icon={section.icon}
                index={index}
                unlocked={index < unlockedCount}
              >
                {renderSectionContent(section.id)}
              </RevealSection>
            ))}
          </div>

          <aside className="order-1 min-w-0 xl:order-2 xl:sticky xl:top-36">
            <AnimatePresence mode="wait">
              <Motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 24, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -24, scale: 0.98 }}
                transition={{ duration: 0.35 }}
              >
                <QuizCard
                  question={quizQuestions[currentQuestionIndex]}
                  questionIndex={currentQuestionIndex}
                  totalQuestions={quizQuestions.length}
                  disabled={isComplete}
                  onCorrect={unlockNext}
                  resetSignal={resetSignal}
                />
              </Motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={resetQuest}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-fuchsia-300/40 hover:bg-fuchsia-300/10"
            >
              <RotateCcw className="h-4 w-4" />
              Restart quest
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
