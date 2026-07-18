export const DEFAULT_PROGRESS = {
  level: "Beginner",
  streak: 0,
  failCount: 0,
  completedInterviews: 0,
  totalScore: 0,
  averageScore: 0
};

export const updateDifficulty = (
  score,
  progress
) => {

  let updated = {
    ...progress
  };

  updated.completedInterviews += 1;

  updated.totalScore += score;

  updated.averageScore =
    Math.round(
      updated.totalScore /
      updated.completedInterviews
    );

  if(score >= 80){
    updated.streak += 1;
    updated.failCount = 0;
  }

  if(score < 50){
    updated.failCount += 1;
    updated.streak = 0;
  }

  if(
    updated.level === "Beginner" &&
    updated.streak >= 3
  ){
    updated.level = "Intermediate";
    updated.streak = 0;
  }

  else if(
    updated.level === "Intermediate" &&
    updated.streak >= 3
  ){
    updated.level = "Advanced";
    updated.streak = 0;
  }

  if(updated.failCount >= 2){

    if(updated.level === "Advanced"){
      updated.level =
        "Intermediate";
    }

    else if(
      updated.level ===
      "Intermediate"
    ){
      updated.level =
        "Beginner";
    }

    updated.failCount = 0;
  }

  return updated;
};