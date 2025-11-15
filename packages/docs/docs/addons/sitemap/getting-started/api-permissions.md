---
sidebar_label: 'API Permissions'
displayed_sidebar: webtoolsSitemapSidebar
slug: /addons/sitemap/api-permissions
---

# 🔐 API Permissions

The Sitemap addon exposes sitemap XML files publicly by default. No permission configuration is required for standard usage.

---

## Public Sitemap Access

The sitemap XML files are automatically accessible to the public:

- `/sitemap.xml` - Main sitemap or sitemap index
- `/sitemap/[name].xml` - Individual sitemaps (when using sitemap index)

:::info Automatic Configuration
These endpoints are automatically enabled during bootstrap for the **Public** role. No manual permission configuration is needed.
:::

---

## Testing Sitemap Access

### Test Main Sitemap

```bash
curl "http://localhost:1337/sitemap.xml"
```

**Expected response:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/page</loc>
    <lastmod>2025-01-15</lastmod>
  </url>
  <!-- ... more URLs -->
</urlset>
```

### Test Sitemap Index

If you have multiple sitemaps configured:

```bash
curl "http://localhost:1337/sitemap.xml"
```

**Expected response:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap/articles.xml</loc>
    <lastmod>2025-01-15</lastmod>
  </sitemap>
  <!-- ... more sitemaps -->
</sitemapindex>
```

---

## Advanced: Restricting Sitemap Access

If you need to restrict sitemap access (e.g., for staging environments), you can use middleware or routes customization.

### Option 1: Using Middleware

Create a custom middleware in `src/middlewares/sitemap-auth.js`:

```javascript
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.request.url.startsWith('/sitemap')) {
      // Add your custom authorization logic
      const token = ctx.request.headers['x-sitemap-token'];

      if (token !== process.env.SITEMAP_ACCESS_TOKEN) {
        return ctx.unauthorized('Invalid sitemap access token');
      }
    }

    await next();
  };
};
```

Register in `config/middlewares.js`:

```javascript
module.exports = [
  // ... other middlewares
  'global::sitemap-auth',
];
```

### Option 2: Using API Tokens

For programmatic access (e.g., SEO tools, monitoring services), you can create read-only API tokens.

1. Go to **Strapi Admin → Settings → API Tokens**
2. Click **Create new API Token**
3. Configure the token:
   - **Name**: "SEO Tool Access"
   - **Token type**: Read-only
   - **Token duration**: Unlimited or as needed

4. Use the token with `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  "http://localhost:1337/sitemap.xml"
```

:::tip For Build-Time Access
If you're fetching sitemaps during static site generation (Next.js, Gatsby), use API tokens stored in environment variables to access Strapi during builds.
:::

---

## robots.txt Configuration

The sitemap location should be declared in your `robots.txt` file. See the [robots.txt guide](/addons/sitemap/robots-txt) for configuration details.

---

## Troubleshooting

**404 Not Found:**
- Verify the sitemap addon is installed and enabled
- Check that at least one content type with webtools is published
- Ensure sitemap has been generated (manually or via cron)

**Empty sitemap:**
- Verify content is published (not draft)
- Check "Exclude drafts" setting is properly configured
- Ensure URL aliases are generated for content

**CORS issues:**
- Configure CORS in `config/middlewares.js` if accessing from browsers:
```javascript
module.exports = [
  // ...
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:3000', 'https://your-frontend.com'],
    },
  },
];
```
