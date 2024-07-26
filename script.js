const disExpense = document.querySelector('#total-exp');
const inputAmount = document.querySelector('#amount');
const inputTitle = document.querySelector('#place');
const inputDate = document.querySelector('#date');
const form = document.querySelector('#form');
const signout = document.querySelector('#sign-out');
const addCategoryButton = document.querySelector('#add-category');
const categorySelect = document.querySelector('#category');
const userImage = document.querySelector('#userImage');
const uname = document.querySelector('#h1');
const helloName = document.querySelector('#welcome');
const rec = document.getElementById('records');
const totalSpentSpan = document.getElementById('total-spent');
const highestCategorySpan = document.getElementById('highest-category');
const numTransactionsSpan = document.getElementById('num-transactions');
const avgDailySpan = document.getElementById('avg-daily');
const spendingTrendSpan = document.getElementById('spending-trend');

let totalExpenses = 0;
let expenses = [];
let isEditing = false;
let editingId = null;
let categoryChart = null;

form.addEventListener('submit', logSubmit);
addCategoryButton.addEventListener('click', addNewCategory);

signout.addEventListener('click', () => {
    window.location.assign('index.html');
});

document.addEventListener('DOMContentLoaded', () => {
    showStats('current-month');
    inputDate.value = new Date().toISOString().split('T')[0];
});

