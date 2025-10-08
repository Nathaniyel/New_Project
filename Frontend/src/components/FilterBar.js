import React, { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api.js';

const FilterBar = ({ onFilterChange, currentFilters }) => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const loadCategories = async () => {
    try {
      const response = await expenseAPI.getCategories();
      setCategories(response.data.data);
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  const handleFilterChange = (name, value) => {
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      startDate: '',
      endDate: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.category || filters.startDate || filters.endDate;

  return (
    <div className="filter-bar">
      <h4>Filter Expenses</h4>
      
      <div className="filter-controls">
        <div className="filter-group">
          <label>Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat === 'All' ? '' : cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>From Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>To Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>

        <div className="filter-actions">
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="btn-clear"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;