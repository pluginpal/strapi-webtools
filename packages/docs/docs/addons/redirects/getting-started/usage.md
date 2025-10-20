---
sidebar_label: 'Usage'
displayed_sidebar: webtoolsRedirectsSidebar
slug: /addons/redirects/usage
---

# 💡 Usage
With this plugin you have full control over which redirects should be active for your front-end. You can create, update and delete redirects right from the Strapi admin panel.

## Overview

On the redirects overview you can see all the redirects on your site.

<img src="/webtools/img/assets/addons/redirects/redirects-overview.png" alt="Redirects overview" />

## Create redirects

With the button in the top right you can create new redirects.

<img src="/webtools/img/assets/addons/redirects/create-redirects.png" alt="Create redirects" />

### URL Format

When creating redirects, follow these guidelines for the URL paths:

**From Path (Source URL):**
- Always start with a forward slash `/`
- Use relative paths only (no domain)
- Example: `/old-page` or `/blog/old-article`

**To Path (Destination URL):**
- For internal redirects: use relative paths starting with `/`
  - Example: `/new-page` or `/blog/new-article`
- For external redirects: use the full URL including protocol
  - Example: `https://example.com/page`

**Examples:**

| From Path | To Path | Description |
|-----------|---------|-------------|
| `/old-page` | `/new-page` | Internal redirect |
| `/blog/article` | `/news/article` | Internal redirect to different section |
| `/external` | `https://example.com` | External redirect |

### Status Codes

Choose the appropriate HTTP status code for your redirect:

| Status Code | Name | Description | Use Case |
|-------------|------|-------------|----------|
| **301** | Permanent Redirect | The resource has been permanently moved to a new location. Search engines will transfer the SEO value to the new URL. | Use when a page has permanently moved and you want to preserve SEO rankings. |
| **302** | Temporary Redirect | The resource is temporarily at a different location. Search engines keep the original URL indexed. | Use for temporary changes, A/B testing, or maintenance pages. |
| **303** | See Other | The response to the request can be found at another URL using a GET request. | Use after POST/PUT requests to redirect to a confirmation page. |
| **307** | Temporary Redirect (Preserve Method) | Like 302, but guarantees the request method won't change. | Use when you need to preserve POST/PUT methods in the redirect. |
| **308** | Permanent Redirect (Preserve Method) | Like 301, but guarantees the request method won't change. | Use for permanent redirects where the request method must be preserved. |

:::tip Choosing the Right Status Code
- **Most common:** Use **301** for permanent redirects and **302** for temporary ones
- **SEO impact:** 301 redirects transfer ~90-99% of link equity to the new URL
- **Caching:** 301 redirects are cached by browsers, 302 redirects are not
:::

:::caution
Be careful with 301 redirects as they are heavily cached by browsers. If you need to change a 301 redirect, users may not see the change immediately due to browser caching.
:::

## Access
After you've followed the steps above you can now access your sitemap through the REST api of strapi. It will be available at:

http://localhost:1337/api/webtools/redirects.

:::caution
You might have to setup permissions for this endpoint to be accessible.
:::
