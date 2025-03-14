---
sidebar_label: 'CLI'
displayed_sidebar: webtoolsSitemapSidebar
slug: /addons/sitemap/cli
---

# 📺 CLI

This plugin comes with it's own `strapi-sitemap` CLI.
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
