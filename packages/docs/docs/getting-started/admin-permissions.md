---
sidebar_label: 'Admin Permissions'
displayed_sidebar: webtoolsSidebar
slug: /admin-permissions
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# 🔐 Admin Panel Permissions

Configure granular permissions to control what administrators can do with Webtools in the Strapi admin panel.

---

## Configuration

To configure permissions for a role:

1. Go to **Strapi Admin → Settings → Administration Panel → Roles**
2. Choose the role (e.g., **Author**, **Editor**)
3. Under **Plugins** → **Webtools** enable the permissions you need
4. Click **Save**

<ThemedImage
  alt="Admin Panel Webtools access rights"
  sources={{
    light: useBaseUrl('/webtools/img/assets/permissions-admin-roles-dark.png'),
    dark: useBaseUrl('/webtools/img/assets/permissions-admin-roles-dark.png'),
  }}
/>

---

## Available Permissions

The following table lists all available permissions for Webtools in the admin panel:

| Permission | Description |
|------------|-------------|
| **Access the overview page** | Gives access to the main Webtools overview page at `/plugins/webtools` |
| **Access the URL alias list** | Allows to view and manage all URL aliases created for content |
| **Access the URL alias patterns** | Allows to configure URL pattern templates (list, create, edit) |
| **Access the URL alias sidebar** | Shows the Webtools panel in the Content Manager sidebar when editing content |

---

## Permission Combinations

Common permission setups for different roles:

| Role | Overview | URL Alias List | URL Patterns | Sidebar |
|------|----------|----------------|--------------|---------|
| **Content Editor** | ❌ | ✅ | ❌ | ✅ |
| **Senior Editor** | ✅ | ✅ | ❌ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ |
| **Viewer** | ❌ | ✅ | ❌ | ❌ |

**Content Editor** - Can view URLs when editing content and see the URL alias list, but cannot modify patterns or access the overview page.

**Senior Editor** - Can access the overview page and manage URL aliases, but cannot modify URL patterns to prevent accidental changes to URL generation rules.

**Admin** - Has full access to all Webtools features including URL pattern management.

**Viewer** - Can only view the URL alias list in read-only mode.

---

## Super Admin Role

:::info Automatic Access
The **Super Admin** role has all permissions enabled by default and cannot be modified.
:::

:::tip RBAC Conditions
For non-Super-Admin roles, you can click the **Settings** button next to permissions to add conditional access rules (e.g., "can edit when user is creator"). See [Strapi RBAC documentation](https://docs.strapi.io/dev-docs/configurations/rbac) for details.
:::

---

## Testing Permissions

To verify permissions are configured correctly:

1. Create a test user with the configured role
2. Log in as that user
3. Navigate to **Webtools** in the admin panel
4. Verify the available pages and actions match the configured permissions

:::tip
Restart Strapi and clear your browser cache after making permission changes.
:::

---

## Troubleshooting

**Webtools menu not visible:**
- Verify the role has at least one Webtools permission enabled
- Log out and log back in
- Clear browser cache

**URL alias sidebar not showing in Content Manager:**
- Check that "Access the URL alias sidebar" permission is enabled
- Verify the content-type has Webtools enabled in its schema
- Refresh the page

**Cannot access URL patterns page:**
- Verify "Access the URL alias patterns" permission is enabled for the role
- Check that the user's role is not disabled
- Clear browser cache

**Permission changes not applying:**
- Verify you clicked "Save" after modifying permissions
- Restart Strapi server
- Have the user log out and log back in
- Clear browser cache and cookies
