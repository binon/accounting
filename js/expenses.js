// Expenses Management Module
const Expenses = {
    expensesList: [],

    // Initialize
    init() {
        this.expensesList = Storage.getExpenses();
        this.setupEventListeners();
        this.render();
    },

    // Setup event listeners
    setupEventListeners() {
        const addBtn = document.getElementById('addExpenseBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddForm());
        }
    },

    // Show add expense form
    showAddForm(existingExpense = null) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = existingExpense ? 'Edit Expense' : 'Add Expense';

        modalBody.innerHTML = `
            <form id="expenseForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="expenseDate">Date</label>
                        <input type="date" id="expenseDate" class="form-input" required 
                               value="${existingExpense ? existingExpense.date : new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label for="expenseAmount">Amount</label>
                        <input type="number" id="expenseAmount" class="form-input" step="0.01" placeholder="0.00" required
                               value="${existingExpense ? existingExpense.amount : ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="expenseDescription">Description</label>
                    <input type="text" id="expenseDescription" class="form-input" placeholder="Enter description" required
                           value="${existingExpense ? existingExpense.description : ''}">
                </div>
                <div class="form-group">
                    <label for="expenseCategory">Category</label>
                    <select id="expenseCategory" class="form-select" required>
                        ${APP_CONFIG.EXPENSE_CATEGORIES.map(cat => 
                            `<option value="${cat}" ${existingExpense && existingExpense.category === cat ? 'selected' : ''}>${cat}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">
                        ${existingExpense ? 'Update' : 'Add'} Expense
                    </button>
                </div>
            </form>
        `;

        const form = document.getElementById('expenseForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                id: existingExpense ? existingExpense.id : Date.now(),
                date: document.getElementById('expenseDate').value,
                description: document.getElementById('expenseDescription').value,
                category: document.getElementById('expenseCategory').value,
                amount: parseFloat(document.getElementById('expenseAmount').value)
            };

            if (existingExpense) {
                this.update(formData);
            } else {
                this.add(formData);
            }

            modal.classList.remove('active');
        });

        modal.classList.add('active');
    },

    // Add expense
    add(expense) {
        this.expensesList.push(expense);
        this.save();
        this.render();
        Dashboard.refresh();
    },

    // Update expense
    update(expense) {
        const index = this.expensesList.findIndex(e => e.id === expense.id);
        if (index !== -1) {
            this.expensesList[index] = expense;
            this.save();
            this.render();
            Dashboard.refresh();
        }
    },

    // Delete expense
    delete(id) {
        if (confirm('Are you sure you want to delete this expense entry?')) {
            this.expensesList = this.expensesList.filter(e => e.id !== id);
            this.save();
            this.render();
            Dashboard.refresh();
        }
    },

    // Save to storage
    save() {
        Storage.saveExpenses(this.expensesList);
    },

    // Render expenses list
    render() {
        const tbody = document.getElementById('expenseTableBody');
        if (!tbody) return;

        if (this.expensesList.length === 0) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="5">No expense records found</td></tr>';
            return;
        }

        tbody.innerHTML = this.expensesList
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(expense => {
                // Ensure amount is a number
                const amount = typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount) || 0;
                
                return `
                <tr>
                    <td>${this.formatDate(expense.date)}</td>
                    <td>${expense.description}</td>
                    <td>${expense.category}</td>
                    <td>$${amount.toFixed(2)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-small btn-secondary" onclick="Expenses.showAddForm(${JSON.stringify(expense).replace(/"/g, '&quot;')})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-small btn-danger" onclick="Expenses.delete(${expense.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            }).join('');
    },

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    // Get total expenses for current month
    getTotalForMonth() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return this.expensesList
            .filter(expense => {
                const date = new Date(expense.date);
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            })
            .reduce((sum, expense) => {
                const amount = typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount) || 0;
                return sum + amount;
            }, 0);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Expenses;
}
