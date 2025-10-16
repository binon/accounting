/**
 * Google Apps Script Example for Simple Accounting
 * 
 * This script enables bi-directional sync between the Simple Accounting app
 * and Google Sheets. Deploy this as a Web App to create an API endpoint.
 * 
 * Setup Instructions:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Delete any existing code
 * 4. Paste this entire script
 * 5. Click "Deploy" → "New deployment"
 * 6. Choose "Web app"
 * 7. Set "Execute as" to "Me"
 * 8. Set "Who has access" to "Anyone" (or restrict as needed)
 * 9. Click "Deploy"
 * 10. Copy the Web App URL
 * 11. Use this URL in your app for API calls
 */

// Configuration
const SHEET_NAMES = {
  INCOME: 'Income',
  EXPENSES: 'Expenses',
  INVOICES: 'Invoices',
  SETTINGS: 'Settings'
};

/**
 * Handle GET requests - Read data from sheets
 */
function doGet(e) {
  const params = e.parameter;
  const action = params.action;
  const sheet = params.sheet;

  try {
    let result;
    
    switch(action) {
      case 'read':
        result = readSheet(sheet);
        break;
      case 'readAll':
        result = readAllSheets();
        break;
      default:
        return createResponse(false, 'Invalid action');
    }
    
    return createResponse(true, 'Success', result);
  } catch (error) {
    return createResponse(false, error.toString());
  }
}

/**
 * Handle POST requests - Write data to sheets
 */
function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const action = params.action;
  const sheet = params.sheet;
  const data = params.data;

  try {
    let result;
    
    switch(action) {
      case 'write':
        result = writeSheet(sheet, data);
        break;
      case 'append':
        result = appendSheet(sheet, data);
        break;
      case 'update':
        result = updateSheet(sheet, data);
        break;
      case 'delete':
        result = deleteRow(sheet, data.id);
        break;
      case 'writeAll':
        result = writeAllSheets(data);
        break;
      default:
        return createResponse(false, 'Invalid action');
    }
    
    return createResponse(true, 'Success', result);
  } catch (error) {
    return createResponse(false, error.toString());
  }
}

/**
 * Read data from a specific sheet
 */
function readSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }
  
  const data = sheet.getDataRange().getValues();
  
  if (data.length === 0) {
    return [];
  }
  
  // First row is headers
  const headers = data[0].map(h => h.toString().toLowerCase().replace(/\s+/g, '').replace('#', 'number'));
  const rows = data.slice(1);
  
  // Convert to objects
  return rows.map((row, index) => {
    const obj = { rowIndex: index + 2 }; // +2 because of header and 1-based indexing
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
}

/**
 * Read all sheets
 */
function readAllSheets() {
  return {
    income: readSheet(SHEET_NAMES.INCOME),
    expenses: readSheet(SHEET_NAMES.EXPENSES),
    invoices: readSheet(SHEET_NAMES.INVOICES)
  };
}

/**
 * Write data to a sheet (overwrites existing data)
 */
function writeSheet(sheetName, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  // Clear existing data
  sheet.clear();
  
  if (!data || data.length === 0) {
    return { rowsWritten: 0 };
  }
  
  // Get headers from first object
  const headers = Object.keys(data[0]).filter(key => key !== 'id' && key !== 'rowIndex');
  
  // Prepare data array
  const rows = [headers];
  data.forEach(item => {
    const row = headers.map(header => item[header] || '');
    rows.push(row);
  });
  
  // Write to sheet
  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  
  // Format header row
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#f3f4f6');
  
  return { rowsWritten: rows.length - 1 };
}

/**
 * Append a row to a sheet
 */
function appendSheet(sheetName, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(header => {
    const key = header.toLowerCase().replace(/\s+/g, '').replace('#', 'number');
    return data[key] || '';
  });
  
  sheet.appendRow(row);
  
  return { rowAppended: sheet.getLastRow() };
}

/**
 * Update a specific row in a sheet
 */
function updateSheet(sheetName, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }
  
  const rowIndex = data.rowIndex;
  if (!rowIndex) {
    throw new Error('rowIndex is required for update');
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(header => {
    const key = header.toLowerCase().replace(/\s+/g, '').replace('#', 'number');
    return data[key] !== undefined ? data[key] : '';
  });
  
  sheet.getRange(rowIndex, 1, 1, headers.length).setValues([row]);
  
  return { rowUpdated: rowIndex };
}

/**
 * Delete a row from a sheet
 */
function deleteRow(sheetName, rowIndex) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }
  
  if (!rowIndex || rowIndex < 2) {
    throw new Error('Invalid rowIndex');
  }
  
  sheet.deleteRow(rowIndex);
  
  return { rowDeleted: rowIndex };
}

/**
 * Write all data at once
 */
function writeAllSheets(data) {
  const results = {};
  
  if (data.income) {
    results.income = writeSheet(SHEET_NAMES.INCOME, data.income);
  }
  
  if (data.expenses) {
    results.expenses = writeSheet(SHEET_NAMES.EXPENSES, data.expenses);
  }
  
  if (data.invoices) {
    results.invoices = writeSheet(SHEET_NAMES.INVOICES, data.invoices);
  }
  
  return results;
}

/**
 * Create a JSON response
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Initialize sheets with headers if they don't exist
 */
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Income sheet
  let sheet = ss.getSheetByName(SHEET_NAMES.INCOME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.INCOME);
    sheet.appendRow(['Date', 'Description', 'Category', 'Amount']);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#f3f4f6');
  }
  
  // Expenses sheet
  sheet = ss.getSheetByName(SHEET_NAMES.EXPENSES);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.EXPENSES);
    sheet.appendRow(['Date', 'Description', 'Category', 'Amount']);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#f3f4f6');
  }
  
  // Invoices sheet
  sheet = ss.getSheetByName(SHEET_NAMES.INVOICES);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.INVOICES);
    sheet.appendRow(['Invoice #', 'Client', 'Date', 'Due Date', 'Amount', 'Status']);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#f3f4f6');
  }
  
  Logger.log('Sheets initialized successfully');
}

/**
 * Test function - Run this to test the script
 */
function testScript() {
  // Initialize sheets
  initializeSheets();
  
  // Test reading
  const income = readSheet(SHEET_NAMES.INCOME);
  Logger.log('Income data:', income);
  
  // Test writing
  const testData = [
    { date: '2024-01-15', description: 'Test Income', category: 'Sales', amount: 100 }
  ];
  const result = writeSheet(SHEET_NAMES.INCOME, testData);
  Logger.log('Write result:', result);
}
