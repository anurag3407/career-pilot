import React from 'react';

const AdminStatCard = ({ title, value, icon: Icon, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
          {description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{description}</p>
          )}
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  );
};

export default AdminStatCard;