function logSubmit(e) {  
    e.preventDefault();
    
    const txtAmount = inputAmount.value;
    if (!txtAmount || isNaN(txtAmount) || parseFloat(txtAmount) <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    const expense = parseFloat(txtAmount);
    const icons = checkIcon();
    const category = checkButton();
    const date = new Date(inputDate.value);
    const timestamp = date.getTime();
    const formattedDate = formatDate(date);

    if (isEditing) {
        const expenseIndex = expenses.findIndex(exp => exp.id === editingId);
        expenses[expenseIndex].amountSpent = expense;
        expenses[expenseIndex].item = inputTitle.value;
        expenses[expenseIndex].cat = category;
        expenses[expenseIndex].date = formattedDate;
        expenses[expenseIndex].timestamp = timestamp;
        updateElements(expenses[expenseIndex]);
        isEditing = false;
        editingId = null;
        form.querySelector('#submit').textContent = 'Add to Expense';
    } else {
        const expenseData = {
            icon: icons,
            item: inputTitle.value,
            cat: category,
            amountSpent: expense,
            date: formattedDate,
            timestamp: timestamp,
            id: new Date().getTime().toString(),
        };
        expenses.push(expenseData);
        addElements(expenseData);
    }
    
    updateTotalExpenses();
    updateSummary();

    inputAmount.value = '';
    inputTitle.value = '';
    inputDate.value = new Date().toISOString().split('T')[0];
}

function addElements(data) {
    const div1 = document.createElement('div');
    div1.setAttribute('id', 'bottom-records');
    div1.dataset.id = data.id;

    const div2 = document.createElement('div');
    div2.setAttribute('id', 'icon-box');
    const iconn = document.createElement('i');
    div2.appendChild(iconn);
    div1.appendChild(div2);

    const div3 = document.createElement('div');
    div3.setAttribute('id', 'item-text1');
    const item = document.createElement('H1');
    item.setAttribute('id', 'item-h1');
    const p1 = document.createElement('P');
    div3.appendChild(item);
    div3.appendChild(p1);
    div1.appendChild(div3);

    const div4 = document.createElement('div');
    div4.setAttribute('id', 'item-text2');
    const price = document.createElement('H2');
    price.setAttribute('id', 'item-price');
    const p2 = document.createElement('P');
    div4.appendChild(price);
    div4.appendChild(p2);
    div1.appendChild(div4);

    const divEdit = document.createElement('div');
    divEdit.setAttribute('id', 'item-edit');
    const edit = document.createElement('i');
    edit.setAttribute('class', 'fas fa-edit');
    divEdit.appendChild(edit);
    div1.appendChild(divEdit);

    const div5 = document.createElement('div');
    div5.setAttribute('id', 'item-delete');
    const del = document.createElement('i');
    del.setAttribute('class', 'fas fa-times');
    div5.appendChild(del);
    div1.appendChild(div5);

    divEdit.addEventListener("click", () => {
        inputAmount.value = data.amountSpent;
        inputTitle.value = data.item;
        inputDate.value = formatDate(new Date(data.timestamp));
        categorySelect.value = data.cat;
        isEditing = true;
        editingId = data.id;
        form.querySelector('#submit').textContent = 'Save Changes';
    });

    div5.addEventListener("click", () => {
        expenses = expenses.filter(exp => exp.id !== data.id);
        if (editingId === data.id) {
            isEditing = false;
            editingId = null;
            form.querySelector('#submit').textContent = 'Add to Expense';
        }
        updateTotalExpenses();
        updateSummary();
        rec.removeChild(div1);
    });

    iconn.innerHTML = data.icon;
    item.innerHTML = data.item;
    p1.innerHTML = data.cat;
    price.innerHTML = '&#36; ' + data.amountSpent;
    p2.innerHTML = data.date;

    rec.appendChild(div1);
}

function updateElements(data) {
    const recordDiv = document.querySelector(`#bottom-records[data-id='${data.id}']`);

    if (recordDiv) {
        const iconn = recordDiv.querySelector('#icon-box i');
        const item = recordDiv.querySelector('#item-text1 h1');
        const p1 = recordDiv.querySelector('#item-text1 p');
        const price = recordDiv.querySelector('#item-text2 h2');
        const p2 = recordDiv.querySelector('#item-text2 p');

        iconn.innerHTML = data.icon;
        item.innerHTML = data.item;
        p1.innerHTML = data.cat;
        price.innerHTML = '&#36; ' + data.amountSpent;
        p2.innerHTML = data.date;
    }
}

function checkIcon() {
    const category = document.getElementById('category').value;
    switch(category) {
        case 'Food/Beverage':
            return `<i class="fas fa-pizza-slice"></i>`;
        case 'Travel/Commute':
            return `<i class="fas fa-car"></i>`;
        case 'Shopping':
            return `<i class="fas fa-shopping-bag"></i>`;
        case 'Housing/Utilities':
            return `<i class="fas fa-home"></i>`;
        case 'Entertainment':
            return `<i class="fas fa-film"></i>`;
        case 'Health/Medical':
            return `<i class="fas fa-heartbeat"></i>`;
        case 'Education':
            return `<i class="fas fa-graduation-cap"></i>`;
        case 'Savings/Investments':
            return `<i class="fas fa-piggy-bank"></i>`;
        case 'Insurance':
            return `<i class="fas fa-shield-alt"></i>`;
        case 'Gifts/Donations':
            return `<i class="fas fa-gift"></i>`;
        case 'Miscellaneous':
            return `<i class="fas fa-ellipsis-h"></i>`;
        default:
            return `<i class="fas fa-question-circle"></i>`;
    }
}

function checkButton() {  
    return document.getElementById('category').value;
}

function addNewCategory() {
    const newCategory = prompt("Please enter the new category:");
    if (newCategory) {
        const option = document.createElement("option");
        option.value = newCategory;
        option.textContent = newCategory;
        categorySelect.appendChild(option);
        categorySelect.value = newCategory;
    }
}

function updateTotalExpenses() {
    totalExpenses = expenses.reduce((sum, expense) => sum + expense.amountSpent, 0);
    disExpense.textContent = totalExpenses.toFixed(2);
}

function updateSummary() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const last30Days = now.getTime() - (30 * 24 * 60 * 60 * 1000);

    let last30DaysTotal = 0;
    let currentMonthTotal = 0;
    let currentYearTotal = 0;
    let transactionsLast30Days = 0;
    let transactionsCurrentMonth = 0;
    let transactionsCurrentYear = 0;
    let categoryTotals30Days = {};
    let categoryTotalsCurrentMonth = {};

    expenses.forEach(expense => {
        if (expense.timestamp >= last30Days) {
            last30DaysTotal += expense.amountSpent;
            transactionsLast30Days++;
            categoryTotals30Days[expense.cat] = (categoryTotals30Days[expense.cat] || 0) + expense.amountSpent;
        }
        const expenseDate = new Date(expense.timestamp);
        if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
            currentMonthTotal += expense.amountSpent;
            transactionsCurrentMonth++;
            categoryTotalsCurrentMonth[expense.cat] = (categoryTotalsCurrentMonth[expense.cat] || 0) + expense.amountSpent;
        }
        if (expenseDate.getFullYear() === currentYear) {
            currentYearTotal += expense.amountSpent;
            transactionsCurrentYear++;
        }
    });

    const highestCategoryCurrentMonth = Object.keys(categoryTotalsCurrentMonth).reduce((a, b) => categoryTotalsCurrentMonth[a] > categoryTotalsCurrentMonth[b] ? a : b, 'N/A');

    totalSpentSpan.textContent = last30DaysTotal.toFixed(2);
    highestCategorySpan.textContent = highestCategoryCurrentMonth;
    numTransactionsSpan.textContent = transactionsLast30Days;
    avgDailySpan.textContent = (last30DaysTotal / 30).toFixed(2);
    updateSpendingTrend();
    updateCategoryChart(categoryTotals30Days);
}

