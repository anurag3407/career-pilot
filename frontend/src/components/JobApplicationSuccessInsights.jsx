import React from "react";
import {
  Briefcase,
  TrendingUp,
  Target,
  Lightbulb,
  BarChart3,
} from "lucide-react";

const JobApplicationSuccessInsights = () => {
  const stats = [
    {
      title: "Application to Interview Ratio",
      value: "25%",
      icon: <Briefcase className="w-6 h-6" />,
      description: "5 interviews from 20 applications",
    },
    {
      title: "Interview Conversion Rate",
      value: "40%",
      icon: <Target className="w-6 h-6" />,
      description: "2 offers from 5 interviews",
    },
    {
      title: "Response Trend",
      value: "+15%",
      icon: <TrendingUp className="w-6 h-6" />,
      description: "More recruiter responses this month",
    },
    {
      title: "Top Job Category",
      value: "Frontend Developer",
      icon: <BarChart3 className="w-6 h-6" />,
      description: "Highest success rate among applications",
    },
  ];

  const suggestions = [
    "Improve resume keywords for better ATS matching",
    "Apply to roles matching your strongest skills",
    "Follow up on pending applications",
    "Practice interview questions regularly",
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 mt-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-6">
        Job Application Success Insights
      </h2>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="border border-border rounded-xl p-4 bg-background"
          >
            <div className="flex items-center gap-3 mb-3 text-primary">
              {item.icon}
              <h3 className="font-semibold">
                {item.title}
              </h3>
            </div>

            <p className="text-2xl font-bold">
              {item.value}
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Improvement Suggestions */}
      <div className="mt-6 p-4 rounded-xl bg-muted">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold">
            Personalized Improvement Suggestions
          </h3>
        </div>

        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
          {suggestions.map((tip, index) => (
            <li key={index}>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JobApplicationSuccessInsights;