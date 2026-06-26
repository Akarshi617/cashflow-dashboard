// ===================== STATE =====================
let salary = 0;
let expenses = []; // [{ id, name, amount }]
let currentCurrency = "INR";
let exchangeRates = { INR: 1 }; // base INR, fetched from API

// ===================== DOM REFERENCES =====================
const salaryForm = document.getElementById("salaryForm");
const salaryInput = document.getElementById("salaryInput");
const expenseForm = document.getElementById("expenseForm");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const errorMessage = document.getElementById("errorMessage");

const salaryDisplay = document.getElementById("salaryDisplay");
const expenseDisplay = document.getElementById("expenseDisplay");
const balanceDisplay = document.getElementById("balanceDisplay");
const expenseTable = document.getElementById("expenseTable");
const warningBanner = document.getElementById("warningBanner");
const currencySelect = document.getElementById("currencySelect");
const downloadPDFBtn = document.getElementById("downloadPDF");

let expenseChart = null; // Chart.js instance

// ===================== LOCALSTORAGE HELPERS =====================
function saveToStorage() {
  localStorage.setItem("cashflow_salary", JSON.stringify(salary));
  localStorage.setItem("cashflow_expenses", JSON.stringify(expenses));
  localStorage.setItem("cashflow_currency", currentCurrency);
}

function loadFromStorage() {
  const storedSalary = localStorage.getItem("cashflow_salary");
  const storedExpenses = localStorage.getItem("cashflow_expenses");
  const storedCurrency = localStorage.getItem("cashflow_currency");

  if (storedSalary) salary = JSON.parse(storedSalary);
  if (storedExpenses) expenses = JSON.parse(storedExpenses);
  if (storedCurrency) currentCurrency = storedCurrency;
}

// ===================== VALIDATION =====================
function showError(message) {
  errorMessage.textContent = message;
  setTimeout(() => {
    errorMessage.textContent = "";
  }, 2500);
}

// ===================== CORE CALCULATIONS =====================
function getTotalExpenses() {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

function getRemainingBalance() {
  return salary - getTotalExpenses();
}

// ===================== CURRENCY FORMATTING =====================
function convertAmount(amountInINR) {
  const rate = exchangeRates[currentCurrency] || 1;
  return amountInINR * rate;
}

function getCurrencySymbol() {
  switch (currentCurrency) {
    case "USD": return "$";
    case "EUR": return "€";
    case "GBP": return "£";
    default: return "₹";
  }
}

function formatCurrency(amountInINR) {
  const converted = convertAmount(amountInINR);
  return `${getCurrencySymbol()}${converted.toFixed(2)}`;
}

// ===================== RENDER FUNCTIONS =====================
function renderSummary() {
  const totalExpenses = getTotalExpenses();
  const balance = getRemainingBalance();

  salaryDisplay.textContent = formatCurrency(salary);
  expenseDisplay.textContent = formatCurrency(totalExpenses);
  balanceDisplay.textContent = formatCurrency(balance);

  // Threshold Alert (Phase 3)
  if (salary > 0 && balance < salary * 0.1) {
    balanceDisplay.classList.add("low-balance");
    warningBanner.classList.remove("hidden");
  } else {
    balanceDisplay.classList.remove("low-balance");
    warningBanner.classList.add("hidden");
  }
}

function renderExpenseTable() {
  expenseTable.innerHTML = "";

  expenses.forEach((exp) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = exp.name;

    const amountCell = document.createElement("td");
    amountCell.textContent = formatCurrency(exp.amount);

    const actionCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑 Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => deleteExpense(exp.id));

    actionCell.appendChild(deleteBtn);
    row.appendChild(nameCell);
    row.appendChild(amountCell);
    row.appendChild(actionCell);

    expenseTable.appendChild(row);
  });
}

function renderChart() {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  const totalExpenses = getTotalExpenses();
  const balance = getRemainingBalance();

  const data = {
    labels: ["Remaining Balance", "Total Expenses"],
    datasets: [
      {
        data: [Math.max(balance, 0), totalExpenses],
        backgroundColor: ["#27ae60", "#ff4d4d"],
        borderWidth: 2,
      },
    ],
  };

  if (expenseChart) {
    expenseChart.data = data;
    expenseChart.update();
  } else {
    expenseChart = new Chart(ctx, {
      type: "pie",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });
  }
}

function renderAll() {
  renderSummary();
  renderExpenseTable();
  renderChart();
}

// ===================== EVENT HANDLERS =====================
salaryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = parseFloat(salaryInput.value);

  if (isNaN(value) || value <= 0) {
    showError("Please enter a valid positive salary amount.");
    return;
  }

  salary = value;
  salaryInput.value = "";
  saveToStorage();
  renderAll();
});

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = expenseName.value.trim();
  const amount = parseFloat(expenseAmount.value);

  if (!name) {
    showError("Expense name cannot be empty.");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    showError("Expense amount must be a valid positive number.");
    return;
  }

  const newExpense = {
    id: Date.now(),
    name: name,
    amount: amount,
  };

  expenses.push(newExpense);
  expenseName.value = "";
  expenseAmount.value = "";

  saveToStorage();
  renderAll();
});

function deleteExpense(id) {
  expenses = expenses.filter((exp) => exp.id !== id);
  saveToStorage();
  renderAll();
}

// ===================== CURRENCY TOGGLE (API) =====================
async function fetchExchangeRates() {
  try {
    const response = await fetch("https://api.frankfurter.app/latest?from=INR");
    const data = await response.json();
    exchangeRates = { INR: 1, ...data.rates };
  } catch (error) {
    console.error("Currency API failed, using fallback rates:", error);
    // Fallback static rates if API/network fails
    exchangeRates = {
      INR: 1,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0095,
    };
  }
}

currencySelect.addEventListener("change", (e) => {
  currentCurrency = e.target.value;
  saveToStorage();
  renderAll();
});

// ===================== PDF REPORT (jsPDF) =====================
downloadPDFBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Cash Flow Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Total Salary: ${formatCurrency(salary)}`, 14, 35);
  doc.text(`Total Expenses: ${formatCurrency(getTotalExpenses())}`, 14, 43);
  doc.text(`Remaining Balance: ${formatCurrency(getRemainingBalance())}`, 14, 51);

  doc.setFontSize(14);
  doc.text("Expense Details:", 14, 65);

  let y = 75;
  doc.setFontSize(11);
  expenses.forEach((exp, index) => {
    doc.text(`${index + 1}. ${exp.name} - ${formatCurrency(exp.amount)}`, 14, y);
    y += 8;
  });

  if (expenses.length === 0) {
    doc.text("No expenses recorded.", 14, y);
  }

  doc.save("cashflow-report.pdf");
});

// ===================== INITIALIZATION =====================
async function init() {
  loadFromStorage();
  currencySelect.value = currentCurrency;
  await fetchExchangeRates();
  renderAll();
}

init();