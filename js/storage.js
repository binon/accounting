// Local Storage Manager
const Storage = {
    // Save data to localStorage
    save(key, data) {
        try {
            const prefixedKey = APP_CONFIG.STORAGE_PREFIX + key;
            localStorage.setItem(prefixedKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to storage:', error);
            return false;
        }
    },

    // Load data from localStorage
    load(key, defaultValue = null) {
        try {
            const prefixedKey = APP_CONFIG.STORAGE_PREFIX + key;
            const data = localStorage.getItem(prefixedKey);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error loading from storage:', error);
            return defaultValue;
        }
    },

    // Remove data from localStorage
    remove(key) {
        try {
            const prefixedKey = APP_CONFIG.STORAGE_PREFIX + key;
            localStorage.removeItem(prefixedKey);
            return true;
        } catch (error) {
            console.error('Error removing from storage:', error);
            return false;
        }
    },

    // Clear all app data
    clearAll() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(APP_CONFIG.STORAGE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    },

    // Get income data
    getIncome() {
        return this.load('income', []);
    },

    // Save income data
    saveIncome(incomeList) {
        return this.save('income', incomeList);
    },

    // Get expenses data
    getExpenses() {
        return this.load('expenses', []);
    },

    // Save expenses data
    saveExpenses(expensesList) {
        return this.save('expenses', expensesList);
    },

    // Get invoices data
    getInvoices() {
        return this.load('invoices', []);
    },

    // Save invoices data
    saveInvoices(invoicesList) {
        return this.save('invoices', invoicesList);
    },

    // Get settings
    getSettings() {
        return this.load('settings', {
            spreadsheetId: '',
            apiKey: '',
            lastSync: null
        });
    },

    // Save settings
    saveSettings(settings) {
        return this.save('settings', settings);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
