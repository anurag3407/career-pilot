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

  return (
    <div className="bg-card border border-border rounded-2xl relative overflow-hidden py-16 px-6 flex flex-col items-center text-center">
      {/* Filter pill */}
      {!isAll && (
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-muted border border-border text-xs text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
          Filtering: {statusLabel}
        </div>
      )}

      {/* Emoji / Icon */}
      <div className="text-5xl mb-6 flex items-center justify-center w-20 h-20 bg-muted/50 rounded-full border border-border">
        {isAll ? '🗂️' : current.emoji}
      </div>

      {/* Text */}
      <h3 className="text-2xl font-semibold text-foreground mb-3 tracking-tight">
        {isAll ? 'Your pipeline is empty' : current.headline}
      </h3>
      <p className="text-muted-foreground max-w-[370px] leading-relaxed mb-8 text-[15px]">
        {isAll
          ? "You haven't tracked any jobs yet. Find roles you love, add them here, and never lose track of where you stand."
          : current.sub}
      </p>

      {/* CTAs */}
      <div className="flex gap-3 flex-wrap justify-center">
        {isAll ? (
          <>
            <a href="/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors">
              <Plus size={16} />
              Find jobs
            </a>
            <a href="/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-background text-foreground border border-border text-sm font-medium rounded-xl hover:bg-muted transition-colors">
              <Search size={14} />
              Browse roles
              <ArrowRight size={13} />
            </a>
          </>
        ) : (
          <a href="/tracker" className="inline-flex items-center gap-2 px-5 py-2.5 bg-background text-foreground border border-border text-sm font-medium rounded-xl hover:bg-muted transition-colors">
            <ArrowRight size={13} />
            View all tracked jobs
          </a>
        )}
      </div>

      {/* Stat chips */}
      {isAll && (
        <div className="flex gap-2 flex-wrap justify-center mt-8">
          <div className="px-3 py-1 rounded-full text-xs font-medium text-muted-foreground bg-muted/50 border border-border">
            <strong className="text-foreground font-semibold mr-1">5</strong> stages to track
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-medium text-muted-foreground bg-muted/50 border border-border">
            <strong className="text-foreground font-semibold mr-1">∞</strong> applications
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-medium text-muted-foreground bg-muted/50 border border-border">
            Free forever
          </div>
        </div>
      )}
    </div>
  );
};

export default EmptyJobState;