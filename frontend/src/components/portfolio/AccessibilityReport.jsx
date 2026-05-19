import React from "react";

const AccessibilityReport = () => {
  const issues = [
    {
      severity: "critical",
      element: "Image",
      rule: "Missing alt text",
      suggestion: "Add alt attribute to image",
    },
    {
      severity: "moderate",
      element: "Button",
      rule: "Low color contrast",
      suggestion: "Improve button contrast",
    },
  ];

  const getColor = (severity) => {
    switch (severity) {
      case "critical":
        return "text-red-500";
      case "serious":
        return "text-orange-500";
      case "moderate":
        return "text-yellow-500";
      case "minor":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Accessibility Report
      </h2>

      <div className="mb-4">
        <p className="font-semibold">
          Overall Score: 85%
        </p>
      </div>

      <div className="space-y-4">
        {issues.map((issue, index) => (
          <div
            key={index}
            className="border p-3 rounded-md"
          >
            <p className={`font-semibold ${getColor(issue.severity)}`}>
              {issue.severity.toUpperCase()}
            </p>

            <p>
              <strong>Element:</strong> {issue.element}
            </p>

            <p>
              <strong>Rule:</strong> {issue.rule}
            </p>

            <p>
              <strong>Fix:</strong> {issue.suggestion}
            </p>
          </div>
        ))}
      </div>

      <button className="mt-4 px-4 py-2 bg-black text-white rounded">
        Re-check
      </button>
    </div>
  );
};

export default AccessibilityReport;