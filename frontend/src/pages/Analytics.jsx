import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart as PieChartIcon, Activity, Percent } from 'lucide-react';
import PieChartComponent from '../components/charts/PieChart';
import LineChartComponent from '../components/charts/LineChart';
import { jobTrackerApi } from '../services/api';

export default function Analytics() {
  const [jobStats, setJobStats] = useState({ saved: 0, applied: 0, interviewing: 0, offered: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const jobsRes = await jobTrackerApi.getAll().catch(() => ({ trackedJobs: [] }));
        const jobs = jobsRes.trackedJobs || [];

        setJobStats({
          saved: jobs.filter(j => j.status === 'saved').length,
          applied: jobs.filter(j => j.status === 'applied').length,
          interviewing: jobs.filter(j => j.status === 'interviewing').length,
          offered: jobs.filter(j => j.status === 'offered').length
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  // Format data for Pie Chart
  const pieData = [
    { name: 'Saved', value: jobStats.saved },
    { name: 'Applied', value: jobStats.applied },
    { name: 'Interviewing', value: jobStats.interviewing },
    { name: 'Offered', value: jobStats.offered }
  ].filter(item => item.value > 0); // Only show statuses that have at least 1 job

  // Fallback data if no jobs exist
  const displayPieData = pieData.length > 0 ? pieData : [{ name: 'No Data', value: 1 }];

  // Mock Data for Weekly Activity (can be replaced with real backend filtering later)
  const weeklyData = [
    { name: 'Mon', applications: 1 },
    { name: 'Tue', applications: 3 },
    { name: 'Wed', applications: 2 },
    { name: 'Thu', applications: 5 },
    { name: 'Fri', applications: 4 },
    { name: 'Sat', applications: 0 },
    { name: 'Sun', applications: 1 },
  ];

  // Response Rate Calculation
  const totalApplied = jobStats.applied + jobStats.interviewing + jobStats.offered;
  const responseRate = totalApplied > 0 
    ? Math.round(((jobStats.interviewing + jobStats.offered) / totalApplied) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 flex items-center gap-4 tracking-tight">
            <Activity className="w-10 h-10 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-lg text-muted-foreground font-medium">Analyze your application metrics and conversion rates.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Percent className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Response Rate</p>
                    <h3 className="text-4xl font-black text-foreground">{responseRate}%</h3>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-[2rem] bg-card border border-border shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-primary" />
                  Application Statuses
                </h2>
                <PieChartComponent data={displayPieData} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-[2rem] bg-card border border-border shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Weekly Activity
                </h2>
                <LineChartComponent data={weeklyData} />
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export { default as Analytics } from './Analytics'