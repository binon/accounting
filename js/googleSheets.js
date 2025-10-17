// Google Sheets Integration Manager
const GoogleSheets = {
    settings: null,

    // Initialize with settings
    init() {
        this.settings = Storage.getSettings();
        return this.isConfigured();
    },

    // Check if Google Sheets is configured
    isConfigured() {
        return !!(this.settings && this.settings.spreadsheetId && this.settings.apiKey);
    },

    // Build API URL for a specific sheet
    buildApiUrl(sheetName, range = '') {
        const spreadsheetId = this.settings.spreadsheetId;
        const apiKey = this.settings.apiKey;
        const fullRange = range ? `${sheetName}!${range}` : sheetName;
        return `${APP_CONFIG.GOOGLE_SHEETS.API_URL}/${spreadsheetId}/values/${fullRange}?key=${apiKey}`;
    },

    // Fetch data from a sheet
    async fetchSheet(sheetName, range = 'A:Z') {
        if (!this.isConfigured()) {
            throw new Error('Google Sheets not configured. Please add your Spreadsheet ID and API Key in Settings.');
        }

        try {
            const url = this.buildApiUrl(sheetName, range);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }

            const data = await response.json();
            return data.values || [];
        } catch (error) {
            console.error('Error fetching sheet:', error);
            throw error;
        }
    },

    // Update data in a sheet (requires OAuth - placeholder for future implementation)
    async updateSheet(sheetName, range, values) {
        if (!this.isConfigured()) {
            throw new Error('Google Sheets not configured. Please add your Spreadsheet ID and API Key in Settings.');
        }

        // Note: This requires OAuth authentication which is more complex
        // For now, this is a placeholder. In production, you would:
        // 1. Implement OAuth 2.0 flow
        // 2. Use authorized API calls
        // 3. Or use Google Apps Script as a proxy
        
        console.warn('Update functionality requires OAuth implementation or Google Apps Script proxy');
        throw new Error('Update functionality not yet implemented. Please use Google Apps Script for write operations.');
    },

    // Sync all data from Google Sheets to local storage
    async syncFromSheets() {
        if (!this.isConfigured()) {
            throw new Error('Google Sheets not configured');
        }

        try {
            // Fetch income data
            const incomeData = await this.fetchSheet(APP_CONFIG.SHEET_NAMES.INCOME);
            const income = incomeData.length > 1 ? this.parseSheetData(incomeData, 'income') : [];
            Storage.saveIncome(income);

            // Fetch expenses data
            const expensesData = await this.fetchSheet(APP_CONFIG.SHEET_NAMES.EXPENSES);
            const expenses = expensesData.length > 1 ? this.parseSheetData(expensesData, 'expenses') : [];
            Storage.saveExpenses(expenses);

            // Fetch invoices data
            const invoicesData = await this.fetchSheet(APP_CONFIG.SHEET_NAMES.INVOICES);
            const invoices = invoicesData.length > 1 ? this.parseSheetData(invoicesData, 'invoices') : [];
            Storage.saveInvoices(invoices);

            // Update last sync time
            const settings = Storage.getSettings();
            settings.lastSync = new Date().toISOString();
            Storage.saveSettings(settings);

            return true;
        } catch (error) {
            console.error('Error syncing from sheets:', error);
            throw error;
        }
    },

    // Parse sheet data based on type
    parseSheetData(rows, type) {
        if (!rows || rows.length < 2) return [];

        const headers = rows[0];
        const data = rows.slice(1);

        return data.map((row, index) => {
            const item = { id: Date.now() + index };
            
            headers.forEach((header, i) => {
                const key = header.toLowerCase().replace(/\s+/g, '');
                item[key] = row[i] || '';
            });

            return item;
        });
    },

    // Format data for exporting to sheets
    formatForExport(data, type) {
        if (!data || data.length === 0) return [];

        let headers = [];
        
        switch (type) {
            case 'income':
                headers = ['Date', 'Description', 'Category', 'Amount'];
                break;
            case 'expenses':
                headers = ['Date', 'Description', 'Category', 'Amount'];
                break;
            case 'invoices':
                headers = ['Invoice #', 'Client', 'Date', 'Due Date', 'Amount', 'Status'];
                break;
            default:
                headers = Object.keys(data[0] || {});
        }

        const rows = [headers];
        
        data.forEach(item => {
            const row = [];
            headers.forEach(header => {
                const key = header.toLowerCase().replace(/\s+/g, '').replace('#', 'number');
                row.push(item[key] || '');
            });
            rows.push(row);
        });

        return rows;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleSheets;
}
