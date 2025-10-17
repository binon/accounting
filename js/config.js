// Configuration constants
const APP_CONFIG = {
    APP_NAME: 'Simple Accounting',
    VERSION: '1.0.0',
    STORAGE_PREFIX: 'simple_accounting_',
    
    // Google Sheets API configuration
    GOOGLE_SHEETS: {
        API_URL: 'https://sheets.googleapis.com/v4/spreadsheets',
        SCOPES: ['https://www.googleapis.com/auth/spreadsheets'],
        // Google Sheets Integration Settings
        // Update these values with your Google Sheets credentials
        SPREADSHEET_ID: '1yCVMBimNPGTdoA_nUWS-Uj8Z5OJvEjtWVbKntVG8PdM', // Your Google Spreadsheet ID from the URL
        API_KEY: 'AIzaSyC0AyDIgfB77Wwkk8LRmHS2rg6m63Oknos',        // Your Google API Key for read access
        WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbwgO12mZfxa4jdhJ3P6vy_1sylZx0-g9qBo6xUYGiEkF8YXIHRr5d9sYZPrFVZevycIeQ/exec'     // Your Google Apps Script Web App URL for write access
    },
    
    // Data structure for Google Sheets
    SHEET_NAMES: {
        INCOME: 'Income',
        EXPENSES: 'Expenses',
        INVOICES: 'Invoices',
        SETTINGS: 'Settings'
    },
    
    // Categories
    INCOME_CATEGORIES: [
        'Sales',
        'Services',
        'Interest',
        'Investment',
        'Other'
    ],
    
    EXPENSE_CATEGORIES: [
        'Office Supplies',
        'Utilities',
        'Rent',
        'Salaries',
        'Marketing',
        'Travel',
        'Software',
        'Other'
    ],
    
    // Invoice statuses
    INVOICE_STATUSES: {
        PENDING: 'pending',
        PAID: 'paid',
        OVERDUE: 'overdue'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONFIG;
}
