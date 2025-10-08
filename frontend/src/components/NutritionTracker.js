import React from 'react';

const NutritionTracker = ({ progress }) => {
  const { goals, consumed, remaining, percentages } = progress;

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getTextColor = (percentage) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const MacroCard = ({ label, goal, consumed, remaining, percentage }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
        <span className={`text-2xl font-bold ${getTextColor(percentage)}`}>
          {percentage}%
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Consumed: {consumed}</span>
          <span>Goal: {goal}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="text-sm">
        <span className="text-gray-600">Remaining: </span>
        <span className={`font-semibold ${remaining > 0 ? 'text-gray-800' : 'text-red-600'}`}>
          {remaining} {label === 'Calories' ? 'kcal' : 'g'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MacroCard
        label="Calories"
        goal={goals.calories}
        consumed={consumed.calories}
        remaining={remaining.calories}
        percentage={percentages.calories}
      />
      <MacroCard
        label="Protein"
        goal={goals.protein}
        consumed={consumed.protein}
        remaining={remaining.protein}
        percentage={percentages.protein}
      />
      <MacroCard
        label="Carbs"
        goal={goals.carbs}
        consumed={consumed.carbs}
        remaining={remaining.carbs}
        percentage={percentages.carbs}
      />
      <MacroCard
        label="Fat"
        goal={goals.fat}
        consumed={consumed.fat}
        remaining={remaining.fat}
        percentage={percentages.fat}
      />
    </div>
  );
};

export default NutritionTracker;
