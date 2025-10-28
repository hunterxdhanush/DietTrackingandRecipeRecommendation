import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BmiTracker = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Current data
  const [currentData, setCurrentData] = useState({
    height: '',
    weight: '',
    bmi: ''
  });
  
  // BMI History
  const [bmiHistory, setBmiHistory] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    // Calculate BMI when height or weight changes
    if (currentData.height && currentData.weight) {
      const heightInMeters = currentData.height / 100;
      const calculatedBmi = (currentData.weight / (heightInMeters * heightInMeters)).toFixed(2);
      setCurrentData(prev => ({ ...prev, bmi: calculatedBmi }));
    }
  }, [currentData.height, currentData.weight]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch current profile data
      const profileRes = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCurrentData({
        height: profileRes.data.height || '',
        weight: profileRes.data.weight || '',
        bmi: profileRes.data.bmi || ''
      });
      
      // Fetch BMI history
      const historyRes = await axios.get('http://localhost:5000/api/auth/bmi-history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBmiHistory(historyRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load BMI data' });
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/profile',
        {
          height: parseFloat(currentData.height),
          weight: parseFloat(currentData.weight)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setMessage({ type: 'success', text: 'BMI updated successfully!' });
      
      // Refresh data to get new history
      setTimeout(() => {
        fetchData();
      }, 1000);
    } catch (error) {
      console.error('Error updating BMI:', error);
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update BMI' });
    } finally {
      setSaving(false);
    }
  };
  
  const getBmiCategory = (bmi) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmiValue < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmiValue < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-gray-600 hover:text-gray-900 mb-2 flex items-center"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">BMI Tracker</h1>
          <p className="text-gray-600 mt-1">Monitor your Body Mass Index over time</p>
        </div>
        
        {/* Current BMI Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Current BMI</h2>
            {currentData.bmi && (
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{parseFloat(currentData.bmi).toFixed(1)}</div>
                <div className={`text-sm font-medium ${getBmiCategory(currentData.bmi).color}`}>
                  {getBmiCategory(currentData.bmi).category}
                </div>
              </div>
            )}
          </div>
          
          {/* Update Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={currentData.height}
                  onChange={handleInputChange}
                  step="0.1"
                  min="50"
                  max="250"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={currentData.weight}
                  onChange={handleInputChange}
                  step="0.1"
                  min="20"
                  max="300"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            {message.text && (
              <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}
            
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium"
            >
              {saving ? 'Updating...' : 'Update BMI'}
            </button>
          </form>
        </div>
        
        {/* BMI Reference Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">BMI Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-blue-600 font-semibold">Underweight</div>
              <div className="text-sm text-gray-600">&lt; 18.5</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-green-600 font-semibold">Normal</div>
              <div className="text-sm text-gray-600">18.5 - 24.9</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-yellow-600 font-semibold">Overweight</div>
              <div className="text-sm text-gray-600">25 - 29.9</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-red-600 font-semibold">Obese</div>
              <div className="text-sm text-gray-600">≥ 30</div>
            </div>
          </div>
        </div>
        
        {/* BMI History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">BMI History</h2>
          
          {bmiHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No BMI history available yet. Update your height and weight to start tracking!</p>
          ) : (
            <div className="space-y-3">
              {bmiHistory.map((record, index) => {
                const category = getBmiCategory(record.bmi);
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div>
                      <div className="text-sm text-gray-500">
                        {new Date(record.recorded_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Height: {record.height} cm | Weight: {record.weight} kg
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{parseFloat(record.bmi).toFixed(1)}</div>
                      <div className={`text-sm font-medium ${category.color}`}>
                        {category.category}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BmiTracker;
