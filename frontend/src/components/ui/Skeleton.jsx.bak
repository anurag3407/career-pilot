/**
 * Reusable Skeleton UI primitives.
 * Use animate-pulse for all skeleton shapes — never animate-spin.
 */

/** Base rectangular block */
export function SkeletonBlock({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-lg bg-muted-foreground/15 ${className}`} />
  )
}

/** Circular skeleton (avatars, icons) */
export function SkeletonCircle({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-full bg-muted-foreground/15 ${className}`} />
  )
}

/** Multiple text lines of varying width */
export function SkeletonText({ lines = 3, className = '' }) {
  const widths = ['w-3/4', 'w-full', 'w-2/3', 'w-5/6', 'w-1/2']
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse h-3 rounded bg-muted-foreground/15 ${widths[i % widths.length]}`}
        />
      ))}
    </div>
  )
}

/** Card skeleton: avatar + text lines + optional footer */
export function SkeletonCard({ className = '' }) {
  return (
    <div className={`rounded-xl bg-card border border-border p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <SkeletonCircle className="w-10 h-10 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-1/3" />
          <SkeletonBlock className="h-3 w-1/4" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  )
}

/** Row skeleton for lists / tables */
export function SkeletonRow({ className = '' }) {
  return (
    <div className={`flex items-center gap-4 p-5 ${className}`}>
      <SkeletonCircle className="w-9 h-9 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonBlock className="h-4 w-2/5" />
        <SkeletonBlock className="h-3 w-1/4" />
      </div>
      <SkeletonBlock className="h-6 w-20 rounded-xl" />
    </div>
  )
}

/** Stat card skeleton (icon + number + label) */
export function SkeletonStat({ className = '' }) {
  return (
    <div className={`p-6 rounded-2xl bg-card border border-border text-center ${className}`}>
      <SkeletonCircle className="w-12 h-12 mx-auto mb-4" />
      <SkeletonBlock className="h-8 w-12 mx-auto mb-2 rounded" />
      <SkeletonBlock className="h-3 w-16 mx-auto rounded" />
    </div>
  )
}

/** Action card skeleton (icon + title + subtitle) */
export function SkeletonAction({ className = '' }) {
  return (
    <div className={`p-5 rounded-2xl bg-card border border-border ${className}`}>
      <SkeletonCircle className="w-12 h-12 mb-4" />
      <SkeletonBlock className="h-4 w-3/4 mb-2" />
      <SkeletonBlock className="h-3 w-1/2" />
    </div>
  )
}

/** Job card skeleton */
export function SkeletonJobCard({ className = '' }) {
  return (
    <div className={`p-6 rounded-xl bg-background/50 border border-border ${className}`}>
      <div className="flex gap-4">
        <SkeletonBlock className="w-14 h-14 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-5 w-2/5" />
          <SkeletonBlock className="h-4 w-1/4" />
          <div className="flex gap-4 mt-3">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-3 w-16" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
          <SkeletonText lines={2} className="mt-2" />
          <div className="flex gap-2 mt-2">
          {['w-16', 'w-20', 'w-14'].map((width, i) => (
  <SkeletonBlock
    key={i}
    className={`h-6 ${width} rounded-md`}
  />
))}
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border flex justify-end">
        <SkeletonBlock className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  )
}

