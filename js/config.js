// Configuration constants
const APP_CONFIG = {
    APP_NAME: 'Simple Accounting',
    VERSION: '1.0.0',
    STORAGE_PREFIX: 'simple_accounting_',
    
    // Google Sheets API configuration
    GOOGLE_SHEETS: {
        API_URL: 'https://sheets.googleapis.com/v4/spreadsheets',
        SCOPES: ['https://www.googleapis.com/auth/spreadsheets']
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
