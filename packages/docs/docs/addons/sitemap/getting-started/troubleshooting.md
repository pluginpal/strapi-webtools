---
sidebar_label: 'Troubleshooting'
displayed_sidebar: webtoolsSitemapSidebar
slug: /addons/sitemap/troubleshooting
---

# 🔧 Troubleshooting

Common issues and solutions when working with the Sitemap addon.

---

## Generation Issues

### Invalid URL error (500)
```
TypeError [ERR_INVALID_URL]: Invalid URL
```

**Cause:** The hostname setting is missing the protocol prefix.

**Solution:** Ensure hostname includes protocol prefix in your sitemap settings:
- ✅ Correct: `http://localhost:1337` or `https://example.com`
- ❌ Wrong: `localhost:1337` or `example.com`

Go to **Webtools → Sitemap → Settings** and update the hostname field.

---

### Generate sitemap button stuck

**Problem:** UI becomes unresponsive after clicking "Generate sitemap" button.

**Cause:** Usually occurs after a sitemap generation error (such as incorrect hostname format).

**Solution:** Hard refresh your browser to reset the interface state:
- **Windows/Linux:** `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`

After refreshing, fix the underlying issue (e.g., hostname format) before generating again.

---

### Router permissions error

**Problem:** 500 error when generating sitemap, even with correct hostname format.

**Cause:** The sitemap generator needs access to the Webtools router endpoint to fetch content.

**Solution:** Enable router permissions for the Public role:

1. Go to **Settings → Users & Permissions plugin → Roles**
2. Select **Public** role
3. Scroll to **Webtools** section
4. Check **Router: find**
5. Click **Save**

See the [API Permissions documentation](/webtools/addons/sitemap/api-permissions) for more details.

---

### Empty sitemap generated

**Problem:** Sitemap generates successfully but contains no URLs.

**Possible causes:**
- Content is in draft status (not published)
- URL aliases not generated for content
- Content type doesn't have Webtools enabled
- "Exclude drafts" setting is enabled but content is considered draft

**Solution:**
1. Verify content is **published** (not draft)
2. Go to **Webtools → All URLs** and check if URL aliases exist
3. If no aliases exist, use the bulk generate feature
4. Verify content type has Webtools enabled in schema
5. Check **Webtools → Sitemap → Settings** and review "Exclude drafts" setting

---

## Configuration Issues

### Sitemap not accessible

**Problem:** Getting 404 when accessing `/sitemap.xml` or `/sitemap/index.xml`.

**Solution:**
- Verify the sitemap addon is installed and enabled
- Ensure at least one URL bundle or custom URL is configured
- Generate the sitemap manually via admin panel
- Restart Strapi server

---

### Confused about "Default Language URL Type"?

**Problem:** Not sure which option to choose in the bundle settings.

This setting controls how URLs for different locales appear in your sitemap for multilingual content.

**Options explained:**

| Option | Default Language URL | Other Language URL | Use When |
|--------|---------------------|-------------------|----------|
| **Disabled** | `/about` | `/about` | Single language site, or all locales use same URL format |
| **Default language URL of bundles** | `/en/about` | `/nl/about` | You want all languages (including default) to have locale prefixes |
| **Other** | `/about` | `/nl/about` | Only non-default languages should have locale prefixes |

**Example:**
If your default language is English and you choose "Other":
- English page: `https://example.com/about`
- Dutch page: `https://example.com/nl/about`

---

## Performance Issues

### Sitemap generation takes too long

**Problem:** Sitemap generation times out or takes several minutes.

**Possible causes:**
- Too many URLs in a single sitemap (exceeds 50,000 limit)
- Large number of content entries
- Complex URL pattern processing

**Solution:**
1. Use [sitemap indexes](/webtools/addons/sitemap/sitemap-index) to split large sitemaps
2. Adjust the `limit` setting in configuration to reduce URLs per sitemap
3. Enable [cron-based generation](/webtools/addons/sitemap/configuration/cron) instead of manual generation
4. Consider using [auto-generate on content update](/webtools/addons/sitemap/configuration/auto-generate) for incremental updates

See [Configuration: Limit](/webtools/addons/sitemap/configuration/limit) for details on managing large sitemaps.

---

## Still Having Issues?

1. **Check server logs** for detailed error messages
2. **Restart Strapi** after configuration changes
3. **Clear browser cache** if UI behaves unexpectedly
4. **Verify permissions** are correctly set (see [API Permissions](/webtools/addons/sitemap/api-permissions))

If problems persist, check the [GitHub issues](https://github.com/pluginpal/strapi-webtools/issues) or create a new issue with:
- Strapi version
- Webtools version
- Sitemap addon version
- Error messages from server logs
- Steps to reproduce the issue
