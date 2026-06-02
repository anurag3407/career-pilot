const SkeletonBlock = ({ className = '' }) => (
  <div
    className={`bg-muted rounded ${className}`}
  />
);

const GaugeSkeleton = () => (
  <div className="animate-pulse bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center gap-4">
    <SkeletonBlock className="w-32 h-32 rounded-full" />
    <SkeletonBlock className="h-5 w-40" />
  </div>
);

const TechStackSkeleton = () => (
  <div className="animate-pulse bg-card border border-border rounded-2xl p-6 shadow-sm">
    <SkeletonBlock className="h-5 w-40 mb-6" />

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonBlock
          key={i}
          className="h-20 rounded-xl"
        />
      ))}
    </div>
  </div>
);

const HeatmapSkeleton = () => (
  <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
    <SkeletonBlock className="h-5 w-36 mb-6" />

    <div className="grid grid-cols-12 gap-2">
      {Array.from({ length: 72 }).map((_, i) => (
        <SkeletonBlock
          key={i}
          className="w-4 h-4 rounded-sm"
        />
      ))}
    </div>
  </div>
);

const ContributorsSkeleton = () => (
  <div className="animate-pulse bg-card border border-border rounded-2xl p-6 shadow-sm">
    <SkeletonBlock className="h-5 w-44 mb-6" />

    <div className="flex gap-3 flex-wrap">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonBlock
          key={i}
          className="w-12 h-12 rounded-full"
        />
      ))}
    </div>
  </div>
);

const AnalysisSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">

      <GaugeSkeleton />

      <TechStackSkeleton />

      <HeatmapSkeleton />

      <ContributorsSkeleton />

    </div>
  );
};

export default AnalysisSkeleton;