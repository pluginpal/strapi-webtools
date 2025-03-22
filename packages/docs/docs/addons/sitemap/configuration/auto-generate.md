---
sidebar_label: 'Auto generate'
displayed_sidebar: webtoolsSitemapSidebar
slug: /addons/sitemap/configuration/auto-generate
---

# Auto generate

Alternatively to using cron to regenerate your sitemap, this plugin offers an automatic generation feature that will generate the sitemap as a document service middleware. On `create`, `update` and `delete` this plugin will do a full sitemap regeneration. This way your sitemap will always be up-to-date when making content changes.

If you have a large sitemap the regeneration becomes an expensive task. Because of that this setting is disabled by default and it is not recommended to enable it for sitemaps with more than 1000 links.

Also the search engines don't even crawl your sitemap that often, so generating it once a day through cron should be suffecient.

###### Key: `autoGenerate `

> `required:` NO | `type:` bool | `default:` false
