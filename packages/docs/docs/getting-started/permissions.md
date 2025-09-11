---
sidebar_label: 'Permissions'
displayed_sidebar: webtoolsSidebar
slug: /permissions
---

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

<img src="/webtools/img/assets/permissions-ct-find.png" alt="Content Type Find permissions" />

---

## 2. Webtools plugin permissions

Enable the Webtools endpoints for your front-end:

1. In the same role (e.g., **Public**) scroll to the **Webtools** section.
2. Check:
   - **Router: find**
   - **URL Alias: find**
3. Click **Save**.

<img src="/webtools/img/assets/permissions-webtools-find.png" alt="Webtools Router & URL Alias find permissions" />

---

## 3. Admin Panel roles

Want your editors/admins to manage Webtools settings? Configure:

1. Go to **Strapi Admin → Settings → Administration Panel → Roles**.
2. Choose the role (e.g., **Author**).
3. Under **Plugins** → **Webtools** enable the permissions you need:
   - **Access the URL alias list**
   - **Access the URL alias patterns**
   - **Access the URL alias sidebar**
4. Click **Save**.

<img src="/webtools/img/assets/permissions-admin-roles.png" alt="Admin Panel Webtools access rights" />

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
