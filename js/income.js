// Income Management Module
const Income = {
    incomeList: [],

    // Initialize
    async init() {
        this.incomeList = await Storage.getIncome();
        this.setupEventListeners();
        this.render();
    },

    // Setup event listeners
    setupEventListeners() {
        const addBtn = document.getElementById('addIncomeBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddForm());
        }
    },

    // Show add income form
    showAddForm(existingIncome = null) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = existingIncome ? 'Edit Income' : 'Add Income';

        modalBody.innerHTML = `
            <form id="incomeForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="incomeDate">Date</label>
                        <input type="date" id="incomeDate" class="form-input" required 
                               value="${existingIncome ? existingIncome.date : new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label for="incomeAmount">Amount</label>
                        <input type="number" id="incomeAmount" class="form-input" step="0.01" placeholder="0.00" required
                               value="${existingIncome ? existingIncome.amount : ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="incomeDescription">Description</label>
                    <input type="text" id="incomeDescription" class="form-input" placeholder="Enter description" required
                           value="${existingIncome ? existingIncome.description : ''}">
                </div>
                <div class="form-group">
                    <label for="incomeCategory">Category</label>
                    <select id="incomeCategory" class="form-select" required>
                        ${APP_CONFIG.INCOME_CATEGORIES.map(cat => 
                            `<option value="${cat}" ${existingIncome && existingIncome.category === cat ? 'selected' : ''}>${cat}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">
                        ${existingIncome ? 'Update' : 'Add'} Income
                    </button>
                </div>
            </form>
        `;

        const form = document.getElementById('incomeForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                id: existingIncome ? existingIncome.id : null, // ID will be generated in add()
                date: document.getElementById('incomeDate').value,
                description: document.getElementById('incomeDescription').value,
                category: document.getElementById('incomeCategory').value,
                amount: parseFloat(document.getElementById('incomeAmount').value)
            };

            if (existingIncome) {
                this.update(formData);
            } else {
                this.add(formData);
            }

            modal.classList.remove('active');
        });

        modal.classList.add('active');
    },

    // Add income
    async add(income) {
        // Generate a more robust ID
        income.id = Date.now() + Math.random().toString(36).substr(2, 9);
        this.incomeList.push(income);
        await this.save();
        this.render();
        await Dashboard.refresh();
    },

    // Update income
    async update(income) {
        const index = this.incomeList.findIndex(i => i.id === income.id);
        if (index !== -1) {
            this.incomeList[index] = income;
            await this.save();
            this.render();
            await Dashboard.refresh();
        }
    },

    // Delete income
    async delete(id) {
        if (confirm('Are you sure you want to delete this income entry?')) {
            this.incomeList = this.incomeList.filter(i => i.id !== id);
            await this.save();
            this.render();
            await Dashboard.refresh();
        }
    },

    // Save to storage
    async save() {
        await Storage.saveIncome(this.incomeList);
    },

    // Render income list
    render() {
        const tbody = document.getElementById('incomeTableBody');
        if (!tbody) return;

        if (this.incomeList.length === 0) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="5">No income records found</td></tr>';
            return;
        }

        tbody.innerHTML = this.incomeList
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(income => {
                // Ensure amount is a number
                const amount = typeof income.amount === 'number' ? income.amount : parseFloat(income.amount) || 0;
                
                const safeIncome = {
                    id: income.id,
                    date: income.date,
                    description: this.escapeHtml(income.description),
                    category: this.escapeHtml(income.category),
                    amount: amount
                };
                return `
                <tr data-id="${income.id}">
                    <td>${this.formatDate(income.date)}</td>
                    <td>${safeIncome.description}</td>
                    <td>${safeIncome.category}</td>
                    <td>$${amount.toFixed(2)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-small btn-secondary edit-income-btn" data-id="${income.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-small btn-danger delete-income-btn" data-id="${income.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            }).join('');
        
        // Add event listeners for edit and delete buttons
        tbody.querySelectorAll('.edit-income-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const income = this.incomeList.find(i => i.id === id);
                if (income) this.showAddForm(income);
            });
        });
        
        tbody.querySelectorAll('.delete-income-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                this.delete(id);
            });
        });
    },

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Get total income for current month
    getTotalForMonth() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return this.incomeList
            .filter(income => {
                const date = new Date(income.date);
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            })
            .reduce((sum, income) => {
                const amount = typeof income.amount === 'number' ? income.amount : parseFloat(income.amount) || 0;
                return sum + amount;
            }, 0);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Income;
}
