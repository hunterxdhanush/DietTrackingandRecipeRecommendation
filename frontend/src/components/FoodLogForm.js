import React, { useState } from 'react';
import { nutritionAPI } from '../services/api';

const FoodLogForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    food_name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    meal_type: 'breakfast',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        calories: parseInt(formData.calories),
        protein: parseInt(formData.protein),
        carbs: parseInt(formData.carbs),
        fat: parseInt(formData.fat),
      };

      await nutritionAPI.logFood(dataToSubmit);
      
      // Reset form
      setFormData({
        food_name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        meal_type: 'breakfast',
      });

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log food');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Log Food</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Name
            </label>
            <input
              type="text"
              name="food_name"
              required
              value={formData.food_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Grilled Chicken Breast"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calories (kcal)
            </label>
            <input
              type="number"
              name="calories"
              required
              min="0"
              value={formData.calories}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., 250"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Protein (g)
            </label>
            <input
              type="number"
              name="protein"
              required
              min="0"
              value={formData.protein}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., 30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carbs (g)
            </label>
            <input
              type="number"
              name="carbs"
              required
              min="0"
              value={formData.carbs}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., 15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fat (g)
            </label>
            <input
              type="number"
              name="fat"
              required
              min="0"
              value={formData.fat}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., 5"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meal Type
            </label>
            <select
              name="meal_type"
              value={formData.meal_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging...' : 'Log Food'}
        </button>
      </form>
    </div>
  );
};

export default FoodLogForm;
