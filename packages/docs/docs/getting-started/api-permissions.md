---
sidebar_label: 'API Permissions'
displayed_sidebar: webtoolsSidebar
slug: /api-permissions
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# 🔐 API Permissions

Webtools exposes API endpoints that your frontend application uses to fetch content by URL path. This requires proper permissions configuration.

:::danger Required for Frontend
Without the proper permissions, you'll get a **403 Forbidden** error when calling:
- `GET /api/webtools/router?path=...`
- `GET /api/webtools/url-alias`
:::

---

## 1. Content-Type Permissions

For each content-type where you've enabled Webtools, you need to enable the **find** permission.

### Configuration Steps

1. Go to **Strapi Admin → Settings → Users & Permissions plugin → Roles**
2. Select the role (e.g., **Public** or **Authenticated**)
3. Under **Application** you'll find your enabled content-types (e.g., `page`, `article`)
4. Check **Find** (and **Find One** if desired)
5. Click **Save**

<ThemedImage
  alt="Content Type Find permissions"
  sources={{
    light: useBaseUrl('/webtools/img/assets/permissions-ct-find-dark.png'),
    dark: useBaseUrl('/webtools/img/assets/permissions-ct-find-dark.png'),
  }}
/>

### What it enables

- Allows the router endpoint to return content data for your content-types
- Required for fetching content by URL path via `/api/webtools/router`

---

## 2. Webtools Plugin Permissions

Enable the Webtools API endpoints for your frontend application.

### Configuration Steps

1. In the same role (e.g., **Public**) scroll to the **Webtools** section
2. Check:
   - **Router: find**
   - **URL Alias: find**
3. Click **Save**

<ThemedImage
  alt="Webtools Router & URL Alias find permissions"
  sources={{
    light: useBaseUrl('/webtools/img/assets/permissions-webtools-find-dark.png'),
    dark: useBaseUrl('/webtools/img/assets/permissions-webtools-find-dark.png'),
  }}
/>

### What it enables

| Permission | Endpoint | Description |
|------------|----------|-------------|
| **Router: find** | `GET /api/webtools/router?path=...` | Allows to fetch content by URL path for routing in frontend applications |
| **URL Alias: find** | `GET /api/webtools/url-alias` | Allows to fetch all URL aliases for generating static routes |

---

## Access via API Tokens

In addition to the Users & Permissions plugin (for public and authenticated users), you can use **API Tokens** for programmatic access to Webtools endpoints.

### When to use API Tokens

- **Build-time data fetching**: Static site generators (Next.js, Gatsby, etc.)
- **Server-to-server communication**: Backend services fetching content by URL
- **CI/CD pipelines**: Automated testing or validation
- **Development tools**: Local development scripts fetching routes

### Creating an API Token

1. Go to **Strapi Admin → Settings → API Tokens**
2. Click **Create new API Token**
3. Configure the token:
   - **Name**: e.g., "Frontend Build Token" or "Webtools API Access"
   - **Description**: Optional description of the token's purpose
   - **Token duration**: Unlimited, 7 days, 30 days, or 90 days
   - **Token type**: Choose based on your needs:
     - **Read-only**: Can only fetch data (recommended for webtools)
     - **Full access**: Can create, update, and delete (use with caution)
     - **Custom**: Fine-grained permissions (see below)

4. Click **Save** and copy the generated token immediately (it won't be shown again)

### Configuring Custom Permissions for API Tokens

For better security, use **Custom** token type with specific permissions:

1. Select **Custom** as Token type
2. Enable permissions for your content-types:
   - Under each content-type: **find** and **findOne**
3. Scroll to **Webtools** section
4. Enable:
   - **Router: find**
   - **URL Alias: find**

:::tip Security Best Practice
Use **Read-only** tokens or **Custom** tokens with only find permissions enabled for frontend applications. Never expose tokens with write permissions in client-side code.
:::

### Using the API Token

Include the token in the `Authorization` header when making requests:

```bash
# Fetch content by URL path
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  "http://localhost:1337/api/webtools/router?path=/about-us"

# Fetch all URL aliases
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  "http://localhost:1337/api/webtools/url-alias"
```

**Next.js example (server-side):**
```javascript
// app/[...slug]/page.tsx
export async function generateStaticParams() {
  const response = await fetch('https://your-strapi.com/api/webtools/url-alias', {
    headers: {
      'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
  });
  const aliases = await response.json();

  return aliases.data.map((alias) => ({
    slug: alias.attributes.url_path.split('/').filter(Boolean),
  }));
}

export default async function Page({ params }) {
  const path = '/' + params.slug.join('/');

  const response = await fetch(
    `https://your-strapi.com/api/webtools/router?path=${path}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    }
  );

  const data = await response.json();
  // Render your page...
}
```

**Important:** Store API tokens in environment variables (`.env.local`), never commit them to version control.

---

## Testing API Access

### Test with Public/Authenticated role

```bash
# Without authentication (requires Public role permissions)
curl "http://localhost:1337/api/webtools/router?path=/about-us"

# With user JWT token (requires Authenticated role permissions)
curl -H "Authorization: Bearer USER_JWT_TOKEN" \
  "http://localhost:1337/api/webtools/router?path=/about-us"
```

### Test with API Token

```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  "http://localhost:1337/api/webtools/router?path=/about-us"
```

**Expected response:**
```json
{
  "data": {
    "id": 1,
    "documentId": "abc123",
    "title": "About Us",
    "content": "...",
    // ... other content fields
  },
  "meta": {
    "contentType": "api::page.page"
  }
}
```

:::tip
Restart Strapi after making permission changes and clear your browser cache if needed.
:::

---

## Troubleshooting

**403 Forbidden Error:**
- Verify the correct role (Public/Authenticated) has permissions enabled for:
  - Content-type **find** permission
  - Webtools **Router: find** permission
  - Webtools **URL Alias: find** permission (if using that endpoint)
- If using API token, verify it's valid and has correct permissions
- Restart Strapi after permission changes
- Check that the token hasn't expired

**API Token not working:**
- Ensure token is included in `Authorization: Bearer TOKEN` header
- Verify token hasn't expired
- Check token type has necessary permissions (not Read-only for write operations)
- Regenerate token if needed

**Content returns empty:**
- Verify content is published (not draft)
- Check that URL alias exists for the content
- Ensure content-type has Webtools enabled in schema
- Verify content has a valid `url_alias` relation

**CORS issues in frontend:**
- Configure CORS in `config/middlewares.js`:
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
