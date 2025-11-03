---
sidebar_label: 'Permissions'
displayed_sidebar: webtoolsSidebar
slug: /permissions
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# 🔐 Role-Based Access Control (RBAC)

After installation, review Webtools permissions per role in Settings so your front-end can access the required endpoints.

Without the proper permissions, you'll get a **403 Forbidden** error when calling:
- `GET /api/webtools/router?path=…`
- `GET /api/webtools/url-alias`

Below are the three permission categories you need to configure.

---

## 1. Content-Type "find" permissions

For each content-type where you've enabled Webtools, you need to open up the standard **find** permission.

1. Go to **Strapi Admin → Settings → Users & Permissions plugin → Roles**.
2. Select the role (e.g., **Public**).
3. Under **Application** you'll find your enabled content-types (e.g., `page`, `article`).
4. Check **Find** (and **Find One** if desired).
5. Click **Save**.

<ThemedImage
  alt="Content Type Find permissions"
  sources={{
    light: useBaseUrl('/webtools/img/assets/permissions-ct-find-dark.png'),
    dark: useBaseUrl('/webtools/img/assets/permissions-ct-find-dark.png'),
  }}
/>

---

## 2. Webtools plugin permissions

Enable the Webtools endpoints for your front-end:

1. In the same role (e.g., **Public**) scroll to the **Webtools** section.
2. Check:
   - **Router: find**
   - **URL Alias: find**
3. Click **Save**.

<ThemedImage
  alt="Webtools Router & URL Alias find permissions"
  sources={{
    light: useBaseUrl('/webtools/img/assets/permissions-webtools-find-dark.png'),
    dark: useBaseUrl('/webtools/img/assets/permissions-webtools-find-dark.png'),
  }}
/>

---

## 3. Admin Panel roles

Want your editors/admins to manage Webtools settings? Configure admin panel permissions:

### How to Configure

1. Go to **Strapi Admin → Settings → Administration Panel → Roles**.
2. Choose the role (e.g., **Author**, **Editor**).
3. Under **Plugins** → **Webtools** enable the permissions you need.
4. Click **Save**.

<ThemedImage
  alt="Admin Panel Webtools access rights"
  sources={{
    light: useBaseUrl('/webtools/img/assets/permissions-admin-roles-dark.png'),
    dark: useBaseUrl('/webtools/img/assets/permissions-admin-roles-dark.png'),
  }}
/>

### Available Permissions

#### Access the overview page
- **What it does:** Allows access to the main Webtools overview page at `/plugins/webtools`
- **Use case:** Give users a dashboard view of all Webtools features
- **Required for:** Viewing the Webtools main navigation and overview

#### Access the URL alias list
- **What it does:** Allows access to the URL Aliases list page
- **Use case:** Let editors view and manage all URL aliases created for content
- **Required for:** Viewing the list of all generated URLs

#### Access the URL alias patterns
- **What it does:** Allows access to the URL Patterns management pages (list, create, edit)
- **Use case:** Give admins ability to configure URL pattern templates
- **Required for:** Managing URL generation rules (e.g., `/blog/[title]`)

#### Access the URL alias sidebar
- **What it does:** Shows/hides the Webtools panel in the Content Manager sidebar
- **Use case:** Let content editors see and manage URLs when editing content
- **Required for:** Viewing URL information in the Content Manager

### Permission Combinations

**For Content Editors:**
- ✅ Access the URL alias sidebar (to see URLs when editing)
- ✅ Access the URL alias list (to view all URLs)
- ❌ Access the URL alias patterns (prevent pattern changes)
- ❌ Access the overview page (optional)

**For Admins:**
- ✅ All permissions (full access)

### Notes

:::info Super Admin
The **Super Admin** role has all permissions enabled by default and cannot be modified. The Settings button visible in the permissions UI allows adding RBAC conditions for other roles, but is read-only for Super Admin.
:::

:::tip RBAC Conditions
For non-Super-Admin roles, you can click the **Settings** button next to permissions to add conditional access rules (e.g., "can edit when user is creator"). See [Strapi RBAC documentation](https://docs.strapi.io/dev-docs/configurations/rbac) for details.
:::

---

## Test your permissions

After saving:

```bash
curl "http://localhost:1337/api/webtools/router?path=/about-page"
```

You should now receive data instead of a 403 error.

:::tip
Restart Strapi after making changes and clear the cache if necessary.
:::
