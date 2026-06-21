import { useState } from "react";

export default function AchievementEnhancer({
  value,
  jobRole,
  onApply
}) {
  const [loading, setLoading] = useState(false);

  const handleEnhance = async () => {
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleEnhance}
        className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        {loading ? "Enhancing..." : "✨ Enhance Achievement"}
      </button>
    </div>
  );
}