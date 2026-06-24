import { useState } from 'react';
import { DEFAULT_PROGRESS, updateDifficulty } from '../../../utils/interviewDifficulty';

export function useLevelUp() {
  const [progressData, setProgressData] = useState(() => {
    const stored = localStorage.getItem("interviewProgress");
    return stored ? JSON.parse(stored) : DEFAULT_PROGRESS;
  });

  const handleLevelUp = (score) => {
    const previousLevel = progressData.level;
    const updatedProgress = updateDifficulty(score, progressData);
    localStorage.setItem("interviewProgress", JSON.stringify(updatedProgress));
    setProgressData(updatedProgress);
    
    if (previousLevel !== updatedProgress.level) {
      alert(`🎉 Congratulations!\nYou reached\n${updatedProgress.level}`);
    }
  };

  return { progressData, handleLevelUp };
}
