import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import FilterBar from './components/FilterBar';
import { expenseAPI } from './services/api';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    loadExpenses();
    loadSummary();
  }, [filters]);

  const loadExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await expenseAPI.getAll(filters);
      setExpenses(response.data.data);
    } catch (err) {
      setError('Failed to load expenses');
      console.error('Error loading expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const response = await expenseAPI.getSummary(filters);
      setSummary(response.data.data);
    } catch (err) {
      console.error('Error loading summary:', err);
    }
  };

  const handleSaveExpense = () => {
    setEditingExpense(null);
    loadExpenses();
    loadSummary();
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseAPI.delete(id);
        loadExpenses();
        loadSummary();
      } catch (err) {
        setError('Failed to delete expense');
      }
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>💰 Personal Expense Tracker</h1>
        <p>Track and manage your daily expenses</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')} className="close-error">×</button>
          </div>
        )}

        <div className="app-layout">
          <div className="left-panel">
            <ExpenseForm
              expense={editingExpense}
              onSave={handleSaveExpense}
              onCancel={() => setEditingExpense(null)}
              isEditing={!!editingExpense}
            />
            
            <FilterBar
              onFilterChange={handleFilterChange}
              currentFilters={filters}
            />
          </div>

          <div className="right-panel">
            <ExpenseSummary summary={summary} loading={loading} />
            
            <ExpenseList
              expenses={expenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              loading={loading}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Expense Tracker &copy; 2024</p>
      </footer>
    </div>
  );
}

export default App;