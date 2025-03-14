---
sidebar_label: 'Limit'
displayed_sidebar: webtoolsSitemapSidebar
slug: /addons/sitemap/configuration/limit
---

# Limit

When creating large sitemaps (50.000+ URLs) you might want to split the sitemap in to chunks that you bring together in a sitemap index.

The limit is there to specify the maximum amount of URL a single sitemap may hold. If you try to add more URLs to a single sitemap.xml it will automatically be split up in to chunks which are brought together in a single sitemap index.

###### Key: `limit `

> `required:` NO | `type:` int | `default:` 45000