function updateSpendingTrend() {
    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let lastMonthTotal = 0;
    let thisMonthTotal = 0;
    let lastMonthDays = lastMonthEnd.getDate();
    let thisMonthDays = now.getDate();

    expenses.forEach(expense => {
        const expenseDate = new Date(expense.timestamp);
        if (expenseDate >= lastMonthStart && expenseDate <= lastMonthEnd) {
            lastMonthTotal += expense.amountSpent;
        }
        if (expenseDate >= thisMonthStart) {
            thisMonthTotal += expense.amountSpent;
        }
    });

    const avgDailyLastMonth = lastMonthTotal / lastMonthDays;
    const avgDailyThisMonth = thisMonthTotal / thisMonthDays;

    const trendDifference = avgDailyThisMonth - avgDailyLastMonth;
    let trendPercentage = (trendDifference / avgDailyLastMonth) * 100;

    if (isNaN(trendPercentage) || avgDailyLastMonth === 0) {
        trendPercentage = 'N/A';
    } else {
        trendPercentage = trendPercentage.toFixed(1) + '%';
    }

    if (trendDifference > 0) {
        spendingTrendSpan.innerHTML = `$${avgDailyThisMonth.toFixed(2)} (+${trendPercentage}) <i class="fas fa-arrow-up"></i>`;
        spendingTrendSpan.classList.remove('decrease');
        spendingTrendSpan.classList.add('increase');
    } else if (trendDifference < 0) {
        spendingTrendSpan.innerHTML = `$${avgDailyThisMonth.toFixed(2)} (${trendPercentage}) <i class="fas fa-arrow-down"></i>`;
        spendingTrendSpan.classList.remove('increase');
        spendingTrendSpan.classList.add('decrease');
    } else {
        spendingTrendSpan.innerHTML = `$${avgDailyThisMonth.toFixed(2)} (0%)`;
        spendingTrendSpan.classList.remove('increase', 'decrease');
    }
}

function showStats(period) {
    const now = new Date();
    let startDate, endDate;

    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

    switch (period) {
        case '30-days':
            startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
            endDate = now;
            document.getElementById('tab-30-days').classList.add('active');
            break;
        case 'current-month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = now;
            document.getElementById('tab-current-month').classList.add('active');
            break;
        case '90-days':
            startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
            endDate = now;
            document.getElementById('tab-90-days').classList.add('active');
            break;
        case 'current-year':
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = now;
            document.getElementById('tab-current-year').classList.add('active');
            break;
        case 'custom':
            startDate = new Date(document.getElementById('start-date').value);
            endDate = new Date(document.getElementById('end-date').value);
            break;
        default:
            startDate = new Date();
            endDate = new Date();
    }

    let totalSpent = 0;
    let numTransactions = 0;
    let categoryTotals = {};

    expenses.forEach(expense => {
        if (expense.timestamp >= startDate.getTime() && expense.timestamp <= endDate.getTime()) {
            totalSpent += expense.amountSpent;
            numTransactions++;
            categoryTotals[expense.cat] = (categoryTotals[expense.cat] || 0) + expense.amountSpent;
        }
    });

    const highestCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b, 'N/A');
    const avgDailySpending = totalSpent / ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    totalSpentSpan.textContent = totalSpent.toFixed(2);
    highestCategorySpan.textContent = highestCategory;
    numTransactionsSpan.textContent = numTransactions;
    avgDailySpan.textContent = avgDailySpending.toFixed(2);
    updateSpendingTrend();
    updateCategoryChart(categoryTotals);
}

document.addEventListener('DOMContentLoaded', () => {
    showStats('30-days');
    document.getElementById('tab-30-days').classList.add('active');
    inputDate.value = new Date().toISOString().split('T')[0];
});


function updateCategoryChart(categoryTotals) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expense Categories',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(199, 199, 199, 0.2)',
                    'rgba(83, 102, 255, 0.2)',
                    'rgba(255, 203, 64, 0.2)',
                    'rgba(72, 159, 64, 0.2)',
                    'rgba(150, 102, 199, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)',
                    'rgba(255, 203, 64, 1)',
                    'rgba(72, 159, 64, 1)',
                    'rgba(150, 102, 199, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            layout: {
                padding: 25
            },
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(2) + '%';
                            return `${label}: ${percentage}`;
                        }
                    }
                }
            }
        }
    });

    document.getElementById('chart-container').style.display = labels.length > 0 ? 'block' : 'none';
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}
