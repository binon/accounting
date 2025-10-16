// Invoices Management Module
const Invoices = {
    invoicesList: [],

    // Initialize
    init() {
        this.invoicesList = Storage.getInvoices();
        this.setupEventListeners();
        this.render();
    },

    // Setup event listeners
    setupEventListeners() {
        const addBtn = document.getElementById('addInvoiceBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddForm());
        }
    },

    // Show add invoice form
    showAddForm(existingInvoice = null) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = existingInvoice ? 'Edit Invoice' : 'Create Invoice';

        modalBody.innerHTML = `
            <form id="invoiceForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="invoiceNumber">Invoice Number</label>
                        <input type="text" id="invoiceNumber" class="form-input" placeholder="INV-001" required
                               value="${existingInvoice ? existingInvoice.invoicenumber : 'INV-' + (this.invoicesList.length + 1).toString().padStart(3, '0')}">
                    </div>
                    <div class="form-group">
                        <label for="invoiceClient">Client Name</label>
                        <input type="text" id="invoiceClient" class="form-input" placeholder="Client name" required
                               value="${existingInvoice ? existingInvoice.client : ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="invoiceDate">Invoice Date</label>
                        <input type="date" id="invoiceDate" class="form-input" required 
                               value="${existingInvoice ? existingInvoice.date : new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label for="invoiceDueDate">Due Date</label>
                        <input type="date" id="invoiceDueDate" class="form-input" required
                               value="${existingInvoice ? existingInvoice.duedate : this.getDefaultDueDate()}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="invoiceAmount">Amount</label>
                        <input type="number" id="invoiceAmount" class="form-input" step="0.01" placeholder="0.00" required
                               value="${existingInvoice ? existingInvoice.amount : ''}">
                    </div>
                    <div class="form-group">
                        <label for="invoiceStatus">Status</label>
                        <select id="invoiceStatus" class="form-select" required>
                            <option value="pending" ${existingInvoice && existingInvoice.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="paid" ${existingInvoice && existingInvoice.status === 'paid' ? 'selected' : ''}>Paid</option>
                            <option value="overdue" ${existingInvoice && existingInvoice.status === 'overdue' ? 'selected' : ''}>Overdue</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">
                        ${existingInvoice ? 'Update' : 'Create'} Invoice
                    </button>
                </div>
            </form>
        `;

        const form = document.getElementById('invoiceForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                id: existingInvoice ? existingInvoice.id : Date.now(),
                invoicenumber: document.getElementById('invoiceNumber').value,
                client: document.getElementById('invoiceClient').value,
                date: document.getElementById('invoiceDate').value,
                duedate: document.getElementById('invoiceDueDate').value,
                amount: parseFloat(document.getElementById('invoiceAmount').value),
                status: document.getElementById('invoiceStatus').value
            };

            if (existingInvoice) {
                this.update(formData);
            } else {
                this.add(formData);
            }

            modal.classList.remove('active');
        });

        modal.classList.add('active');
    },

    // Get default due date (30 days from now)
    getDefaultDueDate() {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date.toISOString().split('T')[0];
    },

    // Add invoice
    add(invoice) {
        this.invoicesList.push(invoice);
        this.save();
        this.render();
        Dashboard.refresh();
    },

    // Update invoice
    update(invoice) {
        const index = this.invoicesList.findIndex(i => i.id === invoice.id);
        if (index !== -1) {
            this.invoicesList[index] = invoice;
            this.save();
            this.render();
            Dashboard.refresh();
        }
    },

    // Delete invoice
    delete(id) {
        if (confirm('Are you sure you want to delete this invoice?')) {
            this.invoicesList = this.invoicesList.filter(i => i.id !== id);
            this.save();
            this.render();
            Dashboard.refresh();
        }
    },

    // Save to storage
    save() {
        Storage.saveInvoices(this.invoicesList);
    },

    // Render invoices list
    render() {
        const tbody = document.getElementById('invoiceTableBody');
        if (!tbody) return;

        if (this.invoicesList.length === 0) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No invoices found</td></tr>';
            return;
        }

        tbody.innerHTML = this.invoicesList
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(invoice => `
                <tr>
                    <td><strong>${invoice.invoicenumber}</strong></td>
                    <td>${invoice.client}</td>
                    <td>${this.formatDate(invoice.date)}</td>
                    <td>${this.formatDate(invoice.duedate)}</td>
                    <td>$${invoice.amount.toFixed(2)}</td>
                    <td>
                        <span class="status-badge ${invoice.status}">
                            ${invoice.status}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-small btn-secondary" onclick="Invoices.showAddForm(${JSON.stringify(invoice).replace(/"/g, '&quot;')})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-small btn-danger" onclick="Invoices.delete(${invoice.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
    },

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    // Get pending invoices count
    getPendingCount() {
        return this.invoicesList.filter(invoice => invoice.status === 'pending').length;
    },

    // Update overdue invoices
    updateOverdueStatus() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let updated = false;
        this.invoicesList.forEach(invoice => {
            if (invoice.status === 'pending') {
                const dueDate = new Date(invoice.duedate);
                dueDate.setHours(0, 0, 0, 0);
                
                if (dueDate < today) {
                    invoice.status = 'overdue';
                    updated = true;
                }
            }
        });

        if (updated) {
            this.save();
            this.render();
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Invoices;
}
