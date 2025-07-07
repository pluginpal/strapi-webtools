---
sidebar_label: 'Unique alias per locale'
displayed_sidebar: webtoolsSidebar
slug: /configuration/unique-per-locale
---

# Unique URL alias per locale

By default Webtools generates URL aliases that are unique within entire Strapi database.
When you use a separate domain name per locale this prevents reusing the same alias between locales.

Set `unique_per_locale` to `true` to allow Webtools to generate the same alias as long as the locale is different.

| Name | Details             |
| ---- |---------------------|
| Key | `unique_per_locale` |
| Required | false               |
| Type | boolean             |
| Default | false               |
