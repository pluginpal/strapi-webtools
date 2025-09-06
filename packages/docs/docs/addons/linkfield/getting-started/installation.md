---
sidebar_label: 'Installation'
displayed_sidebar: webtoolsLinkfieldSidebar
slug: /addons/linkfield/installation
---

# ⏳ Installation

:::prerequisites
Complete installation requirements are the exact same as for Strapi itself and can be found in the Strapi documentation.

This guide will walk you through installing the Linkfield add-on for Webtools Pro.
:::

### Supported versions

- Strapi v5
- Strapi Webtools Pro - core plugin installed and configured
- Node.js v18 or higher

### Installation

Install the plugin in your Strapi project.

<Tabs groupId="yarn-npm">
  <TabItem value="yarn" label="Yarn">
    ```
    yarn add webtools-addon-linkfield
    ```
  </TabItem>
  <TabItem value="npm" label="NPM">
    ```
    npm install webtools-addon-linkfield --save
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
