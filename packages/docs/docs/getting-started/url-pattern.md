---
sidebar_label: 'URL pattern'
displayed_sidebar: webtoolsSidebar
slug: /url-pattern
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# 🔌 URL pattern
To create dynamic URLs this plugin uses **URL patterns**. The URL pattern will be used to generate unique URLs based on the data available.

You can add URL patterns in the settings section of the plugin. For configuration details and fallbacks, see [Default pattern](/webtools/configuration/default-pattern) and [Slugify](/webtools/configuration/slugify).

<ThemedImage
  alt="URL patterns overview"
  sources={{
    light: useBaseUrl('/webtools/img/assets/url_patterns-dark.png'),
    dark: useBaseUrl('/webtools/img/assets/url_patterns-dark.png'),
  }}
/>

```
/pages/[my-title-field]
```

Fields can be injected in the pattern by escaping them with `[]`.

:::tip Pattern discovery
Type `[` in the pattern field to see all available fields from your content type.
:::

The following field types are allowed in a pattern:

- `documentId`
- `uid`
- `string`

See below a screenshot of the URL pattern creation form in Strapi.

<ThemedImage
  alt="Add new pattern with field suggestions"
  sources={{
    light: useBaseUrl('/webtools/img/assets/add_new_pattern-dark.png'),
    dark: useBaseUrl('/webtools/img/assets/add_new_pattern-dark.png'),
  }}
/>
