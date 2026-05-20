import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Colors matching the dashboard's application statuses
const COLORS = ['#94a3b8', '#3b82f6', '#8b5cf6', '#10b981']; 

export default function PieChart({ data }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '1rem' }}
            itemStyle={{ color: 'var(--foreground)' }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  );
}