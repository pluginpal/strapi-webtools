---
sidebar_label: 'Multilingual'
displayed_sidebar: webtoolsSitemapSidebar
slug: /addons/sitemap/multilingual
---

# 🌍 Multilingual

When adding a URL bundle of a type which has localizations enabled you will be presented with a language dropdown in the settings form. You can now set a different URL pattern for each language.

For each localization of a page the `<url>` in the sitemap XML will get an extra attribute:

- `<xhtml:link rel="alternate">`

This implementation is based on [Google's guidelines](https://developers.google.com/search/docs/advanced/crawling/localized-versions) on localized sitemaps.
