let totalAmount = 0;
const expenseCategories = {};
const categoryColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const ctx = document.getElementById('expenseChart').getContext('2d');
let expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: categoryColors,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
});

function updateChart() {
    expenseChart.data.labels = Object.keys(expenseCategories);
    expenseChart.data.datasets[0].data = Object.values(expenseCategories);
    expenseChart.update();
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
}

function clearError() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';
}

function addExpense() {
    const expenseName = document.getElementById('expenseName').value.trim();
    const expenseAmount = parseFloat(document.getElementById('expenseAmount').value);
    let expenseCategory = document.getElementById('expenseCategory').value;
    const expenseDate = document.getElementById('expenseDate').value;

    // If category is "Other", use the custom category
    if (expenseCategory === 'Other') {
        const customCategory = document.getElementById('customCategory').value.trim();
        if (customCategory) {
            expenseCategory = customCategory;
        } else {
            showError('Please enter a custom category.');
            return;
        }
    }

    clearError();

    // Validation
    if (!expenseName || isNaN(expenseAmount) || expenseAmount <= 0 || !expenseCategory || !expenseDate) {
        showError('Please fill all fields correctly.');
        return;
    }

    // Add expense to the list
    const expenseList = document.getElementById('expenseList');
    const li = document.createElement('li');
    li.innerHTML = `${expenseDate}: ${expenseName} - ₹${expenseAmount.toFixed(2)} [${expenseCategory}] <button onclick="deleteExpense(this, ${expenseAmount}, '${expenseCategory}')">Delete</button>`;
    expenseList.appendChild(li);

    // Update total amount
    totalAmount += expenseAmount;
    document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);

    // Update category amounts
    if (expenseCategories[expenseCategory]) {
        expenseCategories[expenseCategory] += expenseAmount;
    } else {
        expenseCategories[expenseCategory] = expenseAmount;
    }

    // Update chart
    updateChart();

    // Clear input fields
    document.getElementById('expenseName').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseCategory').value = '';
    document.getElementById('expenseDate').value = '';
    document.getElementById('customCategory').value = '';
    document.getElementById('customCategory').style.display = 'none';
}

function deleteExpense(element, amount, category) {
    // Remove expense from list
    element.parentElement.remove();

    // Update total amount
    totalAmount -= amount;
    document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);

    // Update category amounts
    expenseCategories[category] -= amount;
    if (expenseCategories[category] <= 0) {
        delete expenseCategories[category];
    }

    // Update chart
    updateChart();
}

// Show/Hide custom category input
document.getElementById('expenseCategory').addEventListener('change', function () {
    const customCategoryInput = document.getElementById('customCategory');
    if (this.value === 'Other') {
        customCategoryInput.style.display = 'block';
    } else {
        customCategoryInput.style.display = 'none';
    }
});
