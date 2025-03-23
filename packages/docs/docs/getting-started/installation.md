---
sidebar_label: 'Installation'
displayed_sidebar: webtoolsSidebar
slug: /
---

# ⏳ Installation

:::prerequisites
Complete installation requirements are the exact same as for Strapi itself and can be found in the Strapi documentation.
:::

### Supported versions

- Strapi v5

### Installation

Install the plugin in your Strapi project.

<Tabs groupId="yarn-npm">
  <TabItem value="yarn" label="Yarn">
    ```
    yarn add strapi-plugin-webtools
    ```
  </TabItem>
  <TabItem value="npm" label="NPM">
    ```
    npm install strapi-plugin-webtools --save
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

### Enabling

After successful installation you now need to enable Webtools for the content-types of your choice. Read more about how to do that in the [usage documentation](/webtools/usage).
