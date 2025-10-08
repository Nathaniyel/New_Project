const express = require('express');
const Expense = require('../models/Expense');
const router = express.Router();

// @desc    Get all expenses with optional filters
// @route   GET /api/expenses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    let filter = {};
    
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const expenses = await Expense.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Expense.countDocuments(filter);

    res.json({
      success: true,
      count: expenses.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      },
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { amount, date, note, category } = req.body;

    // Basic validation
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid amount greater than 0'
      });
    }

    const expense = await Expense.create({
      amount,
      date: date || new Date(),
      note,
      category: category || 'Other'
    });

    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    // Validate amount if provided
    if (req.body.amount !== undefined && req.body.amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Get expense summary
// @route   GET /api/expenses/summary/summary
// @access  Public
router.get('/summary/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchStage = {};
    
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    // Total spent and count
    const totalStats = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalExpenses: { $sum: 1 }
        }
      }
    ]);

    // Category-wise summary
    const categorySummary = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // Monthly summary
    const monthlySummary = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    // Format monthly summary
    const formattedMonthlySummary = monthlySummary.map(month => ({
      year: month._id.year,
      month: month._id.month,
      period: `${month._id.year}-${month._id.month.toString().padStart(2, '0')}`,
      totalAmount: month.totalAmount,
      count: month.count
    }));

    const summary = {
      totalAmount: totalStats[0]?.totalAmount || 0,
      totalExpenses: totalStats[0]?.totalExpenses || 0,
      categorySummary: categorySummary.map(cat => ({
        category: cat._id,
        totalAmount: cat.totalAmount,
        count: cat.count,
        percentage: totalStats[0] ? (cat.totalAmount / totalStats[0].totalAmount * 100).toFixed(1) : 0
      })),
      monthlySummary: formattedMonthlySummary
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Get available categories
// @route   GET /api/expenses/categories
// @access  Public
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = ['All', 'Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Other'];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = router;