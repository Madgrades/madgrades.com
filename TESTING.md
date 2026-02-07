# Testing Guide for Vite Migration

This guide explains how to test the frontend after migrating from Create React App to Vite.

## Prerequisites

- Node.js >= 18
- npm >= 8
- Git

## MCP Configuration for API Access (Important!)

**If you're using Copilot Agent or automated testing tools**, you need to configure the Playwright MCP server to allow external API calls. Without this, API requests will fail with `ERR_BLOCKED_BY_CLIENT`.

The repository includes `mcp.config.json` which configures:
- **Allowed origins**: Whitelists API domains (api.madgrades.com, api.uptimerobot.com, etc.)
- **Browser security**: Disables web security checks for external domain access
- **CORS policy**: Allows cross-origin requests

**To use this configuration:**

```bash
# If running with Copilot Agent
copilot agent run --mcp-config ./mcp.config.json

# Or set it as default in your workspace
```

**Whitelisted domains:**
- `https://api.madgrades.com` - Main Madgrades API
- `https://api.uptimerobot.com` - Uptime monitoring
- `https://www.googletagmanager.com` - Google Analytics
- `http://pagead2.googlesyndication.com` - Google AdSense
- `https://fonts.googleapis.com` - Google Fonts
- `http://localhost:3000` - Dev server

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```bash
cp .env.example .env
```

**How to securely provide environment variables:**

#### Option A: Local Development (Recommended)
Edit the `.env` file directly on your local machine. This file is git-ignored and will not be committed.

```env
VITE_MADGRADES_API=https://api.madgrades.com/
VITE_URL=http://localhost:3000
VITE_MADGRADES_API_TOKEN=your_token_here
VITE_GA4_TRACKING_ID=your_ga4_id_here
VITE_UPTIME_ROBOT_API_KEY=your_uptime_key_here
VITE_ADSENSE_CLIENT=your_adsense_client_here
VITE_ADSENSE_SIDEBAR_SLOT=your_adsense_slot_here
```

#### Option B: Using GitHub Secrets (CI/CD)
For deployment pipelines, store secrets in GitHub repository settings:
1. Go to Settings → Secrets and variables → Actions
2. Add each environment variable as a repository secret
3. Update your workflow files to inject these secrets

#### Option C: Secure File Transfer
If someone needs to share env vars with you:
1. Use encrypted communication (Signal, encrypted email)
2. Or use a password manager's secure sharing feature
3. Never commit sensitive values to git or share via plain text

### 3. Run Development Server

```bash
npm start
```

This runs three processes in parallel:
- Git info generation
- SASS watcher (compiles SCSS to CSS)
- Vite dev server

The server will be available at: **http://localhost:3000**

**Expected startup time:** ~300-500ms (vs 15-20s with Create React App)

## Testing Checklist

### ✅ Basic Functionality Tests

1. **Homepage (`/`)**
   - [ ] Page loads without errors
   - [ ] Search box is visible and functional
   - [ ] Navigation links work
   - [ ] Footer displays correctly
   - [ ] No console errors (except external analytics/ads if not configured)

2. **Search Page (`/search`)**
   - [ ] Search form loads
   - [ ] Can enter search queries
   - [ ] Results display (requires API token)
   - [ ] Filters work correctly
   - [ ] Pagination works

3. **Course Pages (`/courses/:id`)**
   - [ ] Course details display
   - [ ] Grade distribution charts render
   - [ ] Navigation to related courses works

4. **About Page (`/about`)**
   - [ ] Page content displays correctly
   - [ ] Links are functional

### ✅ Hot Module Replacement (HMR) Test

1. Start the dev server with `npm start`
2. Open a page in your browser
3. Edit a React component file (e.g., add a comment or change text)
4. **Expected:** Page updates in <100ms without full reload
5. **Before (CRA):** Page reload took 1-3 seconds

### ✅ Build Test

```bash
npm run build
```

**Expected results:**
- Build completes in ~4-5 seconds
- No errors in output
- `build/` directory created with optimized assets
- `build/index.html` exists with replaced env variables

**Verify build output:**
```bash
ls -lh build/
# Should show index.html and assets/ directory
```

### ✅ Preview Production Build

```bash
npm run preview
```

Then visit http://localhost:4173 to test the production build locally.

### ✅ Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, if on macOS)

### ✅ Console Checks

Open browser DevTools (F12) and check:
- **Console tab:** No critical errors (404s for analytics are OK if not configured)
- **Network tab:** Verify API calls work (if token configured)
- **Application tab:** Check that service workers/cache work if applicable

## Common Issues & Solutions

### Issue: "npm-run-all: not found"
**Solution:** Run `npm install` to install all dependencies.

### Issue: "Failed to load manifest.json"
**Solution:** This is expected in development. The manifest is only used in production builds.

### Issue: "ERR_BLOCKED_BY_CLIENT" for API calls
**Solution:** This occurs when the browser blocks external API requests due to CORS/security policies. 

**For automated testing (Copilot Agent, Playwright):**
- Use the provided `mcp.config.json` configuration file
- Run with: `copilot agent run --mcp-config ./mcp.config.json`
- This configures Playwright to allow external domain access

**For local development in browser:**
- This is normal if you have ad blockers or strict security settings
- Analytics/ads may be blocked, but core API functionality should work
- Check browser console to identify which domains are blocked
- Disable ad blockers or add exceptions for:
  - `api.madgrades.com`
  - `api.uptimerobot.com`

### Issue: "ERR_BLOCKED_BY_CLIENT" for analytics
**Solution:** This is normal if you have ad blockers. Analytics/ads will work in production.

### Issue: API calls fail with 401/403
**Solution:** Verify your `VITE_MADGRADES_API_TOKEN` is set correctly in `.env`

### Issue: Build fails with "out of memory"
**Solution:** Increase Node memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`

## Performance Metrics

Compare before/after migration:

| Metric | Before (CRA) | After (Vite) |
|--------|--------------|--------------|
| Dev server startup | 15-20s | ~300ms |
| Production build | 25-30s | ~4s |
| Hot Module Replacement | 1-3s | <100ms |
| Dependencies | 1732 packages | 496 packages |

## Environment Variables Reference

All environment variables use the `VITE_` prefix (changed from `REACT_APP_`):

- `VITE_MADGRADES_API` - API base URL (default: https://api.madgrades.com/)
- `VITE_MADGRADES_API_TOKEN` - API authentication token
- `VITE_URL` - Frontend URL for structured data
- `VITE_GA4_TRACKING_ID` - Google Analytics 4 tracking ID
- `VITE_UPTIME_ROBOT_API_KEY` - Uptime Robot API key
- `VITE_ADSENSE_CLIENT` - Google AdSense client ID
- `VITE_ADSENSE_SIDEBAR_SLOT` - AdSense slot for sidebar ads

**Note:** Unlike CRA, Vite only exposes variables prefixed with `VITE_` to the client code. This provides better security by preventing accidental exposure of sensitive variables.

## Reporting Issues

If you encounter issues during testing:

1. Check browser console for errors
2. Verify `.env` file is properly configured
3. Try clearing browser cache and restarting dev server
4. Check that all dependencies are installed: `npm install`
5. Report with: Node version, npm version, browser, and error messages

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [Vite Environment Variables Guide](https://vitejs.dev/guide/env-and-mode.html)
- [Migration from CRA to Vite](https://vitejs.dev/guide/migration.html)
