import React from "react";
import { learningResources } from "../data/learningResources";

const LearningRecommendations = ({ areasToImprove = [] }) => {
  return (
    <div className="p-6 rounded-2xl border border-border bg-background/50">
      <h2 className="text-2xl font-bold mb-6">
        Personalized Learning Resources
      </h2>

      {areasToImprove.map((skill, index) => {
        const resources =
          learningResources[skill] || [];

        return (
          <div
            key={index}
            className="mb-6"
          >
            <h3 className="font-semibold text-lg mb-2">
              {skill}
            </h3>

            {resources.length > 0 ? (
              <div className="space-y-2">
                {resources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.link}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 rounded-lg border border-border hover:bg-primary/10"
                  >
                    <div className="font-medium">
                      {resource.title}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {resource.type}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No resources available.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningRecommendations;