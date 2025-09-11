---
sidebar_label: 'CLI'
displayed_sidebar: webtoolsSitemapSidebar
slug: /addons/sitemap/cli
---

# 📺 CLI

This addon includes its own `strapi-sitemap` CLI. This is separate from the core Webtools CLI used during installation/enabling. For core Webtools installation and enabling content types, see the [Installation guide](/webtools/).

You can add it to your project like so:

```
"scripts": {
  // ...
  "sitemap": "strapi-sitemap"
},
```

You can now run the `generate` command like so:

<Tabs groupId="yarn-npm">
  <TabItem value="yarn" label="Yarn">
    ```
    yarn sitemap generate
    ```
  </TabItem>
  <TabItem value="npm" label="NPM">
    ```
    npm run sitemap generate
    ```
  </TabItem>
</Tabs>
