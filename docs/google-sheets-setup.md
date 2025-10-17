# Google Sheets Setup Guide

This guide will help you set up Google Sheets integration for the Simple Accounting app.

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Simple Accounting Data" (or any name you prefer)

## Step 2: Set Up Sheets

Create four sheets with the following names and headers:

### Income Sheet
| Date | Description | Category | Amount |
|------|-------------|----------|--------|

### Expenses Sheet
| Date | Description | Category | Amount |
|------|-------------|----------|--------|

### Invoices Sheet
| Invoice # | Client | Date | Due Date | Amount | Status |
|-----------|--------|------|----------|--------|--------|

### Settings Sheet (Optional)
| Key | Value |
|-----|-------|

## Step 3: Get Your Spreadsheet ID

1. Look at the URL of your Google Sheet
2. The Spreadsheet ID is the long string between `/d/` and `/edit`
3. Example: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
4. Copy this ID

## Step 4: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "Simple Accounting")
4. Click "Create"

## Step 5: Enable Google Sheets API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and click "Enable"

## Step 6: Create API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API Key that appears
4. **Important**: Click "Restrict Key" to secure it
5. Under "API restrictions", select "Restrict key"
6. Choose "Google Sheets API" from the dropdown
7. Click "Save"

## Step 7: Configure the App

1. Open the Simple Accounting app
2. Click the Settings icon (⚙️)
3. Paste your Spreadsheet ID
4. Paste your API Key
5. Click "Save Settings"

## Step 8: Test the Integration

1. Add some data manually to your Google Sheets
2. In the app, click the "Sync" button
3. Your data should appear in the app

## Important Notes

### Direct Integration (Current Implementation)
The application now requires both API Key (for reading) and Google Apps Script Web App (for writing):
- ✅ Read data using Google Sheets API with API Key
- ✅ Write data using Google Apps Script Web App
- ✅ No local storage - all data lives in Google Sheets
- ❌ No sync button - data is automatically saved

### Security Considerations
**⚠️ Important**: When deploying your Google Apps Script Web App:
- Setting "Who has access" to "Anyone" allows unauthenticated write access to your sheets
- For better security, use "Anyone with Google account" and implement proper authentication
- Never share your Web App URL publicly
- Consider implementing rate limiting and authentication in your Apps Script
- Regularly review access logs in Google Cloud Console

## Troubleshooting

### Error: "Failed to fetch data"
- Check that your Spreadsheet ID is correct
- Verify that your API Key is valid
- Make sure the Google Sheets API is enabled
- Ensure the spreadsheet is accessible (check sharing settings)

### Error: "Google Sheets not configured"
- Make sure you've entered both Spreadsheet ID and API Key in Settings
- Click "Save Settings" after entering the credentials

### Data Not Syncing
- Verify that your sheet names match exactly: `Income`, `Expenses`, `Invoices`
- Check that the headers are in the first row
- Make sure there's data in the sheets

### API Key Security
- Never share your API Key publicly
- Restrict the API Key to only the Google Sheets API
- Consider adding HTTP referrer restrictions to limit where the key can be used
- Regenerate the key if you suspect it's been compromised

## Data Format Examples

### Income Data
```
2024-01-15 | Consulting Services | Services | 2500.00
2024-01-20 | Product Sale | Sales | 1200.00
```

### Expenses Data
```
2024-01-16 | Office Rent | Rent | 1000.00
2024-01-18 | Software License | Software | 99.00
```

### Invoices Data
```
INV-001 | Acme Corp | 2024-01-15 | 2024-02-14 | 5000.00 | pending
INV-002 | XYZ Ltd | 2024-01-20 | 2024-02-19 | 3500.00 | paid
```

## Tips

1. **Backup Your Data**: Keep your Google Sheet as a backup of your accounting data
2. **Regular Syncs**: Click the Sync button regularly to keep data up to date
3. **Manual Entry**: You can manually edit the Google Sheet and sync to import changes
4. **Export**: Use Google Sheets export features to create Excel or CSV files
5. **Sharing**: You can share the Google Sheet with your accountant or team members

## Next Steps

- Consider implementing OAuth 2.0 for write access
- Set up Google Apps Script for advanced automation
- Create additional sheets for categories or reports
- Use Google Sheets formulas for advanced calculations
