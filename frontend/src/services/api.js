import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

export const nutritionAPI = {
  getGoals: () => api.get('/nutrition/goals'),
  updateGoals: (data) => api.put('/nutrition/goals', data),
  logFood: (data) => api.post('/nutrition/log', data),
  getTodayLogs: () => api.get('/nutrition/logs/today'),
  getTodayProgress: () => api.get('/nutrition/progress/today'),
  deleteLog: (id) => api.delete(`/nutrition/log/${id}`),
};

export const recipeAPI = {
  getRecommendations: () => api.post('/recipes/recommendations'),
};

export default api;
