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

To install the plugin run the following command.

```
npx webtools-cli install
```

### Enabling

The installer wizard will ask you which content-types you want to enable. Select the content types that you consider to be web-pages in your website front-end. Each content-type you select will get it's own unique URL which can be used on the front-end. Read more about enabling content-types in the [usage documentation](/webtools/usage).

### Building

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

