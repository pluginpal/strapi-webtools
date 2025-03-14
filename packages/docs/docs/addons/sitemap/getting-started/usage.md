---
sidebar_label: 'Usage'
displayed_sidebar: webtoolsSitemapSidebar
slug: /addons/sitemap/usage
---

# 💡 Usage
With this plugin you have full control over which URLs you add to your sitemap XML. Go to the admin section of the plugin and start adding URLs. Here you will find that there are two ways to add URLs to the sitemap. With **URL bundles** and **Custom URLs**.

## URL bundles
A URL bundle is a set of URLs grouped by type. If you set up an URL bundle, all pages of that content type will end up in the sitemap.

URLs coming from a URL bundle will get the following XML attributes:

- `<loc>`
- `<lastmod>`
- `<priority>`
- `<changefreq>`

## Custom URLs
A custom URL is meant to add URLs to the sitemap which are not managed in Strapi. It might be that you have custom route like `/account` that is hardcoded in your front-end. If you'd want to add such a route (URL) to the sitemap you can add it as a custom URL.

Custom URLs will get the following XML attributes:

- `<loc>`
- `<priority>`
- `<changefreq>`
