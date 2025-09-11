---
sidebar_label: 'Installation'
displayed_sidebar: webtoolsLinksSidebar
slug: /addons/links/installation
---

# ⏳ Installation

:::prerequisites
Complete installation requirements are the exact same as for Strapi itself and can be found in the Strapi documentation.

**Additional Requirements:**
- **Node.js**: Version 18 or higher
- **Strapi**: Version 5.x
- **Webtools**: Version 1.x
:::

:::caution
This addon is part of the premium package of Webtools. You'll have to purchase a license key to download and use this package. Once you have your license key you can run the following command to setup your license in your project:

```
npx webtools-cli setup-license
```

To purchase a license, please visit the [PluginPal website](https://www.pluginpal.io/plugin/webtools).
:::

### Installation

After you've setup your license you can install the addon like so:

<Tabs groupId="yarn-npm">
  <TabItem value="yarn" label="Yarn">
    ```
    yarn add @pluginpal/webtools-addon-links
    ```
  </TabItem>
  <TabItem value="npm" label="NPM">
    ```
    npm install @pluginpal/webtools-addon-links --save
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
