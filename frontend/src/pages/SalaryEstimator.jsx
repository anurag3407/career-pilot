import React, { useState } from 'react';
import { Briefcase, MapPin, Star, TrendingUp, DollarSign, Search, List, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { enhanceApi } from '../services/api';
import { Skeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const SalaryEstimator = () => {
  const [formData, setFormData] = useState({ role: '', experience: '', location: '', skills: '' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEstimate = async (e) => {
    e.preventDefault();
    if (!formData.role.trim()) {
      toast.error("Job role is required.");
      return;
    }

    setLoading(true);
    setResults(null);
    try {
      const response = await enhanceApi.estimateSalary(formData);
      setResults(response.data);
    } catch (error) {
      console.error("Error estimating salary:", error);
      toast.error("Failed to estimate salary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
            <DollarSign className="w-4 h-4" />
            AI-Powered Salary Insights
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Know Your Worth
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get real-time, AI-driven salary estimates tailored to your role, experience, location, and unique skills.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="bg-background/60 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-border">
              <div className="bg-emerald-600 p-5 text-white font-semibold flex items-center gap-3">
                <Search size={20} /> Request an Estimate
              </div>
              <form onSubmit={handleEstimate} className="p-6 md:p-8 space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                    <Briefcase size={16} className="text-primary" />
                    Job Role *
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm text-foreground placeholder:text-muted-foreground"
                    placeholder="e.g. Senior Frontend Developer"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                    <TrendingUp size={16} className="text-primary" />
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    className="w-full p-4 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm text-foreground placeholder:text-muted-foreground"
                    placeholder="e.g. 5"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                    <MapPin size={16} className="text-primary" />
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm text-foreground placeholder:text-muted-foreground"
                    placeholder="e.g. San Francisco, CA or Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                    <Star size={16} className="text-primary" />
                    Key Skills (Optional)
                  </label>
                  <textarea
                    className="w-full p-4 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm h-24 resize-none text-foreground placeholder:text-muted-foreground"
                    placeholder="e.g. React, Node.js, GraphQL, AWS"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing Market Data...
                    </span>
                  ) : (
                    <>Get Salary Estimate <ArrowRight size={20} /></>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {loading ? (
              <div className="space-y-6 animate-pulse p-6 bg-background/50 rounded-2xl border border-border shadow-sm">
                <Skeleton className="h-8 w-1/2 bg-foreground/10 mx-auto lg:mx-0" />
                <Skeleton className="h-24 w-full bg-foreground/10 rounded-xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Skeleton className="h-40 w-full bg-foreground/10 rounded-xl" />
                  <Skeleton className="h-40 w-full bg-foreground/10 rounded-xl" />
                </div>
              </div>
            ) : results ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl shadow-sm text-center">
                  <h3 className="text-xl font-medium text-emerald-600 mb-2">Estimated Salary Range</h3>
                  <div className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                    {results.estimatedSalaryRange || 'N/A'}
                  </div>
                  <p className="text-muted-foreground mt-4">
                    Median Salary: <span className="font-semibold text-foreground">{results.medianSalary || 'N/A'}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-background/80 p-6 rounded-2xl border border-border shadow-sm">
                    <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp size={18} className="text-emerald-500" /> Market Demand
                    </h4>
                    <div className="inline-flex px-4 py-2 bg-emerald-500/10 text-emerald-600 font-semibold rounded-lg text-lg">
                      {results.marketDemand || 'Unknown'}
                    </div>
                  </div>

                  <div className="bg-background/80 p-6 rounded-2xl border border-border shadow-sm">
                    <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <Star size={18} className="text-amber-500" /> Alternative Roles
                    </h4>
                    <ul className="space-y-2">
                      {(results.alternativeRoles || []).map((role, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {role}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-background/80 p-6 rounded-2xl border border-border shadow-sm">
                  <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <List size={18} className="text-primary" /> Key Factors Influencing Salary
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(results.keyFactors || []).map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-muted/30 p-3 rounded-lg text-sm text-foreground">
                        <Star size={16} className="text-primary mt-0.5 shrink-0" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 bg-background/30 rounded-3xl border border-dashed border-border">
                <DollarSign size={64} className="text-muted-foreground/30 mb-6" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Ready to discover your market value?</h3>
                <p className="text-muted-foreground max-w-md">
                  Fill out the form on the left with your role, experience, and skills to get an AI-powered salary estimate.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SalaryEstimator;
