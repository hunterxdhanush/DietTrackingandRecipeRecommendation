import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { nutritionAPI } from '../services/api';
import NutritionTracker from '../components/NutritionTracker';
import FoodLogForm from '../components/FoodLogForm';
import FoodLogList from '../components/FoodLogList';
import RecipeRecommendations from '../components/RecipeRecommendations';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [progress, setProgress] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFoodForm, setShowFoodForm] = useState(false);
  const [showRecipes, setShowRecipes] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [progressRes, logsRes] = await Promise.all([
        nutritionAPI.getTodayProgress(),
        nutritionAPI.getTodayLogs(),
      ]);
      setProgress(progressRes.data);
      setLogs(logsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFoodLogged = () => {
    setShowFoodForm(false);
    fetchData();
  };

  const handleDeleteLog = async (id) => {
    try {
      await nutritionAPI.deleteLog(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting log:', error);
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Diet Tracker</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Nutrition Tracker */}
        {progress && <NutritionTracker progress={progress} />}

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setShowFoodForm(!showFoodForm)}
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-green-600 transition"
          >
            {showFoodForm ? 'Hide Form' : 'Log Food'}
          </button>
          <button
            onClick={() => setShowRecipes(!showRecipes)}
            className="px-6 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-blue-600 transition"
          >
            {showRecipes ? 'Hide Recipes' : 'Get Recipe Recommendations'}
          </button>
        </div>

        {/* Food Log Form */}
        {showFoodForm && (
          <div className="mt-8">
            <FoodLogForm onSuccess={handleFoodLogged} />
          </div>
        )}

        {/* Recipe Recommendations */}
        {showRecipes && (
          <div className="mt-8">
            <RecipeRecommendations />
          </div>
        )}

        {/* Food Logs */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Food Log</h2>
          <FoodLogList logs={logs} onDelete={handleDeleteLog} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
