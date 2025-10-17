// Main Application Module
const App = {
    currentView: 'dashboard',

    // Initialize the application
    init() {
        console.log('Initializing Simple Accounting App...');
        
        // Initialize all modules
        Income.init();
        Expenses.init();
        Invoices.init();
        Dashboard.init();
        GoogleSheets.init();

        // Setup event listeners
        this.setupNavigation();
        this.setupModals();
        this.setupSettings();
        this.setupSync();

        // Check for overdue invoices
        Invoices.updateOverdueStatus();

        // Show welcome message if first time
        this.showWelcomeIfNeeded();

        console.log('App initialized successfully!');
    },

    // Setup navigation
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.getAttribute('data-view');
                this.switchView(view);
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    },

    // Switch between views
    switchView(viewName) {
        // Hide all views
        const views = document.querySelectorAll('.view');
        views.forEach(view => view.classList.remove('active'));

        // Show selected view
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewName;
        }
    },

    // Setup modal functionality
    setupModals() {
        const modal = document.getElementById('modal');
        const settingsModal = document.getElementById('settingsModal');
        const modalClose = document.getElementById('modalClose');
        const settingsClose = document.getElementById('settingsClose');

        // Close modal on close button
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        if (settingsClose) {
            settingsClose.addEventListener('click', () => {
                settingsModal.classList.remove('active');
            });
        }

        // Close modal on background click
        [modal, settingsModal].forEach(m => {
            if (m) {
                m.addEventListener('click', (e) => {
                    if (e.target === m) {
                        m.classList.remove('active');
                    }
                });
            }
        });

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.classList.remove('active');
                settingsModal.classList.remove('active');
            }
        });
    },

    // Setup settings
    setupSettings() {
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        const saveSettingsBtn = document.getElementById('saveSettings');

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSettings();
            });
        }

        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }
    },

    // Show settings modal
    showSettings() {
        const settingsModal = document.getElementById('settingsModal');
        const settings = Storage.getSettings();

        // Populate settings
        const spreadsheetIdInput = document.getElementById('spreadsheetId');
        const apiKeyInput = document.getElementById('apiKey');

        if (spreadsheetIdInput) {
            spreadsheetIdInput.value = settings.spreadsheetId || '';
        }
        if (apiKeyInput) {
            apiKeyInput.value = settings.apiKey || '';
        }

        settingsModal.classList.add('active');
    },

    // Save settings
    saveSettings() {
        const spreadsheetId = document.getElementById('spreadsheetId').value.trim();
        const apiKey = document.getElementById('apiKey').value.trim();

        const settings = {
            spreadsheetId,
            apiKey,
            lastSync: Storage.getSettings().lastSync
        };

        if (Storage.saveSettings(settings)) {
            GoogleSheets.init();
            alert('Settings saved successfully!');
            document.getElementById('settingsModal').classList.remove('active');
        } else {
            alert('Error saving settings. Please try again.');
        }
    },

    // Setup sync functionality
    setupSync() {
        const syncBtn = document.getElementById('syncBtn');
        
        if (syncBtn) {
            syncBtn.addEventListener('click', async () => {
                await this.syncWithGoogleSheets();
            });
        }
    },

    // Sync with Google Sheets
    async syncWithGoogleSheets() {
        const syncBtn = document.getElementById('syncBtn');
        const syncIcon = syncBtn.querySelector('i');

        if (!GoogleSheets.isConfigured()) {
            alert('Please configure Google Sheets integration in Settings first.');
            this.showSettings();
            return;
        }

        try {
            // Show loading state
            syncBtn.disabled = true;
            syncIcon.classList.add('fa-spin');

            // Perform sync
            await GoogleSheets.syncFromSheets();

            // Reload data
            Income.incomeList = Storage.getIncome();
            Income.render();
            
            Expenses.expensesList = Storage.getExpenses();
            Expenses.render();
            
            Invoices.invoicesList = Storage.getInvoices();
            Invoices.render();
            
            Dashboard.refresh();

            // Show detailed sync results
            const incomeCount = Income.incomeList.length;
            const expensesCount = Expenses.expensesList.length;
            const invoicesCount = Invoices.invoicesList.length;
            const syncMessage = `Successfully synced with Google Sheets!\n\nSynced items:\n- Income: ${incomeCount}\n- Expenses: ${expensesCount}\n- Invoices: ${invoicesCount}`;
            alert(syncMessage);
        } catch (error) {
            console.error('Sync error:', error);
            alert('Error syncing with Google Sheets: ' + error.message);
        } finally {
            // Remove loading state
            syncBtn.disabled = false;
            syncIcon.classList.remove('fa-spin');
        }
    },

    // Show welcome message if first time
    showWelcomeIfNeeded() {
        const hasSeenWelcome = localStorage.getItem('simple_accounting_welcome_seen');
        
        if (!hasSeenWelcome) {
            setTimeout(() => {
                const settings = Storage.getSettings();
                if (!settings.spreadsheetId) {
                    if (confirm('Welcome to Simple Accounting! Would you like to configure Google Sheets integration now?')) {
                        this.showSettings();
                    }
                }
                localStorage.setItem('simple_accounting_welcome_seen', 'true');
            }, 1000);
        }
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
