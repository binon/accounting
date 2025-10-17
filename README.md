# Simple Accounting

A lightweight account management web application inspired by Xero, focused on simplicity and integration flexibility. This app runs on GitHub Pages and uses Google Sheets as the primary database.

## Features

- **Dashboard**: View summary of your financial status with income, expenses, profit, and pending invoices
- **Income Tracking**: Add, edit, and manage income entries with categories
- **Expense Tracking**: Track and categorize business expenses
- **Invoice Management**: Create and manage invoices with status tracking (pending, paid, overdue)
- **Google Sheets Direct Integration**: All data is stored directly in Google Sheets - no local storage
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Automatic Save**: Changes are automatically saved to your Google Sheets

## Live Demo

Visit the app: `https://[your-username].github.io/accounting/`

## Getting Started

### Prerequisites

This application requires Google Sheets integration to function. You will need:
- A Google Account
- A Google Cloud project with **Google Sheets API enabled**
- An API Key for read access
- A Google Apps Script Web App deployment for write operations

### Setup Instructions

To use Simple Accounting with Google Sheets:

1. **Create a Google Sheet**:
   - Create a new Google Sheet
   - Create four sheets named: `Income`, `Expenses`, `Invoices`, and `Settings`
   - Add headers to each sheet:
     - Income: `Date`, `Description`, `Category`, `Amount`
     - Expenses: `Date`, `Description`, `Category`, `Amount`
     - Invoices: `Invoice #`, `Client`, `Date`, `Due Date`, `Amount`, `Status`

2. **Get Google Sheets API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Sheets API
   - Create credentials (API Key)
   - Restrict the API key to Google Sheets API

3. **Set Up Google Apps Script**:
   - Open your Google Sheet
   - Go to Extensions → Apps Script
   - Copy the code from `docs/google-apps-script-example.js`
   - Paste it into the Apps Script editor
   - Click "Deploy" → "New deployment"
   - Choose "Web app"
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone" (⚠️ Note: This allows unauthenticated access. For better security, use "Anyone with Google account" and implement authentication)
   - Click "Deploy" and copy the Web App URL

4. **Configure in App**:
   - Open the Simple Accounting app
   - Click the Settings icon (⚙️) or the "Open Settings" button
   - Enter your Spreadsheet ID (from the Google Sheets URL)
   - Enter your API Key
   - Enter your Web App URL (from Apps Script deployment)
   - Click "Save Settings"

5. **Start Using**:
   - The app will reload and connect to your Google Sheets
   - All data is now stored directly in Google Sheets
   - Changes are saved automatically

## Project Structure

```
accounting/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # Application styles
├── js/
│   ├── config.js          # Configuration constants
│   ├── storage.js         # Local storage management
│   ├── googleSheets.js    # Google Sheets API integration
│   ├── income.js          # Income management
│   ├── expenses.js        # Expense management
│   ├── invoices.js        # Invoice management
│   ├── dashboard.js       # Dashboard functionality
│   └── app.js             # Main application controller
└── README.md              # This file
```

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Google Sheets (via Google Sheets API + Apps Script)
- **Integration**: Google Sheets API (read) + Google Apps Script Web App (write)
- **Icons**: Font Awesome 6
- **Hosting**: GitHub Pages

## Features in Detail

### Dashboard
- Summary cards showing total income, expenses, net profit, and pending invoices
- Recent transactions list showing the last 10 transactions
- Automatic calculation of monthly totals

### Income Management
- Add income entries with date, description, category, and amount
- Categories: Sales, Services, Interest, Investment, Other
- Edit and delete existing entries
- Sortable by date

### Expense Management
- Track expenses with detailed categorization
- Categories: Office Supplies, Utilities, Rent, Salaries, Marketing, Travel, Software, Other
- Full CRUD operations (Create, Read, Update, Delete)

### Invoice Management
- Create professional invoices with auto-generated invoice numbers
- Track invoice status (Pending, Paid, Overdue)
- Automatic overdue detection based on due dates
- Client management

### Google Sheets Integration
- Direct read/write integration with Google Sheets
- Real-time data synchronization
- No local storage - all data lives in your Google Sheet
- Data format compatible with spreadsheet applications
- Bi-directional sync via Google Apps Script

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires a modern browser with ES6+ JavaScript support.

## Data Privacy

- All data is stored in your personal Google Sheets
- You have full control over your data
- No third-party servers or databases
- **Google Sheets integration is required** for the app to function
- Data is only accessible to you and anyone you share your Google Sheet with
- ⚠️ **Security Note**: Be careful with Web App access settings - "Anyone" allows unauthenticated access to your data

## Future Enhancements

Potential migration path to .NET Core:
- Backend API for data persistence
- User authentication and multi-user support
- Advanced reporting and analytics
- PDF invoice generation
- Email notifications
- Data export/import features
- Cloud database integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Acknowledgments

- Inspired by Xero accounting software
- Built with modern web technologies
- Icons by Font Awesome