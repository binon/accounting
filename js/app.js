// Main Application Module
const App = {
    currentView: 'dashboard',

    // Initialize the application
    async init() {
        console.log('Initializing Simple Accounting App...');
        
        // Initialize Google Sheets first
        GoogleSheets.init();

        // Check if configured
        if (!GoogleSheets.isConfigured()) {
            this.showConfigurationRequired();
            return;
        }

        // Initialize all modules
        await Income.init();
        await Expenses.init();
        await Invoices.init();
        Dashboard.init();

        // Setup event listeners
        this.setupNavigation();
        this.setupModals();

        // Check for overdue invoices
        Invoices.updateOverdueStatus();

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
        const modalClose = document.getElementById('modalClose');

        // Close modal on close button
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        // Close modal on background click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.classList.remove('active');
            }
        });
    },



    // Show configuration required message
    showConfigurationRequired() {
        const mainContent = document.querySelector('.app-main');
        if (mainContent) {
            mainContent.innerHTML = `
                <div style="text-align: center; padding: 50px; max-width: 600px; margin: 0 auto;">
                    <i class="fas fa-cog" style="font-size: 64px; color: #6366f1; margin-bottom: 20px;"></i>
                    <h2>Configuration Required</h2>
                    <p style="margin: 20px 0;">Please configure your Google Sheets integration in config.js to use Simple Accounting.</p>
                    <p style="margin-bottom: 30px;">You'll need to update the following in js/config.js:</p>
                    <ul style="text-align: left; display: inline-block;">
                        <li>SPREADSHEET_ID - Your Google Spreadsheet ID</li>
                        <li>API_KEY - Your Google API Key (for read access)</li>
                        <li>WEB_APP_URL - Your Google Apps Script Web App URL (for write access)</li>
                    </ul>
                    <br><br>
                    <p style="margin-top: 20px; color: #666;">After updating config.js, refresh the page to load your data.</p>
                </div>
            `;
        }
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init().catch(error => {
            console.error('Failed to initialize app:', error);
            alert('Failed to load data from Google Sheets. Please check your configuration.');
        });
    });
} else {
    App.init().catch(error => {
        console.error('Failed to initialize app:', error);
        alert('Failed to load data from Google Sheets. Please check your configuration.');
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
