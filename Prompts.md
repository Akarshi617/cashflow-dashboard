# 📝 Sprint 02 — Original Assignment Prompt

Original sprint brief from **Prodesk IT** for this project. See [`README.md`](./README.md) for the implementation.

## 🎯 Objective

Build a Vanilla JavaScript dashboard ("Cash-Flow") where users input salary, log expenses, and see real-time balance updates — no frameworks (React/Vue restricted this sprint).

## 📦 Phases

**Phase 1 — Base MVP (P0, mandatory)**
- HTML form: Total Salary, Expense Name, Expense Amount (correct input types)
- Capture inputs on submit, render salary & expenses to DOM dynamically
- Calculate & display Remaining Balance in real-time
- Validate against empty/negative inputs with a UI error message
- Pure Vanilla JS only

**Phase 2 — Persistence & Visualization (P1)**
- Persist salary/expenses in `localStorage`; reload and re-render on page load
- Delete expense → updates DOM, storage, and balance instantly
- Chart.js pie chart: Remaining Balance vs Total Expenses, auto-updates

**Phase 3 — Stretch Goals (P2)**
- jsPDF "Download Report" of expenses & balance
- Red warning banner if balance drops below 10% of salary
- Currency toggle via a free exchange-rate API (e.g. Frankfurter)
