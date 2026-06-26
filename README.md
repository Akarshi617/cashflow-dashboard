# 💰 Cash-Flow Dashboard

A **Vanilla JavaScript** financial dashboard built as part of **Sprint 02** at Prodesk IT. This project demonstrates core JavaScript engineering skills — DOM manipulation, event handling, data persistence, and third-party API/library integration — without relying on any frontend framework.

## 📋 Overview

Cash-Flow lets users input their salary, log expenses, and view their remaining balance update in real time. Data persists across browser sessions using `localStorage`, and the dashboard includes visual and reporting tools for a complete personal finance tracking experience.

## ✨ Features

### Phase 1 — Core Functionality
- Add Total Salary via a dedicated input form
- Log expenses with name and amount
- Real-time calculation of **Remaining Balance** (Salary − Total Expenses)
- Dynamic DOM rendering of salary, expenses, and balance
- Input validation — blocks empty or negative values with clear error messages
- Built with **100% Vanilla JavaScript** (no frameworks)

### Phase 2 — Persistence & Visualization
- **LocalStorage** integration — salary and expense data persists after page reload
- Delete functionality for individual expenses (updates DOM, storage, and balance instantly)
- **Chart.js** pie chart visualizing Remaining Balance vs Total Expenses, auto-updating on every change

### Phase 3 — Advanced Features
- **PDF Report Export** using jsPDF — download a formatted summary of salary, expenses, and balance
- **Low Balance Alert** — if Remaining Balance drops below 10% of Total Salary, the UI displays a warning banner and highlights the balance in red
- **Currency Conversion** — toggle between INR, USD, EUR, and GBP using live exchange rates from the [Frankfurter API](https://www.frankfurter.app/) (with static fallback rates if the API is unavailable)

## 🛠️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- [Chart.js](https://www.chartjs.org/) — data visualization
- [jsPDF](https://github.com/parallax/jsPDF) — PDF generation
- [Frankfurter API](https://www.frankfurter.app/) — currency exchange rates

## 📂 Project Structure

```
cashflow-dashboard/
│
├── index.html      # Main HTML structure
├── style.css       # Styling and responsive design
├── script.js       # Application logic (state, DOM, storage, API calls)
└── README.md       # Project documentation
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cashflow-dashboard.git
   ```
2. Open `index.html` in your browser — no build steps or installations required.

## 🧪 How to Use

1. Enter your **Total Salary** and click **Save Salary**
2. Add expenses using the **Expense Name** and **Expense Amount** fields, then click **Add Expense**
3. Watch the **Remaining Balance** and **Pie Chart** update automatically
4. Delete any expense using the 🗑 button next to it
5. Switch currencies using the dropdown to view converted amounts
6. Click **Download Report PDF** to export a summary

## ✅ Validation Rules

- Salary and Expense Amount must be positive numbers
- Expense Name cannot be empty
- Invalid submissions display an inline error message and do not break the app

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙋 Author

Built by **Akarshi** as part of the Prodesk IT Internship Program (Sprint 02).

— Akarshi
