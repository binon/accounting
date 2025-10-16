# Simple Accounting

A lightweight account management web application inspired by Xero, focused on simplicity and integration flexibility. This app runs on GitHub Pages and uses Google Sheets as a backend database.

## Features

- **Dashboard**: View summary of your financial status with income, expenses, profit, and pending invoices
- **Income Tracking**: Add, edit, and manage income entries with categories
- **Expense Tracking**: Track and categorize business expenses
- **Invoice Management**: Create and manage invoices with status tracking (pending, paid, overdue)
- **Google Sheets Integration**: Sync data with Google Sheets for backup and accessibility
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Local Storage**: Data is stored locally in your browser for offline access

## Live Demo

Visit the app: `https://[your-username].github.io/accounting/`

## Getting Started

### Quick Start

1. Open `index.html` in your web browser or visit the GitHub Pages URL
2. Start adding income, expenses, and invoices
3. Optionally configure Google Sheets integration for data backup

### Google Sheets Integration (Optional)

To sync your data with Google Sheets:

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

3. **Configure in App**:
   - Click the Settings icon (⚙️) in the app
   - Enter your Spreadsheet ID (from the Google Sheets URL)
   - Enter your API Key
   - Click "Save Settings"

4. **Sync Data**:
   - Click the "Sync" button to pull data from Google Sheets
   - Your local data will be updated with the sheet data

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
- **Storage**: Browser LocalStorage
- **Integration**: Google Sheets API
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
- Read-only sync from Google Sheets (using API Key)
- Data format compatible with spreadsheet applications
- Manual sync on demand
- Last sync timestamp tracking

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires a modern browser with LocalStorage support.

## Data Privacy

- All data is stored locally in your browser
- No data is sent to external servers (except when syncing with Google Sheets)
- Google Sheets integration is optional
- Clear your browser data to remove all app data

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