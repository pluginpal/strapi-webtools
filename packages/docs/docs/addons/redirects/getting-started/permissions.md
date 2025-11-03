---
sidebar_label: 'Permissions'
displayed_sidebar: webtoolsRedirectsSidebar
slug: /addons/redirects/permissions
---

# 🔐 Permissions

The Redirects addon requires proper permissions configuration for both public API access and admin panel management.

---

## 1. Public API Permissions

For your frontend to access the redirects API endpoint.

### Configuration

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

## 2. Admin Panel Permissions

For admin users to manage redirects in the Strapi admin panel.

### Configuration

1. Go to **Strapi Admin → Settings → Administration Panel → Roles**.
2. Choose the role (e.g., **Editor**, **Author**).
3. Scroll to **Webtools-addon-redirects** plugin section.
4. Enable the permissions needed for this role.
5. Click **Save**.

### Available Permissions

#### Access the overview page
- **What it does:** Allows access to the redirects list page
- **Use case:** View all configured redirects
- **Required for:** Seeing the redirects overview in Webtools
- **UI Location:** `/plugins/webtools/redirects`

#### Create new redirects
- **What it does:** Shows the "Create" button and allows access to the create page
- **Use case:** Let editors add new redirect rules
- **Required for:** Creating redirects via `/plugins/webtools/redirects/new`

#### Edit existing redirects
- **What it does:** Allows access to the edit page for individual redirects
- **Use case:** Let editors modify existing redirect rules
- **Required for:** Updating redirects via `/plugins/webtools/redirects/:id`

#### Delete existing redirects
- **What it does:** Shows the delete button and allows deletion of redirects
- **Use case:** Let editors remove outdated redirects
- **Required for:** Removing redirects from the system

### Permission Combinations

**For Content Editors:**
- ✅ Access the overview page
- ✅ Create new redirects
- ✅ Edit existing redirects
- ❌ Delete existing redirects (prevent accidental deletions)

**For Senior Editors:**
- ✅ All permissions

**For Viewers (read-only):**
- ✅ Access the overview page only

---

## 3. Super Admin Role

:::info Automatic Access
The **Super Admin** role has all permissions enabled by default and cannot be modified. All configurations are in read-only mode.
:::

The **Settings** button visible in the permissions UI is for configuring RBAC conditions on other roles, but has no effect on Super Admin permissions.

---

## Testing Permissions

### Test Public API Access
```bash
curl "http://localhost:1337/api/webtools/redirects"
```

### Test Admin Panel Access
1. Create a test user with the configured role
2. Log in as that user
3. Navigate to Webtools → Redirects
4. Verify you can see/create/edit/delete according to permissions

:::tip
Restart Strapi after making permission changes and clear your browser cache if needed.
:::
