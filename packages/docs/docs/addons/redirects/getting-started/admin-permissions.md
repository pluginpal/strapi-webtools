---
sidebar_label: 'Admin Permissions'
displayed_sidebar: webtoolsRedirectsSidebar
slug: /addons/redirects/admin-permissions
---

# 🔐 Admin Panel Permissions

The Redirects addon provides granular permissions for controlling what admin users can do in the Strapi admin panel.

---

## Setting up Admin Panel Permissions

For admin users to manage redirects in the Strapi admin panel.

### Configuration Steps

1. Go to **Strapi Admin → Settings → Administration Panel → Roles**.
2. Choose the role (e.g., **Editor**, **Author**).
3. Scroll to **Webtools-addon-redirects** plugin section.
4. Enable the permissions needed for this role.
5. Click **Save**.

---

## Available Permissions

### Access the overview page
- **What it does:** Allows access to the redirects list page
- **Use case:** View all configured redirects
- **Required for:** Seeing the redirects overview in Webtools
- **UI Location:** `/plugins/webtools/redirects`

### Create new redirects
- **What it does:** Shows the "Create" button and allows access to the create page
- **Use case:** Let editors add new redirect rules
- **Required for:** Creating redirects via `/plugins/webtools/redirects/new`

### Edit existing redirects
- **What it does:** Allows access to the edit page for individual redirects
- **Use case:** Let editors modify existing redirect rules
- **Required for:** Updating redirects via `/plugins/webtools/redirects/:id`

### Delete existing redirects
- **What it does:** Shows the delete button and allows deletion of redirects
- **Use case:** Let editors remove outdated redirects
- **Required for:** Removing redirects from the system

---

## Permission Combinations

Here are some common permission setups based on different roles:

### For Content Editors
- ✅ Access the overview page
- ✅ Create new redirects
- ✅ Edit existing redirects
- ❌ Delete existing redirects (prevent accidental deletions)

**Use case:** Content editors who need to manage redirects but shouldn't be able to delete them without approval.

### For Senior Editors
- ✅ All permissions

**Use case:** Trusted users who can fully manage redirects including deletions.

### For Viewers (read-only)
- ✅ Access the overview page only

**Use case:** Stakeholders or reviewers who need to see redirects but not modify them.

---

## Super Admin Role

:::info Automatic Access
The **Super Admin** role has all permissions enabled by default and cannot be modified. All configurations are in read-only mode.
:::

The **Settings** button visible in the permissions UI is for configuring RBAC conditions on other roles, but has no effect on Super Admin permissions.

---

## Testing Admin Panel Access

### Test Workflow

1. Create a test user with the configured role
2. Log in as that user
3. Navigate to **Webtools → Redirects**
4. Verify you can see/create/edit/delete according to permissions

### Expected Behavior

**With "Access the overview page" only:**
- Can see the redirects list
- No "Create" button visible
- Cannot access edit or delete actions

**With all permissions:**
- Can see the redirects list
- "Create" button is visible
- Can click on redirects to edit
- Delete button/action is available

:::tip
Restart Strapi after making permission changes and clear your browser cache if needed.
:::

---

## Troubleshooting

### User cannot access Webtools plugin

**Problem:** The Webtools menu item is not visible in the sidebar.

**Solutions:**
- Verify the user has at least "Access the overview page" permission
- Check that the user's role is not disabled
- Log out and log back in
- Clear browser cache

### Create/Edit/Delete buttons not showing

**Problem:** User can see redirects but action buttons are missing.

**Solutions:**
- Verify the specific permissions (create/edit/delete) are enabled for the user's role
- Refresh the page after permission changes
- Check browser console for permission errors

### Permission changes not taking effect

**Problem:** After updating permissions, user still has old access level.

**Solutions:**
- Ask the user to log out and log back in
- Restart Strapi server
- Clear browser cache and cookies
- Verify you clicked "Save" after changing permissions
