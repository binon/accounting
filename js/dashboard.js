// Dashboard Module
const Dashboard = {
    // Initialize dashboard
    init() {
        this.refresh();
    },

    // Refresh dashboard data
    refresh() {
        this.updateSummaryCards();
        this.updateRecentTransactions();
    },

    // Update summary cards
    updateSummaryCards() {
        // Total income
        const totalIncome = Income.getTotalForMonth();
        const safeIncome = typeof totalIncome === 'number' ? totalIncome : 0;
        const incomeEl = document.getElementById('totalIncome');
        if (incomeEl) {
            incomeEl.textContent = `$${safeIncome.toFixed(2)}`;
        }

        // Total expenses
        const totalExpenses = Expenses.getTotalForMonth();
        const safeExpenses = typeof totalExpenses === 'number' ? totalExpenses : 0;
        const expensesEl = document.getElementById('totalExpenses');
        if (expensesEl) {
            expensesEl.textContent = `$${safeExpenses.toFixed(2)}`;
        }

        // Net profit
        const netProfit = safeIncome - safeExpenses;
        const profitEl = document.getElementById('netProfit');
        if (profitEl) {
            profitEl.textContent = `$${netProfit.toFixed(2)}`;
            profitEl.style.color = netProfit >= 0 ? 'var(--income-color)' : 'var(--expense-color)';
        }

        // Pending invoices
        const pendingInvoices = Invoices.getPendingCount();
        const invoicesEl = document.getElementById('pendingInvoices');
        if (invoicesEl) {
            invoicesEl.textContent = pendingInvoices;
        }
    },

    // Update recent transactions
    updateRecentTransactions() {
        const container = document.getElementById('recentTransactions');
        if (!container) return;

        // Combine income and expenses
        const transactions = [];

        // Add income transactions
        Income.incomeList.forEach(income => {
            transactions.push({
                ...income,
                type: 'income',
                icon: 'fa-arrow-up'
            });
        });

        // Add expenses transactions
        Expenses.expensesList.forEach(expense => {
            transactions.push({
                ...expense,
                type: 'expense',
                icon: 'fa-arrow-down'
            });
        });

        // Sort by date (most recent first)
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Take only the 10 most recent
        const recentTransactions = transactions.slice(0, 10);

        if (recentTransactions.length === 0) {
            container.innerHTML = '<p class="empty-state">No recent transactions</p>';
            return;
        }

        container.innerHTML = recentTransactions.map(transaction => {
            // Ensure amount is a number
            const amount = typeof transaction.amount === 'number' ? transaction.amount : parseFloat(transaction.amount) || 0;
            
            return `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-icon ${transaction.type}">
                        <i class="fas ${transaction.icon}"></i>
                    </div>
                    <div class="transaction-details">
                        <h4>${transaction.description}</h4>
                        <p>${transaction.category} • ${this.formatDate(transaction.date)}</p>
                    </div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}$${amount.toFixed(2)}
                </div>
            </div>
        `;
        }).join('');
    },

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
}
