---
sidebar_label: 'Admin Permissions'
displayed_sidebar: webtoolsSitemapSidebar
slug: /addons/sitemap/admin-permissions
---

# 🔐 Admin Panel Permissions

Configure permissions to control administrator access to sitemap settings in the Strapi admin panel.

---

## Configuration

To configure permissions for a role:

1. Go to **Strapi Admin → Settings → Administration Panel → Roles**
2. Choose the role (e.g., **Editor**, **Author**)
3. Scroll to **Webtools-addon-sitemap** plugin section
4. Enable the permissions needed for this role
5. Click **Save**

---

## Available Permissions

The following table lists all available permissions for the Sitemap addon in the admin panel:

| Permission | Description |
|------------|-------------|
| **Access the plugin settings** | Gives access to the sitemap settings page at `/plugins/webtools/sitemap` and allows to view configuration and manually regenerate sitemaps |

:::info Read-Only Access
The sitemap addon provides primarily read-only access in the admin panel. Configuration changes must be made in `config/plugins.js` and require developer or system administrator access.
:::

---

## What Users Can Do

Users with "Access the plugin settings" permission can:

- View sitemap configuration (hostname, exclude drafts, etc.)
- See sitemap generation status and last generation time
- Manually trigger sitemap regeneration
- View generated sitemap URLs
- Access the sitemap index overview

---

## Permission Combinations

Common permission setups for different roles:

| Role | Access Settings |
|------|-----------------|
| **Content Editor** | ✅ |
| **Senior Editor** | ✅ |
| **SEO Manager** | ✅ |
| **Viewer** | ❌ |

**Content Editor / Senior Editor / SEO Manager** - Can view sitemap settings and regenerate sitemaps when content is updated.

**Viewer** - Cannot access sitemap settings page.

---

## Super Admin Role

:::info Automatic Access
The **Super Admin** role has all permissions enabled by default and cannot be modified.
:::

---

## Testing Permissions

To verify permissions are configured correctly:

1. Create a test user with the configured role
2. Log in as that user
3. Navigate to **Webtools → Sitemap**
4. Verify you can access the settings page

:::tip
Restart Strapi and clear your browser cache after making permission changes.
:::

---

## Troubleshooting

**Webtools menu not visible:**
- Verify the role has "Access the plugin settings" permission enabled
- Log out and log back in
- Clear browser cache

**Cannot regenerate sitemap:**
- Verify the user has "Access the plugin settings" permission
- Check server logs for generation errors
- Ensure content types have published content with URL aliases

**Permission changes not applying:**
- Verify you clicked "Save" after modifying permissions
- Restart Strapi server
- Have the user log out and log back in
- Clear browser cache and cookies
