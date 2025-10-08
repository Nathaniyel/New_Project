import React, { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';

const ExpenseForm = ({ expense, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        category: expense.category,
        note: expense.note,
        date: expense.date.split('T')[0]
      });
    }
  }, [expense]);

  const loadCategories = async () => {
    try {
      const response = await expenseAPI.getCategories();
      setCategories(response.data.data);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (isEditing) {
        await expenseAPI.update(expense._id, expenseData);
      } else {
        await expenseAPI.create(expenseData);
      }

      onSave();
      setFormData({
        amount: '',
        category: 'Food',
        note: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-form">
      <h3>{isEditing ? 'Edit Expense' : 'Add New Expense'}</h3>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount ($)</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="Enter amount"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Note</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Add a note (optional)"
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update' : 'Add Expense')}
          </button>
          
          {isEditing && (
            <button 
              type="button" 
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;