const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

let expenses = [
  { id: 1, title: 'Groceries', amount: 850, category: 'Food', date: '2026-05-15', type: 'expense' },
  { id: 2, title: 'Salary', amount: 50000, category: 'Income', date: '2026-05-01', type: 'income' },
  { id: 3, title: 'Netflix', amount: 649, category: 'Entertainment', date: '2026-05-10', type: 'expense' },
  { id: 4, title: 'Electricity Bill', amount: 1200, category: 'Bills', date: '2026-05-12', type: 'expense' },
];

// Get all expenses
app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

// Get summary
app.get('/api/summary', (req, res) => {
  const income = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const expense = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const balance = income - expense;
  res.json({ income, expense, balance });
});

// Add expense
app.post('/api/expenses', (req, res) => {
  const newExpense = {
    id: Date.now(),
    title: req.body.title,
    amount: parseFloat(req.body.amount),
    category: req.body.category,
    date: req.body.date,
    type: req.body.type
  };
  expenses.push(newExpense);
  res.json(newExpense);
});

// Delete expense
app.delete('/api/expenses/:id', (req, res) => {
  expenses = expenses.filter(e => e.id !== parseInt(req.params.id));
  res.json({ message: 'Deleted successfully' });
});

// Update expense
app.put('/api/expenses/:id', (req, res) => {
  const idx = expenses.findIndex(e => e.id === parseInt(req.params.id));
  if (idx !== -1) {
    expenses[idx] = { ...expenses[idx], ...req.body };
    res.json(expenses[idx]);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../backend/public', 'index.html'));
});

module.exports = app;
