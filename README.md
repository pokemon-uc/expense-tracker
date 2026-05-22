# ExpenseIQ — Smart Expense Tracker

A modern, interactive expense tracking application.

## Features
- 📊 Dashboard with summary cards and category breakdown
- ➕ Add income and expense transactions
- ✏️ Edit existing transactions
- 🗑️ Delete transactions
- 🔍 Filter by type and category
- 💰 Real-time balance calculation

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express REST API
- **Containerization**: Docker
- **CI/CD Pipeline**: Jenkins
- **Version Control**: Git & GitHub

## How to Run

### Locally
```bash
cd backend
npm install
node server.js
```
Open http://localhost:3000

### With Docker
```bash
docker build -t expense-tracker .
docker run -p 3001:3000 expense-tracker
```
Open http://localhost:3001

## API Endpoints
- GET /api/expenses — Get all transactions
- POST /api/expenses — Add transaction
- PUT /api/expenses/:id — Update transaction    
- DELETE /api/expenses/:id — Delete transaction
- GET /api/summary — Get income/expense summary
