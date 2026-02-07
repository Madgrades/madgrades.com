# MCP Configuration for Playwright

This configuration file enables external domain access for the Playwright browser when running automated tests with Copilot Agent or similar tools.

## Purpose

By default, Playwright's MCP server blocks external API calls with `ERR_BLOCKED_BY_CLIENT`. This configuration:

1. **Whitelists external domains** - Allows API calls to madgrades.com, uptimerobot.com, Google services, etc.
2. **Disables web security** - Removes same-origin policy restrictions for testing
3. **Enables CORS** - Configures the server to accept cross-origin requests

## Usage

### With Copilot Agent

```bash
copilot agent run --mcp-config ./mcp.config.json
```

### Configuration Details

**Playwright Server:**
- `host: "0.0.0.0"` - Binds to all network interfaces
- `port: 3500` - Server port
- `allowedOrigins` - Whitelist of domains that can be accessed

**Browser Launch Options:**
- `--disable-web-security` - Disables same-origin policy
- `--disable-features=IsolateOrigins,site-per-process` - Removes origin isolation
- `--remote-allow-origins=*` - Allows debugging from any origin

## Whitelisted Domains

- `http://localhost:3000` - Development server
- `http://localhost:3001` - Alternative dev port
- `https://madgrades.com` - Production frontend
- `https://api.madgrades.com` - Main API
- `https://api.uptimerobot.com` - Uptime monitoring
- `https://www.googletagmanager.com` - Google Analytics
- `http://pagead2.googlesyndication.com` - Google AdSense
- `https://fonts.googleapis.com` - Google Fonts
- `https://fonts.gstatic.com` - Google Fonts CDN

## Adding New Domains

If you need to whitelist additional domains:

1. Open `mcp.config.json`
2. Add the domain to the `allowedOrigins` array
3. Restart the Copilot Agent with the updated config

**Important:** Use commas between array items, not semicolons!

## Security Note

This configuration disables browser security features to enable testing. **Do not use this configuration in production environments.** It should only be used for:

- Local development testing
- Automated testing with Copilot Agent
- CI/CD test environments

## Troubleshooting

### Still seeing ERR_BLOCKED_BY_CLIENT?

1. **Check JSON syntax** - A missing comma or quote can break the config
2. **Verify domain spelling** - Ensure the blocked domain is in `allowedOrigins`
3. **Check the logs** - Look for "listening on 0.0.0.0:3500" message
4. **Inspect network console** - Use DevTools to see which origin is blocked
5. **Restart the agent** - Changes require a full restart

### Logs show server not starting?

- Check for port conflicts (3500 already in use)
- Verify JSON is valid: `cat mcp.config.json | jq`
- Check file permissions

## References

- [Playwright Browser Server](https://playwright.dev/docs/api/class-browserserver)
- [Chromium Launch Options](https://peter.sh/experiments/chromium-command-line-switches/)
- See `TESTING.md` for complete testing guide
