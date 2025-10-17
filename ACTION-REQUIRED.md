# ACTION REQUIRED: Fix CORS Error

## 🎯 Quick Summary

Your accounting app is getting CORS errors when trying to save data to Google Sheets. This has been fixed in the code, but **you need to update your Google Apps Script deployment** for the fix to work.

## ⚡ 3-Minute Fix

### Step 1: Update Your Google Apps Script (2 minutes)

1. Open your Google Sheet
2. Click **Extensions** → **Apps Script**
3. **Select ALL the old code** and delete it
4. Open this file in your repository: `docs/google-apps-script-example.js`
5. **Copy ALL the code** and paste it into Apps Script
6. Click **Save** (💾 icon)

### Step 2: Redeploy with New Version (1 minute)

1. Click **Deploy** → **Manage deployments**
2. Click the **Edit** icon (✏️) next to "Active"
3. Under "Version", select **"New version"** ← IMPORTANT!
4. Click **Deploy**
5. Copy the Web App URL (just in case it changed)

### Step 3: Verify Config (30 seconds)

1. Open `js/config.js` in your repository
2. Verify `WEB_APP_URL` matches your deployment URL
3. Make sure it ends with `/exec` (not `/dev`)

### Step 4: Test! (30 seconds)

1. Open your app
2. Try adding an income entry
3. If it saves without errors → Success! 🎉
4. If you still see errors → See troubleshooting below

## 🔧 What Was Fixed

### The Problem
```
Access to fetch has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present
```

This happened because your Google Apps Script wasn't configured to allow requests from GitHub Pages (different domain = CORS restriction).

### The Solution

Added CORS support to the Google Apps Script:
- ✅ Handles OPTIONS preflight requests
- ✅ Returns proper CORS headers
- ✅ Allows requests from GitHub Pages

### Also Fixed
- ✅ Added favicon (no more 404 error)
- ✅ Better error messages to guide you
- ✅ Comprehensive documentation

## 📚 Detailed Documentation

If you need more help:

1. **Step-by-step guide**: Read `docs/CORS-SETUP-GUIDE.md`
2. **Technical details**: Read `docs/ISSUE-FIX-SUMMARY.md`
3. **Troubleshooting**: See README.md (Troubleshooting section)

## ❓ Troubleshooting

### "I updated the code but still get CORS errors"

**Did you create a NEW version?**
- Just editing the code is NOT enough
- You MUST click "New version" when redeploying
- Old version might still be running

### "I'm not sure if I did it right"

Check these:
- [ ] Apps Script code was completely replaced
- [ ] You clicked "Deploy" → "Manage deployments" → Edit → "New version"
- [ ] The URL in `js/config.js` ends with `/exec`
- [ ] "Execute as" is set to "Me"
- [ ] "Who has access" is set to "Anyone"

### "Still not working!"

1. Clear your browser cache (Ctrl+Shift+Delete)
2. Try in an incognito/private window
3. Check browser console for the exact error message
4. Open an issue with the error details

## 🔒 Security Note

The current fix uses `Access-Control-Allow-Origin: *` which allows any website to access your Web App. This is fine for:
- Personal use
- Non-sensitive data
- Getting started quickly

For production or sensitive data, see `docs/CORS-SETUP-GUIDE.md` for security recommendations.

## ✅ Success Checklist

- [ ] Updated Google Apps Script code
- [ ] Created new deployment version
- [ ] Verified Web App URL in config.js
- [ ] Tested adding income - works without errors
- [ ] Tested adding expense - works without errors
- [ ] No CORS errors in browser console
- [ ] Favicon displays correctly

## 💡 Why This Happened

Web browsers block requests between different domains (like GitHub Pages → Google Apps Script) unless the server explicitly allows it with CORS headers. Your original script didn't have these headers, so all write operations were blocked.

The updated script includes proper CORS configuration, so cross-origin requests are now allowed.

---

**Need help?** Check the documentation in the `docs/` folder or open an issue!
