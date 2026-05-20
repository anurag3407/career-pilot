import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export default function ProductiveHours({
  commitData = [],
}) {
  const hourlyCommits = Array.from(
    { length: 24 },
    (_, hour) => ({
      hour: `${hour}:00`,
      commits: 0,
    })
  );

  const weekdayCommits = DAYS.map((day) => ({
    day,
    commits: 0,
  }));

  commitData.forEach((commit) => {
    const timestamp =
      commit.timestamp ||
      commit.date ||
      commit.created_at;

    if (!timestamp) return;

    const date = new Date(timestamp);

    // Local timezone handling
    const hour = date.getHours();
    const day = date.getDay();

    hourlyCommits[hour].commits += 1;
    weekdayCommits[day].commits += 1;
  });

  const peakHour = hourlyCommits.reduce((max, current) =>
    current.commits > max.commits ? current : max
  );

  const peakDay = weekdayCommits.reduce((max, current) =>
    current.commits > max.commits ? current : max
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-8">

      <div>
        <h2 className="text-2xl font-bold">
          Most Productive Hours
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Based on local commit timestamps
        </p>
      </div>

      {/* Productivity Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500">
            Peak Productivity Hour
          </p>

          <h3 className="text-xl font-semibold mt-1">
            {peakHour.hour}
          </h3>

          <p className="text-sm mt-1">
            {peakHour.commits} commits
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500">
            Most Active Day
          </p>

          <h3 className="text-xl font-semibold mt-1">
            {peakDay.day}
          </h3>

          <p className="text-sm mt-1">
            {peakDay.commits} commits
          </p>
        </div>

      </div>

      {/* Polar Clock Chart */}
      <div className="w-full h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={hourlyCommits}>
            <PolarGrid />

            <PolarAngleAxis dataKey="hour" />

            <PolarRadiusAxis />

            <Radar
              name="Commits"
              dataKey="commits"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Day Breakdown */}
      <div>

        <h3 className="text-lg font-semibold mb-4">
          Day-wise Activity
        </h3>

        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekdayCommits}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="commits" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}