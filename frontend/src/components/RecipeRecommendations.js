import React, { useState, useEffect } from 'react';
import { recipeAPI } from '../services/api';

const RecipeRecommendations = () => {
  const [recipes, setRecipes] = useState([]);
  const [remaining, setRemaining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await recipeAPI.getRecommendations();
      setRecipes(response.data.recipes);
      setRemaining(response.data.remaining);
      setNote(response.data.note || '');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-gray-600">Loading recipe recommendations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Remaining Macros Info */}
      {remaining && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Remaining Daily Goals
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Calories:</span>
              <span className="ml-2 text-blue-900">{remaining.calories} kcal</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Protein:</span>
              <span className="ml-2 text-blue-900">{remaining.protein}g</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Carbs:</span>
              <span className="ml-2 text-blue-900">{remaining.carbs}g</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Fat:</span>
              <span className="ml-2 text-blue-900">{remaining.fat}g</span>
            </div>
          </div>
        </div>
      )}

      {note && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          <p className="text-sm">{note}</p>
        </div>
      )}

      {/* Recipe Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {recipe.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {recipe.description}
              </p>

              {/* Nutrition Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Nutrition (per serving)
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Calories:</span>
                    <span className="ml-2 font-medium">{recipe.nutrition.calories}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Protein:</span>
                    <span className="ml-2 font-medium">{recipe.nutrition.protein}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Carbs:</span>
                    <span className="ml-2 font-medium">{recipe.nutrition.carbs}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fat:</span>
                    <span className="ml-2 font-medium">{recipe.nutrition.fat}g</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Instructions
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  {recipe.instructions.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeRecommendations;
