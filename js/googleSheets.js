// Google Sheets Integration Manager
const GoogleSheets = {
    settings: null,
    AMOUNT_EPSILON: 0.01, // Tolerance for comparing monetary amounts

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
            const remoteIncome = incomeData.length > 1 ? this.parseSheetData(incomeData, 'income') : [];
            const mergedIncome = this.mergeData(Storage.getIncome(), remoteIncome, 'income');
            Storage.saveIncome(mergedIncome);

            // Fetch expenses data
            const expensesData = await this.fetchSheet(APP_CONFIG.SHEET_NAMES.EXPENSES);
            const remoteExpenses = expensesData.length > 1 ? this.parseSheetData(expensesData, 'expenses') : [];
            const mergedExpenses = this.mergeData(Storage.getExpenses(), remoteExpenses, 'expenses');
            Storage.saveExpenses(mergedExpenses);

            // Fetch invoices data
            const invoicesData = await this.fetchSheet(APP_CONFIG.SHEET_NAMES.INVOICES);
            const remoteInvoices = invoicesData.length > 1 ? this.parseSheetData(invoicesData, 'invoices') : [];
            const mergedInvoices = this.mergeData(Storage.getInvoices(), remoteInvoices, 'invoices');
            Storage.saveInvoices(mergedInvoices);

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

    // Merge local and remote data, preserving local items and adding new remote items
    mergeData(localData, remoteData, type) {
        // Validate inputs
        if (!Array.isArray(localData) || !Array.isArray(remoteData)) {
            console.warn('Invalid data provided to mergeData, using empty arrays as fallback');
            return Array.isArray(localData) ? [...localData] : (Array.isArray(remoteData) ? [...remoteData] : []);
        }
        
        // Start with a copy of local data to preserve all local changes
        const merged = [...localData];
        
        // Add remote items that don't already exist locally
        remoteData.forEach(remoteItem => {
            // Skip invalid items
            if (!remoteItem) return;
            
            // Check if this item already exists locally (match by content, not ID)
            const isDuplicate = localData.some(localItem => {
                return this.itemsMatch(localItem, remoteItem, type);
            });
            
            // If not a duplicate, add it to the merged list
            if (!isDuplicate) {
                merged.push(remoteItem);
            }
        });
        
        return merged;
    },

    // Check if two items match (same data, excluding ID)
    itemsMatch(item1, item2, type) {
        // Validate inputs
        if (!item1 || !item2) {
            return false;
        }
        
        switch (type) {
            case 'income':
            case 'expenses':
                // Match by date, description, category, and amount
                return item1.date === item2.date &&
                       item1.description === item2.description &&
                       item1.category === item2.category &&
                       Math.abs(item1.amount - item2.amount) < this.AMOUNT_EPSILON;
            
            case 'invoices':
                // Match by invoice number, client, dates, and amount
                return item1.invoicenumber === item2.invoicenumber &&
                       item1.client === item2.client &&
                       item1.date === item2.date &&
                       item1.duedate === item2.duedate &&
                       Math.abs(item1.amount - item2.amount) < this.AMOUNT_EPSILON;
            
            default:
                return false;
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
                const value = row[i] || '';
                
                // Convert amount fields to numbers
                if (key === 'amount') {
                    item[key] = parseFloat(value) || 0;
                } else {
                    item[key] = value;
                }
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
