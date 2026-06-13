import { useState } from "react";
import { enhanceApi } from "../../services/api";
import { toast } from "react-hot-toast";

export default function AchievementEnhancer({
  value,
  jobRole,
  onApply
}) {
  const [loading, setLoading] = useState(false);

  const handleEnhance = async () => {
    if (!value || !value.trim()) {
      toast.error("Please enter some achievement description to enhance.");
      return;
    }
    setLoading(true);
    try {
      const response = await enhanceApi.enhance(value, {
        jobRole: jobRole || "Software Engineer",
        customInstructions: "Enhance this specific achievement bullet point. Make it professional, use strong action verbs, and add realistic quantified impact metrics if missing. Keep the output strictly as enhanced bullet points."
      });
      if (response.success && response.data?.enhancedResume) {
        onApply(response.data.enhancedResume.trim());
        toast.success("Achievement enhanced!");
      } else {
        toast.error("Failed to enhance achievement.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error enhancing achievement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleEnhance}
        disabled={loading}
        className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 cursor-pointer"
      >
        {loading ? "Enhancing..." : "✨ Enhance Achievement"}
      </button>
    </div>
  );
}