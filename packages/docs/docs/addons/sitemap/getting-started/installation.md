---
sidebar_label: 'Installation'
displayed_sidebar: webtoolsSitemapSidebar
slug: /addons/sitemap/installation
---

# ⏳ Installation

:::prerequisites
Complete installation requirements are the exact same as for Strapi itself and can be found in the Strapi documentation.

**Supported Strapi versions:**

Strapi v5 use `webtools-addon-sitemap@^1`

Strapi v4 use `@pluginpal/webtools-addon-sitemap@^1.0.0-beta`

:::

Install the plugin in your Strapi project.

<Tabs groupId="yarn-npm">
  <TabItem value="yarn" label="Yarn">
    ```
    yarn add webtools-addon-sitemap
    ```
  </TabItem>
  <TabItem value="npm" label="NPM">
    ```
    npm install webtools-addon-sitemap --save
    ```
  </TabItem>
</Tabs>

After successful installation you have to rebuild the admin UI so it'll include this plugin. To rebuild and restart Strapi run:

<Tabs groupId="yarn-npm">
  <TabItem value="yarn" label="Yarn">
    ```
    yarn build
    yarn develop
    ```
  </TabItem>
  <TabItem value="npm" label="NPM">
    ```
    npm run build
    npm run develop
    ```
  </TabItem>
</Tabs>

Enjoy 🎉
