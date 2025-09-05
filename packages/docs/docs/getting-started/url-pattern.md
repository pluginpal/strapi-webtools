---
sidebar_label: 'URL pattern'
displayed_sidebar: webtoolsSidebar
slug: /url-pattern
---

# 🔌 URL pattern
To create dynamic URLs this plugin uses **URL patterns**. The URL pattern will be used to generate unique URLs based on the data available.

You can add URL patterns in the settings section of the plugin.

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

<img src="/webtools/img/assets/url-pattern.png" alt="URL pattern" />
