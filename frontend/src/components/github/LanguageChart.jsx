import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// GitHub's official colors for popular languages
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  Other: '#858585'
};

const LanguageChart = ({ data, mode = 'single' }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!data || data.length === 0) {
    return <div className="text-gray-500 p-4 text-center">No language data available</div>;
  }

  // 1. Calculate Total Value to figure out percentages
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  // 2. Process data: Group languages < 1% into 'Other'
  let processedData = [];
  let otherValue = 0;

  data.forEach(item => {
    const percentage = (item.value / totalValue) * 100;
    if (percentage < 1) {
      otherValue += item.value;
    } else {
      processedData.push({
        name: item.name,
        value: item.value,
        percentage: percentage.toFixed(1)
      });
    }
  });

  // If there are small languages, add them to the 'Other' group
  if (otherValue > 0) {
    processedData.push({
      name: 'Other',
      value: otherValue,
      percentage: ((otherValue / totalValue) * 100).toFixed(1)
    });
  }

  // Handle hover animation states
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        Language Usage ({mode === 'single' ? 'This Repository' : 'All Repositories'})
      </h3>
      
      {/* Chart Ring */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              innerRadius={60} // Creates the donut hole
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {processedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={LANGUAGE_COLORS[entry.name] || '#cccccc'} 
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s ease' }}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [`${props.payload.percentage}%`, name]}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with names and percentages */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {processedData.map((entry, index) => (
          <div 
            key={index} 
            className={`flex items-center space-x-2 p-1 rounded transition-colors ${activeIndex === index ? 'bg-gray-100' : ''}`}
          >
            <span 
              className="w-3 h-3 rounded-full inline-block" 
              style={{ backgroundColor: LANGUAGE_COLORS[entry.name] || '#cccccc' }}
            />
            <span className="text-sm font-medium text-gray-700">{entry.name}</span>
            <span className="text-xs text-gray-400">{entry.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageChart;