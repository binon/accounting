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
        this.setupSettings();

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
        const webAppUrlInput = document.getElementById('webAppUrl');

        if (spreadsheetIdInput) {
            spreadsheetIdInput.value = settings.spreadsheetId || '';
        }
        if (apiKeyInput) {
            apiKeyInput.value = settings.apiKey || '';
        }
        if (webAppUrlInput) {
            webAppUrlInput.value = settings.webAppUrl || '';
        }

        settingsModal.classList.add('active');
    },

    // Save settings
    async saveSettings() {
        const spreadsheetId = document.getElementById('spreadsheetId').value.trim();
        const apiKey = document.getElementById('apiKey').value.trim();
        const webAppUrl = document.getElementById('webAppUrl').value.trim();

        const settings = {
            spreadsheetId,
            apiKey,
            webAppUrl
        };

        if (Storage.saveSettings(settings)) {
            GoogleSheets.init();
            alert('Settings saved successfully! Reloading data...');
            document.getElementById('settingsModal').classList.remove('active');
            
            // Reload the application with new settings
            location.reload();
        } else {
            alert('Error saving settings. Please try again.');
        }
    },

    // Show configuration required message
    showConfigurationRequired() {
        const mainContent = document.querySelector('.app-main');
        if (mainContent) {
            mainContent.innerHTML = `
                <div style="text-align: center; padding: 50px; max-width: 600px; margin: 0 auto;">
                    <i class="fas fa-cog" style="font-size: 64px; color: #6366f1; margin-bottom: 20px;"></i>
                    <h2>Configuration Required</h2>
                    <p style="margin: 20px 0;">Please configure your Google Sheets integration to use Simple Accounting.</p>
                    <p style="margin-bottom: 30px;">You'll need:</p>
                    <ul style="text-align: left; display: inline-block;">
                        <li>Google Spreadsheet ID</li>
                        <li>Google API Key (for read access)</li>
                        <li>Google Apps Script Web App URL (for write access)</li>
                    </ul>
                    <br><br>
                    <button onclick="App.showSettings()" class="btn btn-primary" style="margin-top: 20px;">
                        <i class="fas fa-cog"></i> Open Settings
                    </button>
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
