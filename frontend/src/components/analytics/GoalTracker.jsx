import React, { useState } from 'react';
import { cn } from '../../lib/utils'; // Uses the utility file verified in your repository map

const GoalTracker = ({ className }) => {
  // Goals array configuration
  const [goals] = useState([
    { id: 1, label: 'Job Applications', current: 15, target: 25, color: 'bg-blue-600' },
    { id: 2, label: 'Skill Certifications', current: 2, target: 5, color: 'bg-purple-600' },
    { id: 3, label: 'Coding Problems Solved', current: 45, target: 50, color: 'bg-emerald-600' }
  ]);

  const [errorMessage] = useState('');

  // Safeguards calculation processing against invalid math limits
  const calculateProgress = (current, target) => {
    if (!target || target <= 0) return 0;
    if (current < 0) return 0;
    const percentage = (current / target) * 100;
    return percentage > 100 ? 100 : Math.round(percentage);
  };

  return (
    <div className={cn("p-6 bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 max-w-xl mx-auto my-4", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Goal Setting & Tracking</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Monitor your weekly technical career milestones</p>
      </div>

      {errorMessage && (
        <div className="p-2 mb-4 text-xs text-red-600 bg-red-50 rounded dark:bg-red-900/20 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      <div className="space-y-5">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.current, goal.target);
          return (
            <div key={goal.id} className="w-full">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{goal.label}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{progress}%</span>
              </div>
              
              {/* Progress Bar Track */}
              <div className="w-full bg-gray-100 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className={cn("h-2.5 rounded-full transition-all duration-500 ease-out", goal.color)} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {goal.current} of {goal.target} completed
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalTracker;
