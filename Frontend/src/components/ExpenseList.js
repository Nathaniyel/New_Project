import React from 'react';

const ExpenseList = ({ expenses, onEdit, onDelete, loading }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  if (expenses.length === 0) {
    return <div className="no-expenses">No expenses found. Add your first expense!</div>;
  }

  return (
    <div className="expense-list">
      <h3>Recent Expenses</h3>
      
      <div className="expenses-container">
        {expenses.map(expense => (
          <div key={expense._id} className="expense-item">
            <div className="expense-main">
              <div className="expense-category">
                <span className={`category-badge category-${expense.category.toLowerCase()}`}>
                  {expense.category}
                </span>
              </div>
              
              <div className="expense-amount">
                {formatAmount(expense.amount)}
              </div>
            </div>

            <div className="expense-details">
              <div className="expense-note">
                {expense.note || 'No description'}
              </div>
              
              <div className="expense-date">
                {formatDate(expense.date)}
              </div>
            </div>

            <div className="expense-actions">
              <button 
                onClick={() => onEdit(expense)}
                className="btn-edit"
                title="Edit expense"
              >
                ✏️
              </button>
              
              <button 
                onClick={() => onDelete(expense._id)}
                className="btn-delete"
                title="Delete expense"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;