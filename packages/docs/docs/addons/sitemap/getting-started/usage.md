---
sidebar_label: 'Usage'
displayed_sidebar: webtoolsSitemapSidebar
slug: /addons/sitemap/usage
---

# 💡 Usage
With this plugin you have full control over which URLs you add to your sitemap XML. Go to the admin section of the plugin and start adding URLs. Here you will find that there are two ways to add URLs to the sitemap. With **URL bundles** and **Custom URLs**.

## URL bundles
:::caution
For a content type to be added to the sitemap through URL bundles, it needs to have Webtools enabled. Read about how to enable Webtools on it's [documentation](/webtools/usage).
:::

An URL bundle is a set of URLs grouped by type. If you set up an URL bundle, all pages of that content type will end up in the sitemap.

URLs coming from a URL bundle will get the following XML attributes:

- `<loc>`
- `<lastmod>`
- `<priority>`
- `<changefreq>`

<img src="/webtools/img/assets/addons/sitemap/URL-bundle.png" alt="URL bundle" />

## Custom URLs
A custom URL is meant to add URLs to the sitemap which are not managed in Strapi. It might be that you have custom route like `/account` that is hardcoded in your front-end. If you'd want to add such a route (URL) to the sitemap you can add it as a custom URL.

Custom URLs will get the following XML attributes:

- `<loc>`
- `<priority>`
- `<changefreq>`

<img src="/webtools/img/assets/addons/sitemap/custom-url.png" alt="Custom URL" />

## Generate
After you've successfully configured your sitemap it's time to generate it. You can generate the sitemap manually by clicking the 'Generate sitemap' button in the admin panel.

By default your sitemap will be generated periodically through cron. Optionally you can also configure the plugin to update the sitemap every time your content gets updated.

You can set that up using the [plugins configuration](/webtools/addons/sitemap/configuration).

## Access
After you've followed the steps above you can now access your sitemap through the REST api of strapi. It will be available at:

https://localhost:1337/api/sitemap/index.xml.
