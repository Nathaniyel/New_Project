const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use(cors());

// Routes
app.use('/api/expenses', require('./routes/expenses'));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Personal Expense Tracker API',
    version: '1.0.0',
    endpoints: {
      'GET /api/expenses': 'Get all expenses with filtering and pagination',
      'GET /api/expenses/:id': 'Get single expense',
      'POST /api/expenses': 'Create new expense',
      'PUT /api/expenses/:id': 'Update expense',
      'DELETE /api/expenses/:id': 'Delete expense',
      'GET /api/expenses/summary/summary': 'Get expense summary reports',
      'GET /api/expenses/meta/categories': 'Get available categories'
    },
    queryParameters: {
      'category': 'Filter by category',
      'startDate': 'Filter from date (YYYY-MM-DD)',
      'endDate': 'Filter to date (YYYY-MM-DD)',
      'page': 'Page number for pagination',
      'limit': 'Number of items per page'
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});