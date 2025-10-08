import React from 'react';

const ExpenseSummary = ({ summary, loading }) => {
  const formatAmount = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  if (loading) {
    return <div className="loading">Loading summary...</div>;
  }

  if (!summary) {
    return <div className="no-summary">No summary data available</div>;
  }

  const { totalAmount, totalExpenses, categorySummary, monthlySummary } = summary;

  return (
    <div className="expense-summary">
      <h3>Expense Summary</h3>
      
      <div className="summary-cards">
        <div className="summary-card total-card">
          <h4>Total Spent</h4>
          <div className="amount">{formatAmount(totalAmount)}</div>
          <div className="count">{totalExpenses} expenses</div>
        </div>

        <div className="summary-card average-card">
          <h4>Average</h4>
          <div className="amount">
            {formatAmount(totalExpenses > 0 ? totalAmount / totalExpenses : 0)}
          </div>
          <div className="count">per expense</div>
        </div>
      </div>

      <div className="summary-sections">
        <div className="category-summary">
          <h4>By Category</h4>
          {categorySummary.length === 0 ? (
            <div className="no-data">No category data</div>
          ) : (
            <div className="category-list">
              {categorySummary.map(cat => (
                <div key={cat.category} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{cat.category}</span>
                    <span className="category-amount">{formatAmount(cat.totalAmount)}</span>
                  </div>
                  <div className="category-stats">
                    <span className="category-count">{cat.count} items</span>
                    <span className="category-percentage">
                      ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-progress"
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="monthly-summary">
          <h4>By Month</h4>
          {monthlySummary.length === 0 ? (
            <div className="no-data">No monthly data</div>
          ) : (
            <div className="monthly-list">
              {monthlySummary.map(month => (
                <div key={month.period} className="monthly-item">
                  <div className="month-period">{month.period}</div>
                  <div className="month-amount">{formatAmount(month.totalAmount)}</div>
                  <div className="month-count">{month.count} expenses</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;