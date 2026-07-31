import React from 'react';
import { Plus, Search, ArrowRight } from 'lucide-react';

const stageMessages = {
  saved: {
    emoji: '📌',
    headline: 'Nothing pinned yet',
    sub: 'Save roles that catch your eye. Build your wishlist before you apply.',
  },
  applied: {
    emoji: '✉️',
    headline: 'No applications sent',
    sub: 'Hit submit on your first application and watch this board come alive.',
  },
  interviewing: {
    emoji: '🎤',
    headline: 'No interviews lined up',
    sub: "The room is yours — you're one application away from your first interview.",
  },
  offered: {
    emoji: '🎉',
    headline: 'No offers yet — but soon',
    sub: 'Every "yes" starts somewhere. Keep pushing and this stage will fill up.',
  },
  rejected: {
    emoji: '💪',
    headline: 'Zero rejections — clean slate',
    sub: "Every great career has a few plot twists. They're just not here yet.",
  },
};

const EmptyJobState = ({ filterStatus, statusLabel }) => {
  const isAll = filterStatus === 'all';
  const current = stageMessages[filterStatus] || {};

  const glowColor = isAll
    ? 'rgba(77,150,255,0.13)'
    : filterStatus === 'offered'
    ? 'rgba(0,200,83,0.12)'
    : filterStatus === 'interviewing'
    ? 'rgba(255,217,61,0.10)'
    : filterStatus === 'rejected'
    ? 'rgba(255,61,113,0.10)'
    : 'rgba(99,87,255,0.11)';

  return (
    <div className="ejs-root">
      <style>{`
        .ejs-root {
          position: relative;
          overflow: hidden;
          padding: 72px 24px 80px;
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .ejs-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 75% 65% at 50% 50%, black 30%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 75% 65% at 50% 50%, black 30%, transparent 100%);
          opacity: 0.4;
        }

        .ejs-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 50% at 50% 38%, var(--gc) 0%, transparent 70%);
          transition: background 0.6s ease;
        }

        /* Ghost job cards */
        .ejs-ghosts { position: absolute; inset: 0; pointer-events: none; }
        .ejs-gc {
          position: absolute;
          width: 108px; border-radius: 10px;
          background: var(--muted);
          border: 1px solid var(--border);
          padding: 10px;
        }
        .ejs-gc:nth-child(1) { top: 14%; left: 2%;  animation: gcf 6s 0s    ease-in-out infinite; }
        .ejs-gc:nth-child(2) { top: 18%; right: 2%; animation: gcf 6s -2.2s ease-in-out infinite; }
        .ejs-gc:nth-child(3) { bottom: 14%; left: 4%; animation: gcf 6s -4.1s ease-in-out infinite; }
        @keyframes gcf { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .gcl { height: 6px; border-radius: 3px; background: var(--muted-foreground); opacity: 0.2; margin-bottom: 6px; }
        .gct { display: inline-block; height: 10px; width: 36px; border-radius: 4px; background: var(--primary); opacity: 0.22; }

        /* Solar system */
        .ejs-solar {
          position: relative;
          width: 168px; height: 168px;
          margin-bottom: 36px;
          animation: fup 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }

        .ejs-sun {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          width: 58px; height: 58px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #fff8d0, #ffcc00, #ff8c00);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; z-index: 10;
          animation: sunp 2.6s ease-in-out infinite;
        }
        @keyframes sunp {
          0%,100% { box-shadow: 0 0 0 6px rgba(255,200,0,0.12), 0 0 0 14px rgba(255,160,0,0.06); }
          50%      { box-shadow: 0 0 0 11px rgba(255,200,0,0.20), 0 0 0 24px rgba(255,160,0,0.08); }
        }

        .ejs-orbit {
          position: absolute;
          top: 50%; left: 50%;
          border-radius: 50%;
          border: 1px solid var(--border);
        }
        .ejs-o1 { width: 96px;  height: 96px;  margin: -48px 0 0 -48px;  animation: sp 3.2s linear infinite; }
        .ejs-o2 { width: 134px; height: 134px; margin: -67px 0 0 -67px;  animation: sp 5.5s linear infinite reverse; }
        .ejs-o3 { width: 168px; height: 168px; margin: -84px 0 0 -84px;  animation: sp 8s linear infinite; }
        @keyframes sp { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Each planet sits at top-center of its orbit track */
        .ejs-planet {
          position: absolute;
          border-radius: 50%;
          top: 0; left: 50%;
        }

        /* Blue planet on orbit 1 */
        .ejs-o1 .ejs-planet {
          width: 16px; height: 16px;
          margin: -8px 0 0 -8px;
          background: radial-gradient(circle at 35% 30%, #90c8ff, #2979ff);
          box-shadow: 0 0 10px rgba(41,121,255,0.9), 0 0 22px rgba(41,121,255,0.4);
          animation: cr1 3.2s linear infinite;
        }
        @keyframes cr1 { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }

        /* Pink planet on orbit 2 */
        .ejs-o2 .ejs-planet {
          width: 14px; height: 14px;
          margin: -7px 0 0 -7px;
          background: radial-gradient(circle at 35% 30%, #ffb3c6, #ff3d71);
          box-shadow: 0 0 10px rgba(255,61,113,0.9), 0 0 22px rgba(255,61,113,0.35);
          animation: cr2 5.5s linear infinite reverse;
        }
        @keyframes cr2 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Green planet on orbit 3 */
        .ejs-o3 .ejs-planet {
          width: 18px; height: 18px;
          margin: -9px 0 0 -9px;
          background: radial-gradient(circle at 35% 30%, #b8ffcc, #00c853);
          box-shadow: 0 0 10px rgba(0,200,83,0.9), 0 0 24px rgba(0,200,83,0.35);
          animation: cr3 8s linear infinite reverse;
        }
        @keyframes cr3 { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }

        /* Text */
        .ejs-pill {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 22px;
          padding: 5px 14px; border-radius: 999px;
          background: var(--muted);
          border: 1px solid var(--border);
          font-size: 12px; color: var(--muted-foreground);
          animation: fup 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .ejs-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--muted-foreground); opacity: 0.5; }

        .ejs-h {
          font-size: 30px; font-weight: 600;
          color: var(--foreground); margin: 0 0 14px;
          letter-spacing: -0.6px; line-height: 1.2;
          animation: fup 0.7s 0.08s cubic-bezier(0.22,1,0.36,1) both;
        }

        .ejs-p {
          font-size: 15px; color: var(--muted-foreground);
          max-width: 370px; line-height: 1.75;
          margin: 0 0 36px;
          animation: fup 0.7s 0.16s cubic-bezier(0.22,1,0.36,1) both;
        }

        /* Buttons */
        .ejs-ctas {
          display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
          animation: fup 0.7s 0.24s cubic-bezier(0.22,1,0.36,1) both;
        }

        .ejs-bp {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #4d96ff 0%, #845ef7 100%);
          color: #fff; font-size: 14px; font-weight: 600;
          border: none; border-radius: 12px; cursor: pointer;
          box-shadow: 0 4px 22px rgba(77,150,255,0.35);
          transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
          text-decoration: none;
        }
        .ejs-bp:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(77,150,255,0.5);
          filter: brightness(1.08);
        }
        .ejs-bp:active { transform: translateY(0); }

        .ejs-bg {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 12px 20px;
          background: transparent; color: var(--muted-foreground);
          font-size: 14px; font-weight: 500;
          border: 1px solid var(--border); border-radius: 12px;
          cursor: pointer; text-decoration: none;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .ejs-bg:hover {
          color: var(--foreground);
          border-color: var(--ring);
          background: var(--muted);
        }

        /* Chips */
        .ejs-chips {
          display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;
          margin-top: 28px;
          animation: fup 0.7s 0.32s cubic-bezier(0.22,1,0.36,1) both;
        }
        .ejs-chip {
          padding: 5px 13px; border-radius: 999px;
          font-size: 12px; font-weight: 500;
          color: var(--muted-foreground);
          background: var(--muted);
          border: 1px solid var(--border);
        }
        .ejs-chip b { color: var(--foreground); font-weight: 600; margin-right: 3px; }

        @keyframes fup {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .ejs-root { padding: 56px 16px 64px; }
          .ejs-gc { display: none; }
          .ejs-h { font-size: 24px; }
          .ejs-solar { width: 148px; height: 148px; }
        }
      `}</style>

      <div className="ejs-grid" />
      <div className="ejs-glow" style={{ '--gc': glowColor }} />

      {/* Ghost cards */}
      <div className="ejs-ghosts">
        {[['80%','58%'],['65%','45%'],['75%','52%']].map(([w1,w2], i) => (
          <div className="ejs-gc" key={i}>
            <div className="gcl" style={{ width: w1 }} />
            <div className="gcl" style={{ width: w2 }} />
            <div className="gct" />
          </div>
        ))}
      </div>

      {/* Filter pill */}
      {!isAll && (
        <div className="ejs-pill">
          <div className="ejs-pill-dot" />
          Filtering: {statusLabel}
        </div>
      )}

      {/* Solar system */}
      <div className="ejs-solar">
        <div className="ejs-orbit ejs-o1"><div className="ejs-planet" /></div>
        <div className="ejs-orbit ejs-o2"><div className="ejs-planet" /></div>
        <div className="ejs-orbit ejs-o3"><div className="ejs-planet" /></div>
        <div className="ejs-sun">{isAll ? '🗂️' : current.emoji}</div>
      </div>

      {/* Text */}
      <h3 className="ejs-h">
        {isAll ? 'Your pipeline is empty' : current.headline}
      </h3>
      <p className="ejs-p">
        {isAll
          ? "You haven't tracked any jobs yet. Find roles you love, add them here, and never lose track of where you stand."
          : current.sub}
      </p>

      {/* CTAs */}
      <div className="ejs-ctas">
        {isAll ? (
          <>
            <a href="/jobs" className="ejs-bp">
              <Plus size={16} />
              Find jobs
            </a>
            <a href="/jobs" className="ejs-bg">
              <Search size={14} />
              Browse roles
              <ArrowRight size={13} />
            </a>
          </>
        ) : (
          <a href="/tracker" className="ejs-bg">
            <ArrowRight size={13} />
            View all tracked jobs
          </a>
        )}
      </div>

      {/* Stat chips */}
      {isAll && (
        <div className="ejs-chips">
          <div className="ejs-chip"><b>5</b> stages to track</div>
          <div className="ejs-chip"><b>∞</b> applications</div>
          <div className="ejs-chip">Free forever</div>
        </div>
      )}
    </div>
  );
};

export default EmptyJobState;
