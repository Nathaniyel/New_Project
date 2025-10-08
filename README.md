# Personal Expense Tracker - Backend (MERN Stack)

A complete backend API for Personal Expense Tracker built with Node.js, Express, and MongoDB.

## Features

- ✅ Complete CRUD operations for expenses
- ✅ MongoDB database with Mongoose ODM
- ✅ Expense categories with validation
- ✅ Advanced filtering (date range, category)
- ✅ Pagination support
- ✅ Summary reports (total, category-wise, monthly)
- ✅ Proper error handling and validation
- ✅ CORS enabled for frontend integration

## API Endpoints

### Expenses
- `GET /api/expenses` - Get all expenses (with filters & pagination)
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Summary & Meta
- `GET /api/expenses/summary/summary` - Get expense summary reports
- `GET /api/expenses/meta/categories` - Get available categories

### Query Parameters
- `category` - Filter by category
- `startDate`, `endDate` - Date range filter (YYYY-MM-DD)
- `page`, `limit` - Pagination

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install




# Expense Tracker Frontend

A React frontend for the Personal Expense Tracker application.

## Features

- ✅ Add, edit, delete expenses
- ✅ View expenses with filtering
- ✅ Expense categories
- ✅ Summary reports
- ✅ Responsive design
- ✅ Real-time updates

## Setup

1. **Install dependencies:**
   ```bash
   npm install