/** Resume row skeleton */
export function SkeletonResumeRow({ className = '' }) {
  return (
    <div className={`flex items-center justify-between p-5 ${className}`}>
      <div className="flex-1 space-y-2">
        <SkeletonBlock className="h-5 w-2/5" />
        <SkeletonBlock className="h-3 w-1/3" />
      </div>
      <div className="flex gap-2">
        <SkeletonBlock className="h-8 w-16 rounded-lg" />
        <SkeletonBlock className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}

/** Full-page resume view skeleton */
export function SkeletonResumeView({ className = '' }) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div className="space-y-2">
            <SkeletonBlock className="h-8 w-56" />
            <SkeletonBlock className="h-4 w-36" />
            <SkeletonBlock className="h-3 w-48" />
          </div>
          <div className="flex gap-2">
            <SkeletonBlock className="h-10 w-28 rounded-lg" />
            <SkeletonBlock className="h-10 w-36 rounded-lg" />
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex gap-8 border-b border-border mb-6 pb-4">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-4 w-24" />
        </div>

        {/* Content card */}
        <div className="rounded-xl bg-card border border-border p-6">
          <div className="flex justify-between items-center mb-4">
            <SkeletonBlock className="h-5 w-40" />
            <div className="flex gap-2">
              <SkeletonBlock className="h-9 w-32 rounded-lg" />
              <SkeletonBlock className="h-9 w-36 rounded-lg" />
            </div>
          </div>
          <div className="space-y-3 min-h-96">
            <SkeletonBlock className="h-6 w-1/2 mx-auto" />
            <SkeletonBlock className="h-px w-full" />
            {[...Array(6)].map((_, i) => (
              <SkeletonText key={i} lines={2} className="mt-4" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Comment list skeleton */
export function SkeletonCommentList({ count = 3, className = '' }) {
  return (
    <div className={`px-4 divide-y divide-border ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 py-3">
          <SkeletonCircle className="w-8 h-8 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-3 w-16" />
            </div>
            <SkeletonText lines={2} />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Full-page Profile skeleton */
export function SkeletonProfile({ className = '' }) {
  return (
    <div className={`min-h-screen bg-black ${className}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile Header */}
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <SkeletonCircle className="w-20 h-20 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-3 w-full">
              <SkeletonBlock className="h-7 w-48" />
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-4 w-24" />
            </div>
            <SkeletonBlock className="h-9 w-28 rounded-lg self-start" />
          </div>
          <div className="mt-5 pt-5 border-t border-zinc-800">
            <SkeletonText lines={2} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5">
            <SkeletonCircle className="w-10 h-10 mx-auto mb-2 rounded-xl" />
            <SkeletonBlock className="h-8 w-16 mx-auto mb-1" />
            <SkeletonBlock className="h-3 w-24 mx-auto" />
          </div>
          <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5">
            <SkeletonCircle className="w-10 h-10 mx-auto mb-2 rounded-xl" />
            <SkeletonBlock className="h-8 w-16 mx-auto mb-1" />
            <SkeletonBlock className="h-3 w-24 mx-auto" />
          </div>
        </div>

        {/* Activity feed */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <SkeletonBlock className="h-6 w-32" />
          </div>
          <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 divide-y divide-zinc-800">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 space-y-2">
                <SkeletonBlock className="h-4 w-1/3" />
                <SkeletonBlock className="h-3 w-3/4" />
                <div className="flex gap-4 mt-2">
                  <SkeletonBlock className="h-3 w-16" />
                  <SkeletonBlock className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Job Tracker skeleton */
export function SkeletonTracker({ className = '' }) {
  return (
    <div className={`min-h-screen bg-background py-8 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <SkeletonBlock className="h-10 w-64" />
          <SkeletonBlock className="h-5 w-80" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="p-6 bg-background/50 border border-border rounded-xl">
              <SkeletonBlock className="h-4 w-16 mb-2" />
              <SkeletonBlock className="h-8 w-12" />
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
       {['w-20', 'w-24', 'w-32', 'w-28', 'w-24'].map((width, i) => (
  <SkeletonBlock
    key={i}
    className={`h-10 ${width} rounded-lg`}
  />
))}
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-6 bg-background/50 border border-border rounded-xl flex flex-col lg:flex-row gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <SkeletonBlock className="h-6 w-48" />
                    <SkeletonBlock className="h-4 w-32" />
                  </div>
                  <SkeletonBlock className="h-6 w-24 rounded-full" />
                </div>
                <div className="flex gap-4">
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="h-4 w-24" />
                </div>
              </div>
              <div className="lg:w-48 space-y-2">
                <SkeletonBlock className="h-10 w-full rounded-lg" />
                <div className="flex gap-2">
                  <SkeletonBlock className="h-10 flex-1 rounded-lg" />
                  <SkeletonBlock className="h-10 w-10 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Settings page skeleton */
export function SkeletonSettings({ className = '' }) {
  return (
    <div className={`max-w-2xl mx-auto px-4 py-8 ${className}`}>
      {/* Header */}
      <div className="mb-8 space-y-2">
        <SkeletonBlock className="h-8 w-48" />
        <SkeletonBlock className="h-4 w-72" />
      </div>

      {/* Settings Card */}
      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-start gap-4">
            <SkeletonCircle className="w-10 h-10 flex-shrink-0 rounded-xl" />
            <div className="space-y-2">
              <SkeletonBlock className="h-5 w-48" />
              <SkeletonBlock className="h-4 w-64" />
            </div>
          </div>
          <SkeletonBlock className="h-6 w-20 rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[1, 2, 3].map(i => (
            <SkeletonBlock key={i} className="h-10 rounded-lg" />
          ))}
        </div>
        <SkeletonBlock className="h-10 w-48 rounded-lg" />
      </div>
    </div>
}

// ============ Generic Skeleton Base ============
export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-shimmer rounded-md bg-foreground/10 ${className}`}
      style={{
        animationDuration: '2s'
      }}
    />
  );
}

// ============ Basic Skeleton Layouts ============
export function SkeletonList({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4 space-y-2"
          >
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-8 w-1/3" />
          </div>
        ))}
      </div>
      {/* Content */}
      <SkeletonList count={3} />
    </div>
  );
}

// ============ Stat Card Skeleton ============
export function SkeletonStatCard() {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-8 w-2/3" />
    </div>
  );
}

export function SkeletonStatCards({ count = 5 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonJobList({ count = 5 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonJobCard key={i} />
      ))}
    </div>
  );
}

// ============ Challenge Card Skeleton ============
export function SkeletonChallengeCard() {
  return (
    <div className="bg-background border border-border rounded-2xl p-5 space-y-3">
      <div className="flex justify-between items-start">
        <Skeleton className="h-4 w-20 rounded-lg" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-12 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export function SkeletonChallengeGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonChallengeCard key={i} />
      ))}
    </div>
  );
}

// ============ Post/Message Skeleton ============
export function SkeletonPost() {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-2 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

export function SkeletonPostList({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonPost key={i} />
      ))}
    </div>
  );
}

// ============ Dashboard Quick Actions Skeleton ============
export function SkeletonDashboardActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl bg-card border border-border space-y-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-2 w-1/2" />
        </div>
      ))}
    </div>
  );
}

// ============ List Item Skeleton ============
export function SkeletonListItem() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
        </div>
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonListItems({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonListItem key={i} />
      ))}
    </div>
  );
}

// ============ Page Skeletons ============
export function SkeletonPage({ width = "max-w-6xl", rows = 4, className = "" }) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <div className={`${width} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
        <div className="space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-2/3 max-w-xl" />
            <Skeleton className="h-4 w-1/2 max-w-md" />
          </div>
          <SkeletonList count={rows} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonPanel({ rows = 3, className = "" }) {
  return (
    <div className={`space-y-4 ${className}`}>
      <Skeleton className="h-8 w-1/3 max-w-xs" />
      <SkeletonList count={rows} />
    </div>
  );
}
