/**
 * GitHubSkeleton - Loading skeleton for GitHub dashboard
 * Shows animated placeholder cards while data is loading
 * Layout: Profile card + Stats bar + Repo grid
 */

const SkeletonBlock = ({ className = '' }) => (
  <div
    className={`bg-gray-200 dark:bg-gray-700 rounded ${className}`}
  />
);

const ProfileCardSkeleton = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm flex flex-col items-center gap-4">
    <SkeletonBlock className="w-24 h-24 rounded-full" />
    <SkeletonBlock className="h-5 w-36" />
    <SkeletonBlock className="h-4 w-24" />
    <div className="w-full flex flex-col gap-2">
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-3 w-4/5 mx-auto" />
    </div>
    <SkeletonBlock className="h-9 w-32 rounded-lg" />
  </div>
);

const StatCardSkeleton = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col gap-2">
    <SkeletonBlock className="h-4 w-16" />
    <SkeletonBlock className="h-7 w-10" />
  </div>
);

const RepoCardSkeleton = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm flex flex-col gap-3">
    <SkeletonBlock className="h-5 w-3/4" />
    <div className="flex flex-col gap-2">
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-3 w-5/6" />
    </div>
    <div className="flex gap-3 mt-auto">
      <SkeletonBlock className="h-4 w-16 rounded-full" />
      <SkeletonBlock className="h-4 w-12 rounded-full" />
      <SkeletonBlock className="h-4 w-12 rounded-full" />
    </div>
  </div>
);

const GitHubSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">

      <div className="max-w-xs mx-auto w-full">
        <ProfileCardSkeleton />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div>
        <SkeletonBlock className="h-5 w-40 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <RepoCardSkeleton key={i} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default GitHubSkeleton;