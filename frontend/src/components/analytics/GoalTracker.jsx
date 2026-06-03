import React from 'react'; // Removed useState since it's no longer needed

// Move the static data outside the component as a constant
const GOALS = [
  { id: 1, label: 'Job Applications', current: 15, target: 25, color: 'bg-blue-600' },
  { id: 2, label: 'Skill Certifications', current: 2, target: 5, color: 'bg-purple-600' },
  { id: 3, label: 'Coding Problems Solved', current: 45, target: 50, color: 'bg-emerald-600' }
];

const GoalTracker = ({ className }) => {
  return (
    <div className={className}>
      <div class="mb-4"><h2 class="text-lg font-bold text-gray-900 dark:text-white">Weekly Milestones</h2></div>
      
      <div className="space-y-5">
        {GOALS.map((goal) => {
          // Calculate percentage safely
          const percentage = Math.min(Math.round((goal.current / goal.target) * 100), 100);
          
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-700 dark:text-gray-300">{goal.label}</span>
                <span className="text-gray-500">{percentage}%</span>
              </div>
              
              {/* Progress Bar Track */}
              <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                <div 
                  className={`h-2 rounded-full ${goal.color}`} 
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
              
              <div className="text-xs text-gray-500 text-right">
                {goal.current} of {goal.target} completed
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalTracker;
