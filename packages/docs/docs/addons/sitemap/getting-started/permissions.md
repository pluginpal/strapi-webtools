---
sidebar_label: 'Permissions'
displayed_sidebar: webtoolsSitemapSidebar
slug: /addons/sitemap/permissions
---

# 🔐 Permissions

The Sitemap addon has minimal permission requirements since it's primarily a read-only feature.

---

## Admin Panel Permission

### Configuration

1. Go to **Strapi Admin → Settings → Administration Panel → Roles**.
2. Choose the role (e.g., **Editor**, **Author**).
3. Under **Webtools-addon-sitemap** plugin section.
4. Enable **Access the plugin settings**.
5. Click **Save**.

### Access the plugin settings

- **What it does:** Allows access to the sitemap settings page
- **Use case:** View sitemap configuration and regenerate sitemaps
- **Required for:** Accessing `/plugins/webtools/sitemap`
- **Capabilities:**
  - View sitemap settings (hostname, exclude drafts, etc.)
  - See sitemap generation status
  - Manually regenerate sitemaps
  - View sitemap URLs

:::info Read-Only Access
The sitemap addon provides primarily read-only access. Configuration changes are made in `config/plugins.js` and require developer/system admin access.
:::

---

## Public Access

The sitemap XML files are publicly accessible by default:

- `/sitemap.xml` - Main sitemap or sitemap index
- `/sitemap/[name].xml` - Individual sitemaps

**No permission configuration needed** - these endpoints are automatically enabled during bootstrap for the Public role.

---

## Super Admin Role

:::info Automatic Access
The **Super Admin** role has all permissions enabled by default and cannot be modified.
:::

---

## Testing Permissions

### Test Admin Panel Access
1. Log in with a user that has the "Access the plugin settings" permission
2. Navigate to Webtools → Sitemap
3. Verify you can view settings and regenerate sitemaps

### Test Public Sitemap Access
```bash
curl "http://localhost:1337/sitemap.xml"
```

The sitemap should be accessible without authentication.
