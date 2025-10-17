# CORS Setup Guide for Simple Accounting

## What is CORS?

CORS (Cross-Origin Resource Sharing) is a security feature in web browsers that restricts web pages from making requests to a different domain than the one that served the web page.

## The Problem

When you deploy this app on GitHub Pages (e.g., `https://yourusername.github.io/accounting`), it tries to communicate with your Google Apps Script Web App (which runs on `script.google.com`). These are different domains, so the browser blocks the request by default.

**Error you might see:**
```
Access to fetch at 'https://script.google.com/macros/s/...' from origin 'https://binon.github.io' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## The Solution

Your Google Apps Script must explicitly allow cross-origin requests by:
1. Handling OPTIONS requests (preflight)
2. Returning proper CORS headers in all responses

## Step-by-Step Fix

### 1. Update Your Google Apps Script

**Important:** You must update the script in your Google Sheet, not just in this repository.

1. Open your Google Sheet
2. Click **Extensions** → **Apps Script**
3. You'll see the script editor with your current code
4. **Select ALL the code** and delete it
5. Open the file `docs/google-apps-script-example.js` from this repository
6. **Copy ALL the code** from that file
7. Paste it into the Apps Script editor
8. Click the **Save** icon (💾)

### 2. Redeploy the Web App

**Critical:** You must create a new deployment version for changes to take effect.

1. In the Apps Script editor, click **Deploy** → **Manage deployments**
2. Click the **Edit** icon (✏️) next to your active deployment
3. Under "**Version**", click the dropdown and select **"New version"**
4. Optionally add a description like "Added CORS support"
5. Click **Deploy**
6. You'll see a confirmation with the Web App URL
7. Copy this URL (it might be the same as before, but the version changed)

### 3. Verify Your Config

1. Open `js/config.js` in your repository
2. Make sure `WEB_APP_URL` matches your deployment URL
3. The URL should end with `/exec` (NOT `/dev`)
4. Example:
   ```javascript
   WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbw.../exec'
   ```

### 4. Test the App

1. Open your app in a browser
2. Try adding an income entry
3. If it works without errors, CORS is properly configured!
4. If you still see errors, check the browser console for details

## What Changed in the Script?

### Old Script (Missing CORS Support)
```javascript
function doPost(e) {
  // ... handle request
  return createResponse(success, message, data);
}

function createResponse(success, message, data = null) {
  const response = { success, message, timestamp: new Date().toISOString() };
  if (data !== null) response.data = data;
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
  // ❌ No CORS headers - browser blocks cross-origin requests
}
// ❌ No doOptions() function - preflight requests fail
```

### New Script (With CORS Support)
```javascript
// ✅ New function to handle preflight
function doOptions(e) {
  return createCorsResponse();
}

function doPost(e) {
  // ... handle request
  return createResponse(success, message, data);
}

function createResponse(success, message, data = null) {
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    // ✅ CORS headers added
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')
    .setHeader('Access-Control-Max-Age', '86400');
}

// ✅ New function for preflight response
function createCorsResponse() {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')
    .setHeader('Access-Control-Max-Age', '86400');
}
```

## Security Considerations

### Current Setting: `Access-Control-Allow-Origin: *`
- ✅ Allows the app to work from any domain
- ✅ Easy to set up
- ⚠️ Anyone who knows your Web App URL can access it

### More Secure: Restrict to Your Domain
If you want to restrict access to only your GitHub Pages site:

```javascript
// BEFORE (allows all domains):
.setHeader('Access-Control-Allow-Origin', '*')

// AFTER (only your domain):
.setHeader('Access-Control-Allow-Origin', 'https://yourusername.github.io')
```

**Replace `yourusername` with your actual GitHub username.**

### Even More Secure: Require Authentication
For production use, consider:
1. Changing "Who has access" from "Anyone" to "Anyone with a Google account"
2. Implementing authentication in your app
3. Using Google Sign-In to verify users
4. Checking user identity in the Apps Script

## Troubleshooting

### Still Getting CORS Errors?

**Check 1: Did you create a NEW version?**
- Simply editing the code is not enough
- You MUST create a new deployment version
- Old cached versions might still be running

**Check 2: Is the URL correct?**
- URL should end with `/exec`
- URL should NOT end with `/dev`
- Copy the URL directly from the deployment confirmation

**Check 3: Deployment Settings**
- "Execute as" should be "**Me**"
- "Who has access" should be "**Anyone**" (or "Anyone with a Google account")

**Check 4: Browser Cache**
- Clear your browser cache
- Try in an incognito/private window
- Hard refresh with Ctrl+F5 (or Cmd+Shift+R on Mac)

### Testing CORS Headers

You can verify if CORS headers are working using browser developer tools:

1. Open your app in Chrome/Firefox
2. Open Developer Tools (F12)
3. Go to the Network tab
4. Try adding an income entry
5. Look for the request to your Web App URL
6. Check the response headers for `Access-Control-Allow-Origin`

Or test with curl:
```bash
curl -I -X OPTIONS https://your-web-app-url/exec
```

Look for headers like:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
```

### Common Mistakes

❌ Editing the code but not redeploying  
✅ Always create a new version after editing

❌ Using the `/dev` URL instead of `/exec`  
✅ Use the production `/exec` URL

❌ Not replacing ALL the old code  
✅ Delete old code, paste new code completely

❌ Forgetting to click "Deploy" after editing  
✅ Edit → New Version → Deploy

## Questions?

If you're still having issues:
1. Check the browser console for detailed error messages
2. Verify all steps in this guide
3. Open an issue on GitHub with:
   - The exact error message
   - Screenshots of your deployment settings
   - Your Web App URL (you can remove sensitive parts)

## Summary Checklist

- [ ] Opened Google Sheet → Extensions → Apps Script
- [ ] Replaced ALL code with `docs/google-apps-script-example.js`
- [ ] Saved the script
- [ ] Deploy → Manage deployments → Edit → New version → Deploy
- [ ] Copied the Web App URL
- [ ] Updated `js/config.js` with the correct URL (ending in `/exec`)
- [ ] Verified "Execute as: Me" and "Who has access: Anyone"
- [ ] Tested the app in browser
- [ ] Success! 🎉
