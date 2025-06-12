
// Format time from seconds to mm:ss format
export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Get question status class based on answered/marked status
export const getQuestionStatusClass = (answered: boolean, markedForReview: boolean) => {
  if (markedForReview) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  if (answered) return "bg-green-100 text-green-800 border-green-300";
  return "bg-gray-100 text-gray-800 border-gray-300";
};

// Get difficulty badge color
export const getDifficultyColor = (difficulty: "easy" | "medium" | "hard") => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800 border-green-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "hard":
      return "bg-red-100 text-red-800 border-red-300";
  }
};
