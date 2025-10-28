import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nutritionAPI } from '../services/api';

const ProgressHistory = () => {
  const [history, setHistory] = useState([]);
  const [goals, setGoals] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await nutritionAPI.getHistory();
      setHistory(response.data.history);
      setGoals(response.data.goals);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (consumed, goal) => {
    return goal > 0 ? Math.round((consumed / goal) * 100) : 0;
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 90 && percentage <= 110) return 'text-green-600 bg-green-50';
    if (percentage >= 75 && percentage < 90) return 'text-yellow-600 bg-yellow-50';
    if (percentage > 110) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusText = (percentage) => {
    if (percentage >= 90 && percentage <= 110) return 'On Track ✓';
    if (percentage >= 75 && percentage < 90) return 'Below Goal';
    if (percentage > 110) return 'Over Goal';
    return 'Well Below';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">30-Day Progress History</h1>
              <p className="text-sm text-gray-600">Track your nutrition goals over time</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {history.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No history data yet. Start logging your meals!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((day, index) => {
              const date = new Date(day.log_date);
              const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{formattedDate}</h3>
                    <div className="text-sm text-gray-500">
                      {index === 0 ? 'Latest' : `${index + 1} day${index > 0 ? 's' : ''} ago`}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Calories */}
                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="text-sm text-gray-600 mb-1">Calories</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {parseInt(day.total_calories)}
                        <span className="text-sm text-gray-500 ml-1">/ {goals.calories}</span>
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded inline-block mt-2 ${getStatusColor(calculatePercentage(day.total_calories, goals.calories))}`}>
                        {calculatePercentage(day.total_calories, goals.calories)}% - {getStatusText(calculatePercentage(day.total_calories, goals.calories))}
                      </div>
                    </div>

                    {/* Protein */}
                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="text-sm text-gray-600 mb-1">Protein</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {parseInt(day.total_protein)}g
                        <span className="text-sm text-gray-500 ml-1">/ {goals.protein}g</span>
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded inline-block mt-2 ${getStatusColor(calculatePercentage(day.total_protein, goals.protein))}`}>
                        {calculatePercentage(day.total_protein, goals.protein)}% - {getStatusText(calculatePercentage(day.total_protein, goals.protein))}
                      </div>
                    </div>

                    {/* Carbs */}
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <div className="text-sm text-gray-600 mb-1">Carbs</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {parseInt(day.total_carbs)}g
                        <span className="text-sm text-gray-500 ml-1">/ {goals.carbs}g</span>
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded inline-block mt-2 ${getStatusColor(calculatePercentage(day.total_carbs, goals.carbs))}`}>
                        {calculatePercentage(day.total_carbs, goals.carbs)}% - {getStatusText(calculatePercentage(day.total_carbs, goals.carbs))}
                      </div>
                    </div>

                    {/* Fat */}
                    <div className="border-l-4 border-purple-500 pl-4">
                      <div className="text-sm text-gray-600 mb-1">Fat</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {parseInt(day.total_fat)}g
                        <span className="text-sm text-gray-500 ml-1">/ {goals.fat}g</span>
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded inline-block mt-2 ${getStatusColor(calculatePercentage(day.total_fat, goals.fat))}`}>
                        {calculatePercentage(day.total_fat, goals.fat)}% - {getStatusText(calculatePercentage(day.total_fat, goals.fat))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProgressHistory;
