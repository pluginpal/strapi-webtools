---
sidebar_label: 'Troubleshooting'
displayed_sidebar: webtoolsSidebar
slug: /troubleshooting
---

# 🔧 Troubleshooting

Common issues and solutions when working with Strapi Webtools.

## Installation Issues

### Node.js version error
```
The engine "node" is incompatible with this module. Expected version ">=18"
```

**Solution:** Update Node.js to version 18 or higher:
```bash
nvm install 18
nvm use 18
```

### Peer dependency warnings
Multiple warnings about unmet peer dependencies during installation.

**Solution:** These warnings are normal and won't affect functionality. The plugin will work correctly despite these warnings.

## License Issues

### License key activation is not valid
```
error: [webtools]: License key activation is not valid. Remove the activation_id from your package.json to issue a new activation for this project.
```

This error occurs when the stored license activation is no longer valid. The `activation_id` is stored in your `package.json` under `strapi.webtools.activation_id`. This can happen when:

- You moved the project to a different machine
- You reinstalled dependencies or changed the project structure
- Your license has expired or been deactivated
- You've reached the maximum number of activations for your license

**Solution:** Remove the activation ID and restart Strapi to trigger a new activation:

1. Open your `package.json` file
2. Find the `strapi.webtools.activation_id` field (located inside the `strapi` object)
3. Remove the entire `activation_id` field and its value
4. Save the file
5. Restart your Strapi server

The plugin will automatically create a new activation on the next startup.

**Example:**

Before:
```json
{
  "name": "my-strapi-project",
  "version": "1.0.0",
  "strapi": {
    "uuid": "...",
    "webtools": {
      "activation_id": "..."
    }
  }
}
```

After:
```json
{
  "name": "my-strapi-project",
  "version": "1.0.0",
  "strapi": {
    "uuid": "...",
    "webtools": {}
  }
}
```

:::tip
If you continue to experience activation issues after removing the `activation_id`, ensure your license key is correctly set in the `.env` file:
```
WEBTOOLS_LICENSE_KEY=your-license-key-here
```

You can also re-run the license setup:
```bash
npx webtools-cli setup-license
```
:::

## Pattern & URL Issues

### URL is incorrect

Webtools applies its own slugify function to URL patterns. If you're using an already-slugified field in your pattern, it will be slugified twice, resulting in incorrect URLs.

**Example problem:**
- Field value: `my-blog-post` (already slugified)
- Pattern: `/blog/[title]`
- Result: `/blog/my--blog--post` (double slugified)

**Solution:** Disable the slugify function in your Webtools configuration if you're using pre-slugified fields.

See [slugify configuration docs](/configuration/slugify)

### Can't select field in pattern
When creating URL patterns, some content types don't show field options.

**Possible causes:**
- Content type has internationalization enabled
- Content type has no suitable fields for URL generation
- Browser cache issue - try hard refresh (Ctrl+R)

### Locale required
Some content types require locale selection when creating patterns.

**Explanation:** Multi-language content types need locale-specific patterns. This is normal behavior for internationalized content.

### Multiple content type bundles
Content types can be selected multiple times in sitemap bundles.

**Use case:** Each bundle can have different settings (change frequency, priority, locale-specific configurations).

## Sitemap Issues

### Invalid URL error (500)
```
TypeError [ERR_INVALID_URL]: Invalid URL
```

**Solution:** Ensure hostname includes protocol prefix:
- ✅ Correct: `http://localhost:1337`
- ❌ Wrong: `localhost:1337`

### Generate sitemap button stuck
UI becomes unresponsive after sitemap generation error (usually caused by incorrect hostname format).

**Solution:** Hard refresh browser (Ctrl+R) to reset the interface state.

### Router permissions error
500 error when generating sitemap, even with correct URL format.

**Solution:** Enable router permissions in **Settings > Users & Permissions > Public**:
- `webtools.router.find`

## API Issues

### Returns all URLs instead of one
```bash
curl "localhost:1337/api/webtools/url-alias?url_path=/my-path"
# Returns all URLs, not just the requested one
```

**Solution:** Use Strapi's filter syntax:
```bash
curl "localhost:1337/api/webtools/url-alias?filters[url_path][$eq]=/my-path"
```

### 403 forbidden error
```json
{"error": {"status": 403, "name": "ForbiddenError"}}
```

**Solution:** Enable webtools permissions in **Settings > Users & Permissions > Public**:
- `webtools.url-alias.find`
- `webtools.router.find`

### CORS Errors in Development
```
Origin null is not allowed by Access-Control-Allow-Origin
```

**Solution:** Add development origins to `config/middlewares.ts`:
```js
{
  name: 'strapi::cors',
  config: {
    origin: [
      'http://localhost:3000',
      'file://',
      'null'
    ]
  }
}
```

## Configuration Issues

### Default Language URL Type
Controls how the default locale appears in URLs:

- **Disabled**: All URLs use same format `/path`
- **Default language URL of bundles**: Default locale gets `/en/path`, others `/nl/path`
- **Other**: Custom locale handling

Choose based on your multilingual URL structure needs.

### URL Bundle Configuration
Each content type can have multiple bundles with different:
- Change frequency (hourly, daily, monthly)
- Priority settings (0.1 - 1.0)
- Locale-specific configurations

This allows fine-grained control over how different content appears in your sitemap.

## Still Having Issues?

1. **Check server logs** for detailed error messages
2. **Restart Strapi** after configuration changes
3. **Clear browser cache** if UI behaves unexpectedly
4. **Verify permissions** are correctly set for all required endpoints

If problems persist, check the [GitHub issues](https://github.com/pluginpal/strapi-webtools/issues) or create a new issue with your configuration details.
