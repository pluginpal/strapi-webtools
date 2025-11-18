---
sidebar_label: 'API Permissions'
displayed_sidebar: webtoolsRedirectsSidebar
slug: /addons/redirects/api-permissions
---

# 🔐 API Permissions

The Redirects addon exposes a public API endpoint that your frontend can use to fetch redirect rules. This requires proper permissions configuration.

---

## Setting up Public API Access

For your frontend application to access the redirects API endpoint.

### Configuration Steps

1. Go to **Strapi Admin → Settings → Users & Permissions plugin → Roles**.
2. Select the role (e.g., **Public** or **Authenticated**).
3. Under **Webtools-addon-redirects** section.
4. Check **Redirect: find**.
5. Click **Save**.

### What it enables

- Access to `GET /api/webtools/redirects` endpoint
- Required for: Frontend redirect implementation

:::danger Required for Frontend
Without this permission, you'll get a **403 Forbidden** error when calling the redirects API from your frontend.
:::

---

## Access via API Tokens

In addition to the Users & Permissions plugin (for public and authenticated users), you can also use **API Tokens** for programmatic access to the redirects endpoint.

### When to use API Tokens

- **Build-time data fetching**: Static site generators (Next.js, Gatsby, etc.)
- **Server-to-server communication**: Backend services fetching redirect rules
- **CI/CD pipelines**: Automated testing or validation of redirects
- **Webhook handlers**: External services that need to check redirects

### Creating an API Token

1. Go to **Strapi Admin → Settings → API Tokens**.
2. Click **Create new API Token**.
3. Configure the token:
   - **Name**: e.g., "Frontend Build Token" or "Redirects API Access"
   - **Description**: Optional description of the token's purpose
   - **Token duration**: Unlimited, 7 days, 30 days, or 90 days
   - **Token type**: Choose based on your needs:
     - **Read-only**: Can only fetch data (recommended for redirects)
     - **Full access**: Can create, update, and delete (use with caution)
     - **Custom**: Fine-grained permissions (see below)

4. Click **Save** and copy the generated token immediately (it won't be shown again).

### Configuring Custom Permissions for API Tokens

For better security, use **Custom** token type with specific permissions:

1. Select **Custom** as Token type.
2. Scroll to **Webtools-addon-redirects** section.
3. Enable only the permissions needed:
   - **find**: Allows `GET /api/webtools/redirects` (✅ recommended)
   - **findOne**: Allows fetching a single redirect by ID
   - **create**, **update**, **delete**: Only enable if programmatic management is needed

:::tip Security Best Practice
Use **Read-only** tokens or **Custom** tokens with only `find` permission enabled for frontend applications. Never expose tokens with write permissions in client-side code.
:::

### Using the API Token

Include the token in the `Authorization` header when making requests:

```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  "http://localhost:1337/api/webtools/redirects"
```

**Next.js example (server-side):**
```javascript
// app/[[...slug]]/page.tsx or pages/[[...slug]].tsx
export async function generateStaticParams() {
  const response = await fetch('https://your-strapi.com/api/webtools/redirects', {
    headers: {
      'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
  });
  const redirects = await response.json();
  // Process redirects...
}
```

**Important:** Store API tokens in environment variables (`.env.local`), never commit them to version control.

---

## Testing API Access

### Test with Public/Authenticated role
```bash
# Without authentication (requires Public role permissions)
curl "http://localhost:1337/api/webtools/redirects"

# With user JWT token (requires Authenticated role permissions)
curl -H "Authorization: Bearer USER_JWT_TOKEN" \
  "http://localhost:1337/api/webtools/redirects"
```

### Test with API Token
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  "http://localhost:1337/api/webtools/redirects"
```

**Expected response:**
```json
{
  "data": [
    {
      "id": 1,
      "source": "/old-page",
      "destination": "/new-page",
      "statusCode": 301,
      // ...
    }
  ]
}
```

:::tip
After making permission changes, restart Strapi and clear your browser cache if needed.
:::

---

## Troubleshooting

### 403 Forbidden Error

**Problem:** Getting 403 when calling the API endpoint.

**Solutions:**
- Verify the correct role (Public/Authenticated) has `find` permission enabled
- If using API token, verify it's valid and has correct permissions
- Restart Strapi after permission changes
- Check that the token hasn't expired

### API Token not working

**Problem:** Valid token returns 401 Unauthorized.

**Solutions:**
- Ensure token is included in `Authorization: Bearer TOKEN` header
- Verify token hasn't expired
- Check token type has necessary permissions (not Read-only for write operations)
- Regenerate token if needed

### CORS issues in frontend

**Problem:** Browser blocks API requests.

**Solutions:**
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
