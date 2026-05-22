const API = '/api';
let allExpenses = [];
let currentType = 'expense';

const categoryIcons = {
  Food: '🍔', Bills: '⚡', Entertainment: '🎬',
  Transport: '🚗', Shopping: '🛍️', Health: '💊',
  Income: '💼', Other: '📦'
};

// Show section
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(name).classList.add('active');
  document.querySelectorAll('.nav-item')[['dashboard','transactions','add'].indexOf(name)].classList.add('active');
  if (name === 'dashboard') loadDashboard();
  if (name === 'transactions') loadAllTransactions();
}

// Set type
function setType(type) {
  currentType = type;
  document.getElementById('expenseBtn').classList.toggle('active', type === 'expense');
  document.getElementById('incomeBtn').classList.toggle('active', type === 'income');
}

// Format currency
function fmt(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

// Load dashboard
async function loadDashboard() {
  const [expenses, summary] = await Promise.all([
    fetch(`${API}/expenses`).then(r => r.json()),
    fetch(`${API}/summary`).then(r => r.json())
  ]);
  allExpenses = expenses;

  // Update cards
  document.getElementById('balance').textContent = fmt(summary.balance);
  document.getElementById('income').textContent = fmt(summary.income);
  document.getElementById('expense').textContent = fmt(summary.expense);

  // Category breakdown
  const expOnly = expenses.filter(e => e.type === 'expense');
  const catMap = {};
  expOnly.forEach(e => {
    catMap[e.category] = (catMap[e.category] || 0) + e.amount;
  });
  const maxVal = Math.max(...Object.values(catMap), 1);
  const breakdown = document.getElementById('categoryBreakdown');
  breakdown.innerHTML = Object.entries(catMap).length === 0
    ? '<div class="empty-state">No expenses yet</div>'
    : Object.entries(catMap).sort((a,b) => b[1]-a[1]).map(([cat, amt]) => `
      <div class="category-item">
        <span class="cat-name">${categoryIcons[cat] || '📦'} ${cat}</span>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width:${(amt/maxVal*100).toFixed(1)}%"></div>
        </div>
        <span class="cat-amount">${fmt(amt)}</span>
      </div>`).join('');

  // Recent transactions (last 5)
  const recent = [...expenses].reverse().slice(0, 5);
  document.getElementById('recentList').innerHTML = recent.length === 0
    ? '<div class="empty-state">No transactions yet</div>'
    : recent.map(tx => txCard(tx, false)).join('');
}

// Transaction card HTML
function txCard(tx, showActions = true) {
  const isIncome = tx.type === 'income';
  return `
    <div class="tx-item" id="tx-${tx.id}">
      <div class="tx-icon ${tx.type}">${categoryIcons[tx.category] || '📦'}</div>
      <div class="tx-info">
        <div class="tx-title">${tx.title}</div>
        <div class="tx-meta">${tx.category} • ${tx.date}</div>
      </div>
      <div class="tx-amount ${tx.type}">${isIncome ? '+' : '-'}${fmt(tx.amount)}</div>
      ${showActions ? `
      <div class="tx-actions">
        <button class="btn-edit" onclick="openEdit(${tx.id})">Edit</button>
        <button class="btn-delete" onclick="deleteExpense(${tx.id})">Delete</button>
      </div>` : ''}
    </div>`;
}

// Load all transactions
async function loadAllTransactions() {
  const expenses = await fetch(`${API}/expenses`).then(r => r.json());
  allExpenses = expenses;
  renderFiltered(expenses);
}

function renderFiltered(expenses) {
  document.getElementById('allTransactions').innerHTML = expenses.length === 0
    ? '<div class="empty-state">No transactions found</div>'
    : [...expenses].reverse().map(tx => txCard(tx, true)).join('');
}

function filterTransactions() {
  const type = document.getElementById('filterType').value;
  const cat = document.getElementById('filterCategory').value;
  let filtered = allExpenses;
  if (type !== 'all') filtered = filtered.filter(e => e.type === type);
  if (cat !== 'all') filtered = filtered.filter(e => e.category === cat);
  renderFiltered(filtered);
}

// Add expense
async function addExpense() {
  const title = document.getElementById('title').value.trim();
  const amount = document.getElementById('amount').value;
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  if (!title || !amount || !date) {
    alert('Please fill all fields!');
    return;
  }

  await fetch(`${API}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, amount, category, date, type: currentType })
  });

  // Reset
  document.getElementById('title').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('date').value = '';

  const msg = document.getElementById('successMsg');
  msg.classList.remove('hidden');
  setTimeout(() => msg.classList.add('hidden'), 3000);
}

// Delete
async function deleteExpense(id) {
  if (!confirm('Delete this transaction?')) return;
  await fetch(`${API}/expenses/${id}`, { method: 'DELETE' });
  loadAllTransactions();
}

// Edit modal
function openEdit(id) {
  const tx = allExpenses.find(e => e.id === id);
  if (!tx) return;
  document.getElementById('editId').value = tx.id;
  document.getElementById('editTitle').value = tx.title;
  document.getElementById('editAmount').value = tx.amount;
  document.getElementById('editCategory').value = tx.category;
  document.getElementById('editModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('editModal').classList.add('hidden');
}

async function saveEdit() {
  const id = document.getElementById('editId').value;
  const title = document.getElementById('editTitle').value;
  const amount = document.getElementById('editAmount').value;
  const category = document.getElementById('editCategory').value;

  await fetch(`${API}/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, amount: parseFloat(amount), category })
  });

  closeModal();
  loadAllTransactions();
}

// Close modal on outside click
document.getElementById('editModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Init
document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-IN', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});
document.getElementById('date').valueAsDate = new Date();

loadDashboard();
