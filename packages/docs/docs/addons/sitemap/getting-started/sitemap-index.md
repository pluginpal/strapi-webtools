---
sidebar_label: 'Sitemap index'
displayed_sidebar: webtoolsSitemapSidebar
slug: /addons/sitemap/sitemap-index
---

# 🔗 Sitemap index

Large sitemaps (larger then 45.000 urls) will automatically be split up in to seperate sitemaps. <br />
A sitemap index will be created that links to all the different sitemap chunks. <br />
That sitemap index will be accessible on the default `/api/sitemap/index.xml` location.

It is required to set the `url` in the `./config/server.js` file in your Strapi installation.
That will be used to create the links to the different chunks.

You can alter the 45.000 magic number through plugin config.
