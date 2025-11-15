---
sidebar_label: 'Admin Permissions'
displayed_sidebar: webtoolsRedirectsSidebar
slug: /addons/redirects/admin-permissions
---

# 🔐 Admin Panel Permissions

Configure granular permissions to control what administrators can do with redirects in the Strapi admin panel.

---

## Configuration

To configure permissions for a role:

1. Go to **Strapi Admin → Settings → Administration Panel → Roles**.
2. Choose the role (e.g., **Editor**, **Author**).
3. Scroll to **Webtools-addon-redirects** plugin section.
4. Enable the permissions needed for this role.
5. Click **Save**.

---

## Available Permissions

The following table lists all available permissions for the Redirects addon in the admin panel:

| Permission | Description |
|------------|-------------|
| **Access the redirects plugin** | Gives access to the redirects overview page at `/plugins/webtools/redirects` |
| **Create** | Allows to create new redirect rules |
| **Read** | Allows to view existing redirect configurations |
| **Update** | Allows to edit existing redirect rules |
| **Delete** | Allows to remove redirect rules from the system |

---

## Permission Combinations

Common permission setups for different roles:

| Role | Access | Create | Read | Update | Delete |
|------|--------|--------|------|--------|--------|
| **Content Editor** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Senior Editor** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Viewer** | ✅ | ❌ | ✅ | ❌ | ❌ |

**Content Editor** - Can manage redirects but cannot delete them to prevent accidental data loss.

**Senior Editor** - Has full access to all redirect management features.

**Viewer** - Can view redirects in read-only mode without making changes.

---

## Super Admin Role

:::info Automatic Access
The **Super Admin** role has all permissions enabled by default and cannot be modified. All configurations are in read-only mode.
:::

The **Settings** button visible in the permissions UI is for configuring RBAC conditions on other roles, but has no effect on Super Admin permissions.

---

## Testing Permissions

To verify permissions are configured correctly:

1. Create a test user with the configured role
2. Log in as that user
3. Navigate to **Webtools → Redirects**
4. Verify the available actions match the configured permissions

:::tip
Restart Strapi and clear your browser cache after making permission changes.
:::

---

## Troubleshooting

**Webtools menu not visible:**
- Verify the role has at least "Access the redirects plugin" permission enabled
- Log out and log back in
- Clear browser cache

**Action buttons missing:**
- Check that Create/Update/Delete permissions are enabled for the role
- Refresh the page
- Check browser console for errors

**Permission changes not applying:**
- Verify you clicked "Save" after modifying permissions
- Restart Strapi server
- Have the user log out and log back in
- Clear browser cache and cookies
