// Google Sheets Integration Manager
const GoogleSheets = {
    // Initialize with settings
    init() {
        return this.isConfigured();
    },

    // Check if Google Sheets is configured
    isConfigured() {
        const config = APP_CONFIG.GOOGLE_SHEETS;
        return !!(config.SPREADSHEET_ID && config.API_KEY && config.WEB_APP_URL);
    },

    // Build API URL for a specific sheet
    buildApiUrl(sheetName, range = '') {
        const spreadsheetId = APP_CONFIG.GOOGLE_SHEETS.SPREADSHEET_ID;
        const apiKey = APP_CONFIG.GOOGLE_SHEETS.API_KEY;
        const fullRange = range ? `${sheetName}!${range}` : sheetName;
        return `${APP_CONFIG.GOOGLE_SHEETS.API_URL}/${spreadsheetId}/values/${fullRange}?key=${apiKey}`;
    },

    // Fetch data from a sheet
    async fetchSheet(sheetName, range = 'A:Z') {
        if (!this.isConfigured()) {
            throw new Error('Google Sheets not configured. Please add your Spreadsheet ID and API Key in config.js.');
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

    // Write data to a sheet using Google Apps Script Web App
    async writeSheet(sheetName, data, type) {
        const webAppUrl = APP_CONFIG.GOOGLE_SHEETS.WEB_APP_URL;
        
        if (!webAppUrl) {
            throw new Error('Web App URL not configured. Please set up Google Apps Script and add the Web App URL in config.js.');
        }

        try {
            // Format data for export
            const formattedData = this.formatDataForWrite(data, type);
            
            const response = await fetch(webAppUrl, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'write',
                    sheet: sheetName,
                    data: formattedData
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to write data: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Failed to write data');
            }

            return result;
        } catch (error) {
            console.error('Error writing to sheet:', error);
            
            // Provide helpful error message for CORS issues
            if (error.message && error.message.includes('Failed to fetch')) {
                const corsError = new Error(
                    'CORS Error: Unable to connect to Google Apps Script.\n\n' +
                    'This usually means:\n' +
                    '1. Your Google Apps Script is not deployed or the URL is incorrect\n' +
                    '2. Your Google Apps Script needs to be updated with CORS support\n' +
                    '3. The script is not accessible (check "Who has access" setting)\n\n' +
                    'Please follow these steps:\n' +
                    '1. Open your Google Sheet\n' +
                    '2. Go to Extensions → Apps Script\n' +
                    '3. Copy the code from docs/google-apps-script-example.js\n' +
                    '4. Deploy as a Web App with "Execute as: Me" and "Who has access: Anyone"\n' +
                    '5. Update the WEB_APP_URL in js/config.js with the deployment URL\n\n' +
                    'See README.md for detailed setup instructions.'
                );
                corsError.name = 'CORSError';
                throw corsError;
            }
            
            throw error;
        }
    },

    // Format data for writing to sheets
    formatDataForWrite(data, type) {
        if (!data || data.length === 0) return [];

        return data.map(item => {
            const formatted = {};
            
            switch (type) {
                case 'income':
                case 'expenses':
                    formatted.date = item.date || '';
                    formatted.description = item.description || '';
                    formatted.category = item.category || '';
                    formatted.amount = item.amount || 0;
                    break;
                
                case 'invoices':
                    formatted.invoicenumber = item.invoicenumber || '';
                    formatted.client = item.client || '';
                    formatted.date = item.date || '';
                    formatted.duedate = item.duedate || '';
                    formatted.amount = item.amount || 0;
                    formatted.status = item.status || 'pending';
                    break;
            }
            
            return formatted;
        });
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


};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleSheets;
}
