const SkeletonCard = () => {
  return (
    <div className="animate-pulse rounded-xl border p-4 shadow-md">
      <div className="mb-4 h-6 w-3/4 rounded bg-gray-300"></div>
      <div className="mb-2 h-4 w-full rounded bg-gray-300"></div>
      <div className="h-4 w-5/6 rounded bg-gray-300"></div>
    </div>
  );
};

export default SkeletonCard;