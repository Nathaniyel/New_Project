import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Expenses API
export const expenseAPI = {
  // Get all expenses
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    return api.get(`/expenses?${params.toString()}`);
  },

  // Get single expense
  getById: (id) => api.get(`/expenses/${id}`),

  // Create expense
  create: (expenseData) => api.post('/expenses', expenseData),

  // Update expense
  update: (id, expenseData) => api.put(`/expenses/${id}`, expenseData),

  // Delete expense
  delete: (id) => api.delete(`/expenses/${id}`),

  // Get summary
  getSummary: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    return api.get(`/expenses/summary/summary?${params.toString()}`);
  },

  // Get categories
  getCategories: () => api.get('/expenses/meta/categories'),
};

export default api;