---
sidebar_label: 'Use Cases'
displayed_sidebar: webtoolsSidebar
slug: /use-cases
---

# 💼 Use Cases

This section describes three real-world scenarios where Strapi Webtools significantly improves content workflow and management.

## 1. Corporate Website (Private Sector)

A marketing website for a product line:

- **SEO-friendly URLs** automatically generated (e.g., `/products/super-widget-2025`).
- **Auto-generated slugs** based on the title, without manual work.
- **Front-end routing** via:
  ```bash
  GET /api/webtools/router?path=/products/super-widget-2025
  ```
- **Single source of truth** for URLs, ideal for multilingual content.

**Key benefits:**
- Unique, consistent URL aliases
- Automatic slug generation
- Easy integration with Next.js/Gatsby
- Improved SEO and less manual work

## 2. Government Portal (Public Sector)

A municipal website with news, events, and information in multiple languages:

- **Multilingual URL structure** (e.g., `/nl/nieuws/stadsfestival-2025` & `/en/news/city-festival-2025`).
- **Unique registry** prevents duplicate paths.
- **User-friendly interface** for non-technical editors.

**Key benefits:**
- Fully automated URL registry
- Integration with Strapi locale settings
- No overlapping or duplicate URLs

## 3. NGO Blog (Non-profit)

An NGO organization blogging about campaigns and events:

- **Consistent paths** like `/blog/charity-run-2025`.
- **URL alias endpoint** for sitemap or index pages:
  ```bash
  GET /api/webtools/url-alias
  ```
- **Internal link references** in rich-text always point to the correct alias.

**Key benefits:**
- Human-friendly, uniform URLs
- Overview of all routes for static builds or sitemaps
- Suitable for both dynamic and static front-ends
