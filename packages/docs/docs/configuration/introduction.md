---
sidebar_label: 'Introduction'
displayed_sidebar: webtoolsSidebar
slug: /configuration
---

# 🔧 Configuration
The plugin works with default settings out of the box. You can optionally override settings in your `config/plugins.js` (or `config/plugins.ts`) file. 

The example below shows all available configuration options with their default values:

```md title="config/plugins.js"
import deburr from 'lodash/deburr';
import toLower from 'lodash/toLower';
import kebabCase from 'lodash/kebabCase';

export default ({ env }) => ({
  webtools: {
    enabled: true,
    config: {
      default_pattern: "/[pluralName]/[documentId]",
      website_url: null,
      unique_per_locale: false,
      slugify: (fieldValue) => kebabCase(deburr(toLower(fieldValue))),
    },
  },
});
```

## Configuration options overview

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `default_pattern` | string | `/[pluralName]/[documentId]` | Fallback pattern when no specific pattern is set for a content type |
| `website_url` | string | `null` | Base URL for permalink generation in admin UI |
| `slugify` | function | `kebabCase(deburr(toLower()))` | Transform field values into URL-safe slugs (converts "My Title" to "my-title") |
| `unique_per_locale` | boolean | `false` | Allow same URL alias across different locales |

## URL bundle settings (sitemap)

When configuring sitemap URL bundles, each bundle supports:

| Setting | Options | Description |
|---------|---------|-------------|
| **Change frequency** | `hourly`, `daily`, `weekly`, `monthly`, `yearly` | How often search engines should crawl these URLs |
| **Priority** | `0.1` - `1.0` | Relative importance of URLs in this bundle |
| **Default language URL type** | `Disabled`, `Default language URL of bundles`, `Other` | How default locale appears in URLs |

:::tip Pattern tokens
Available tokens for URL patterns: `[documentId]`, `[locale]`, `[pluralName]`, and any field from your content type. Type `[` in the pattern field to see all available options.
:::
