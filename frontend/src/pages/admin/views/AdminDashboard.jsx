import React, { useState, useEffect } from 'react';
import { Users, FileText, Briefcase, Globe } from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import { adminAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import logger from '../../../utils/logger';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResumes: 0,
    totalPortfolios: 0,
    totalJobs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminAPI.getStats();
        setStats(data);
      } catch (error) {
        logger.error('Failed to fetch admin stats:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of system activity and metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users} 
          description="Registered accounts"
        />
        <AdminStatCard 
          title="Resumes Created" 
          value={stats.totalResumes} 
          icon={FileText} 
          description="Total resume builder usage"
        />
        <AdminStatCard 
          title="Portfolios Built" 
          value={stats.totalPortfolios} 
          icon={Globe} 
          description="Active portfolio templates"
        />
        <AdminStatCard 
          title="Job Listings" 
          value={stats.totalJobs} 
          icon={Briefcase} 
          description="Total tracked jobs"
        />
      </div>

      {/* Placeholder for future activity feed */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent System Activity</h3>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Activity logging will appear here.
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
