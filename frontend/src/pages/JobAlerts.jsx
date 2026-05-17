import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Plus,
  Search,
  Briefcase,
  MapPin,
  Mail,
  ExternalLink,
  Loader2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { jobAlertsApi, jobsApi } from "../services/api";
import { JobAlertModal, JobAlertsList } from "../components";

export default function JobAlerts() {
  const [activeTab, setActiveTab] = useState("alerts"); // 'alerts' | 'search' | 'matches'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const hoverBorderClassMap = {
    indigo: "hover:border-indigo-500/30",
    green: "hover:border-green-500/30",
    purple: "hover:border-purple-500/30",
    blue: "hover:border-blue-500/30",
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await jobAlertsApi.getStats();
      setStats(response.stats);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const response = await jobsApi.search(searchQuery);
      // API returns data in response.data, not response.jobs
      const jobs = response.data || response.jobs || [];
      setSearchResults(jobs);
      if (jobs.length === 0) {
        toast("No jobs found for this search", { icon: "📭" });
      }
    } catch (err) {
      toast.error(err.message || "Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCreateAlertFromSearch = () => {
    // Pre-fill modal with search query
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <div className="relative pt-8 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-4">
                <Zap className="w-4 h-4" />
                Automated Job Notifications
              </div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <Bell className="w-10 h-10 text-purple-400" />
                Job Alerts
              </h1>
              <p className="mt-3 text-neutral-400 max-w-xl">
                Set up personalized job alerts and never miss an opportunity.
                We'll email you when new jobs match your criteria.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-200 transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Create Alert
            </button>
          </div>

          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-4 gap-4">
              {[
                {
                  value: stats.totalAlerts || 0,
                  label: "Total Alerts",
                  color: "indigo",
                },
                {
                  value: stats.activeAlerts || 0,
                  label: "Active Alerts",
                  color: "green",
                },
                {
                  value: stats.totalJobsFound || 0,
                  label: "Jobs Found",
                  color: "purple",
                },
                {
                  value: stats.totalEmailsSent || 0,
                  label: "Emails Sent",
                  color: "blue",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 ${hoverBorderClassMap[stat.color] || "hover:border-neutral-700"} transition-colors`}
                >
                  <div className={`text-3xl font-bold text-white`}>
                    {stat.value}
                  </div>
                  <div className="text-neutral-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="flex gap-2">
          {[{ id: "alerts", label: "My Alerts", icon: Bell }].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-neutral-900 text-white border border-neutral-800 border-b-transparent"
                  : "bg-neutral-800/50 text-neutral-400 hover:text-white border border-transparent"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-neutral-900 border border-neutral-800 border-t-0 rounded-b-xl rounded-tr-xl p-6">
          {activeTab === "alerts" && <JobAlertsList />}

          {activeTab === "search" && (
            <div className="space-y-6">
              {/* Search Form */}
              <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search jobs by title, skills, or company..."
                      className="w-full pl-12 pr-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={searchLoading}
                    className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {searchLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                    Search
                  </button>
                </form>

                {searchQuery && !searchLoading && (
                  <div className="mt-4 pt-4 border-t border-neutral-700 flex items-center justify-between">
                    <p className="text-sm text-neutral-500">
                      Want to get notified about "{searchQuery}" jobs?
                    </p>
                    <button
                      onClick={handleCreateAlertFromSearch}
                      className="text-sm text-indigo-400 font-medium hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      Create Alert
                    </button>
                  </div>
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Search Results ({searchResults.length} jobs)
                  </h3>
                  {searchResults.map((job, index) => (
                    <JobCard key={job.id || index} job={job} index={index} />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!searchLoading && searchResults.length === 0 && !searchQuery && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-neutral-600" />
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    Search for Jobs
                  </h3>
                  <p className="text-neutral-500 mt-2 max-w-md mx-auto">
                    Enter a job title, skill, or company name to find matching
                    opportunities. You can then create an alert to get notified
                    about new matches.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <JobAlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchStats}
      />
    </div>
  );
}

// Job Card Component
function JobCard({ job, index }) {
  const handleApply = () => {
    if (job.applyLink) {
      window.open(job.applyLink, "_blank");
    }
  };

  const handleEmail = () => {
    if (job.recruiterEmail) {
      window.location.href = `mailto:${job.recruiterEmail}?subject=Application for ${job.title}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-neutral-800/50 rounded-xl border border-neutral-700 p-5 hover:border-indigo-500/30 transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Company Logo or Initial */}
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {job.company?.charAt(0) || "J"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs text-neutral-600 font-medium">
                #{index + 1}
              </span>
              <h3 className="font-semibold text-white text-lg">{job.title}</h3>
              <p className="text-indigo-400 font-medium">{job.company}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-shrink-0">
              {job.applyLink && (
                <button
                  onClick={handleApply}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors text-sm cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  Apply
                </button>
              )}
              {job.recruiterEmail && (
                <button
                  onClick={handleEmail}
                  className="flex items-center gap-1.5 px-4 py-2 bg-neutral-700 text-white rounded-lg font-medium hover:bg-neutral-600 transition-colors text-sm cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-neutral-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location || "Remote"}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {job.employmentType || "Full-time"}
            </span>
            {job.salary?.min != null && (
              <span className="text-green-400 font-medium">
                ₹{job.salary.min.toLocaleString("en-IN")}
                {job.salary.max != null
                  ? ` - ₹${job.salary.max.toLocaleString("en-IN")}`
                  : "+"}{" "}
                / {job.salary.period || "year"}
              </span>
            )}
          </div>

          {job.description && (
            <p className="mt-3 text-neutral-400 text-sm line-clamp-2">
              {job.description.length > 200
                ? `${job.description.substring(0, 200)}...`
                : job.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
