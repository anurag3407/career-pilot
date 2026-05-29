import { motion } from 'framer-motion'
import { FileText, Github, Globe, PencilLine, Sparkles } from 'lucide-react'

const actions = [
  {
    label: 'From Resume',
    href: '/upload',
    icon: FileText,
    className: 'eps-primary',
  },
  {
    label: 'From GitHub',
    href: '/github-dashboard',
    icon: Github,
    className: 'eps-secondary',
  },
  {
    label: 'From Scratch',
    href: '/templates',
    icon: PencilLine,
    className: 'eps-secondary',
  },
]

export default function EmptyPortfolioState() {
  return (
    <motion.section
      className="eps-root"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <style>{`
        .eps-root {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding: 64px 24px 68px;
          border-radius: 20px;
          border: 1px solid hsl(var(--border));
          background:
            radial-gradient(circle at 50% 24%, hsl(var(--primary) / 0.18), transparent 34%),
            linear-gradient(180deg, hsl(var(--card)), hsl(var(--muted) / 0.28));
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .eps-root::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -2;
          background-image:
            linear-gradient(hsl(var(--foreground) / 0.045) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground) / 0.045) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: radial-gradient(ellipse 72% 62% at 50% 42%, black 28%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 72% 62% at 50% 42%, black 28%, transparent 100%);
        }

        .eps-root::after {
          content: '';
          position: absolute;
          inset: auto 12% -36% 12%;
          height: 54%;
          z-index: -1;
          border-radius: 999px;
          background: hsl(var(--primary) / 0.09);
          filter: blur(42px);
        }

        .eps-art {
          position: relative;
          width: 176px;
          height: 176px;
          margin-bottom: 30px;
        }

        .eps-orbit {
          position: absolute;
          inset: 13px;
          border-radius: 50%;
          border: 1px solid hsl(var(--foreground) / 0.1);
          animation: eps-spin 12s linear infinite;
        }

        .eps-orbit::before,
        .eps-orbit::after {
          content: '';
          position: absolute;
          border-radius: 999px;
          background: hsl(var(--primary));
          box-shadow: 0 0 18px hsl(var(--primary) / 0.45);
        }

        .eps-orbit::before {
          top: 10px;
          left: 20px;
          width: 10px;
          height: 10px;
        }

        .eps-orbit::after {
          right: 17px;
          bottom: 22px;
          width: 7px;
          height: 7px;
          opacity: 0.72;
        }

        .eps-globe {
          position: absolute;
          inset: 38px;
          display: grid;
          place-items: center;
          border-radius: 28px;
          color: hsl(var(--primary));
          background:
            linear-gradient(145deg, hsl(var(--background) / 0.92), hsl(var(--card))),
            hsl(var(--card));
          border: 1px solid hsl(var(--border));
          box-shadow:
            0 24px 60px hsl(var(--primary) / 0.18),
            inset 0 1px 0 hsl(var(--foreground) / 0.08);
        }

        .eps-sparkle {
          position: absolute;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: #f7c948;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          box-shadow: 0 12px 32px hsl(var(--foreground) / 0.08);
        }

        .eps-sparkle-one {
          top: 16px;
          right: 25px;
          width: 38px;
          height: 38px;
          animation: eps-float 3.4s ease-in-out infinite;
        }

        .eps-sparkle-two {
          bottom: 28px;
          left: 22px;
          width: 30px;
          height: 30px;
          animation: eps-float 3.4s -1.2s ease-in-out infinite;
        }

        .eps-title {
          margin: 0 0 10px;
          color: hsl(var(--foreground));
          font-size: 30px;
          font-weight: 800;
          line-height: 1.15;
        }

        .eps-copy {
          max-width: 470px;
          margin: 0 0 30px;
          color: hsl(var(--muted-foreground));
          font-size: 15px;
          line-height: 1.7;
        }

        .eps-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }

        .eps-action {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-radius: 12px;
          padding: 0 18px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }

        .eps-action:hover {
          transform: translateY(-2px);
        }

        .eps-primary {
          border: 1px solid hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          background: hsl(var(--primary));
          box-shadow: 0 14px 30px hsl(var(--primary) / 0.22);
        }

        .eps-secondary {
          border: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
          background: hsl(var(--background) / 0.7);
        }

        .eps-secondary:hover {
          border-color: hsl(var(--primary) / 0.42);
          background: hsl(var(--primary) / 0.08);
        }

        @keyframes eps-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes eps-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @media (max-width: 640px) {
          .eps-root {
            padding: 48px 16px 52px;
          }

          .eps-art {
            width: 146px;
            height: 146px;
            margin-bottom: 24px;
          }

          .eps-title {
            font-size: 24px;
          }

          .eps-actions {
            width: 100%;
          }

          .eps-action {
            width: 100%;
          }
        }
      `}</style>

      <div className="eps-art" aria-hidden="true">
        <div className="eps-orbit" />
        <div className="eps-globe">
          <Globe size={58} strokeWidth={1.7} />
        </div>
        <div className="eps-sparkle eps-sparkle-one">
          <Sparkles size={19} />
        </div>
        <div className="eps-sparkle eps-sparkle-two">
          <Sparkles size={15} />
        </div>
      </div>

      <h2 className="eps-title">No portfolios yet</h2>
      <p className="eps-copy">Create your first portfolio from your resume, GitHub, or LinkedIn</p>

      <div className="eps-actions" aria-label="Create portfolio options">
        {actions.map(({ label, href, icon: Icon, className }) => (
          <a key={label} href={href} className={`eps-action ${className}`}>
            <Icon size={17} />
            {label}
          </a>
        ))}
      </div>
    </motion.section>
  )
}
