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
export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

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

// ============ Job Card Skeleton ============
export function SkeletonJobCard() {
  return (
    <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="flex gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
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
