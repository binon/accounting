// Google Sheets Storage Manager - Direct integration with Google Sheets
const Storage = {
    // Get income data from Google Sheets
    async getIncome() {
        try {
            const data = await GoogleSheets.fetchSheet(APP_CONFIG.SHEET_NAMES.INCOME);
            return data.length > 1 ? GoogleSheets.parseSheetData(data, 'income') : [];
        } catch (error) {
            console.error('Error loading income:', error);
            return [];
        }
    },

    // Save income data to Google Sheets
    async saveIncome(incomeList) {
        try {
            await GoogleSheets.writeSheet(APP_CONFIG.SHEET_NAMES.INCOME, incomeList, 'income');
            return true;
        } catch (error) {
            console.error('Error saving income:', error);
            return false;
        }
    },

    // Get expenses data from Google Sheets
    async getExpenses() {
        try {
            const data = await GoogleSheets.fetchSheet(APP_CONFIG.SHEET_NAMES.EXPENSES);
            return data.length > 1 ? GoogleSheets.parseSheetData(data, 'expenses') : [];
        } catch (error) {
            console.error('Error loading expenses:', error);
            return [];
        }
    },

    // Save expenses data to Google Sheets
    async saveExpenses(expensesList) {
        try {
            await GoogleSheets.writeSheet(APP_CONFIG.SHEET_NAMES.EXPENSES, expensesList, 'expenses');
            return true;
        } catch (error) {
            console.error('Error saving expenses:', error);
            return false;
        }
    },

    // Get invoices data from Google Sheets
    async getInvoices() {
        try {
            const data = await GoogleSheets.fetchSheet(APP_CONFIG.SHEET_NAMES.INVOICES);
            return data.length > 1 ? GoogleSheets.parseSheetData(data, 'invoices') : [];
        } catch (error) {
            console.error('Error loading invoices:', error);
            return [];
        }
    },

    // Save invoices data to Google Sheets
    async saveInvoices(invoicesList) {
        try {
            await GoogleSheets.writeSheet(APP_CONFIG.SHEET_NAMES.INVOICES, invoicesList, 'invoices');
            return true;
        } catch (error) {
            console.error('Error saving invoices:', error);
            return false;
        }
    },

    // Get settings from localStorage (settings remain local)
    getSettings() {
        try {
            const prefixedKey = APP_CONFIG.STORAGE_PREFIX + 'settings';
            const data = localStorage.getItem(prefixedKey);
            return data ? JSON.parse(data) : {
                spreadsheetId: '',
                apiKey: '',
                webAppUrl: ''
            };
        } catch (error) {
            console.error('Error loading settings:', error);
            return {
                spreadsheetId: '',
                apiKey: '',
                webAppUrl: ''
            };
        }
    },

    // Save settings to localStorage (settings remain local)
    saveSettings(settings) {
        try {
            const prefixedKey = APP_CONFIG.STORAGE_PREFIX + 'settings';
            localStorage.setItem(prefixedKey, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
