import React, { useState } from 'react';
import { useProjectVisualizerStore } from '../../stores/useProjectVisualizerStore';
import { Package, ShieldAlert, CheckCircle, ArrowUpCircle, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const DependencyHealth = () => {
  const { dependencies } = useProjectVisualizerStore();
  const [filter, setFilter] = useState('all');

  if (!dependencies) {
    return (
      <div className="flex flex-col items-center justify-center h-96 opacity-60">
        <Package className="w-16 h-16 text-slate-400 mb-4" />
        <h2 className="text-xl font-medium text-slate-300">No Dependency Data</h2>
        <p className="text-slate-500">Run a new analysis to fetch dependency health data.</p>
      </div>
    );
  }

  const { manifests, packages, summary } = dependencies;

  const filteredPackages = packages.filter(pkg => {
    if (filter === 'all') return true;
    if (filter === 'outdated') return pkg.status !== 'up-to-date';
    return pkg.status === filter;
  });

  const StatusIcon = ({ status, className }) => {
    switch (status) {
      case 'up-to-date': return <CheckCircle className={cn("text-emerald-400", className)} />;
      case 'minor-update': return <ArrowUpCircle className={cn("text-blue-400", className)} />;
      case 'major-update': return <AlertTriangle className={cn("text-amber-400", className)} />;
      case 'critical': return <AlertCircle className={cn("text-red-400", className)} />;
      default: return <Package className={cn("text-slate-400", className)} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'up-to-date': return 'Up to date';
      case 'minor-update': return 'Minor update available';
      case 'major-update': return 'Major update available';
      case 'critical': return 'Critically outdated';
      default: return 'Unknown';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Total Packages</p>
            <p className="text-3xl font-bold text-slate-200">{summary.total}</p>
          </div>
          <Package className="w-8 h-8 text-slate-600" />
        </div>
        
        <div className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-800/50 flex items-center justify-between">
          <div>
            <p className="text-emerald-400/80 text-sm font-medium mb-1">Up to Date</p>
            <p className="text-3xl font-bold text-emerald-400">{summary.upToDate}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-500/50" />
        </div>
        
        <div className="p-4 rounded-xl bg-amber-900/20 border border-amber-800/50 flex items-center justify-between">
          <div>
            <p className="text-amber-400/80 text-sm font-medium mb-1">Major Updates</p>
            <p className="text-3xl font-bold text-amber-400">{summary.majorUpdates}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500/50" />
        </div>
        
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-800/50 flex items-center justify-between">
          <div>
            <p className="text-red-400/80 text-sm font-medium mb-1">Critical/Unknown</p>
            <p className="text-3xl font-bold text-red-400">{summary.critical}</p>
          </div>
          <ShieldAlert className="w-8 h-8 text-red-500/50" />
        </div>
      </div>

      <div className="bg-[#0a0f1c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-200">Dependency Health</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs">
              {filteredPackages.length} packages
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-300 outline-none focus:border-amber-500/50"
            >
              <option value="all">All Packages</option>
              <option value="outdated">Needs Update</option>
              <option value="major-update">Major Updates</option>
              <option value="minor-update">Minor Updates</option>
              <option value="up-to-date">Up to Date</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900/80 text-slate-300 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Package</th>
                <th className="px-6 py-4">Manager</th>
                <th className="px-6 py-4">Current</th>
                <th className="px-6 py-4">Latest</th>
                <th className="px-6 py-4 rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No packages match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredPackages.map((pkg, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    key={i} 
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-3">
                      <Package className="w-4 h-4 text-slate-500" />
                      {pkg.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300">
                        {pkg.manager}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300">{pkg.currentVersion}</td>
                    <td className="px-6 py-4 font-mono text-slate-300">{pkg.latestVersion || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon status={pkg.status} className="w-4 h-4" />
                        <span className={cn(
                          "text-xs font-medium",
                          pkg.status === 'up-to-date' ? "text-emerald-400" :
                          pkg.status === 'minor-update' ? "text-blue-400" :
                          pkg.status === 'major-update' ? "text-amber-400" :
                          "text-red-400"
                        )}>
                          {getStatusText(pkg.status)}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DependencyHealth;
