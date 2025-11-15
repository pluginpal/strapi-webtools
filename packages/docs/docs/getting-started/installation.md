---
sidebar_label: 'Installation'
displayed_sidebar: webtoolsSidebar
slug: /
---

# ⏳ Installation

:::prerequisites
Complete installation requirements are the exact same as for Strapi itself and can be found in the Strapi documentation.

**Additional Requirements:**
- **Node.js**: Version 18 or higher
- **Strapi**: Version 5.x

:::

### Installation

To install the plugin run the following command in your Strapi project directory. This invokes the core Webtools CLI (webtools-cli).

```bash
npx webtools-cli install
```

:::note Package names
- **webtools-cli** - Interactive installer that sets up Webtools
- **strapi-plugin-webtools** - The actual Strapi plugin (installed by the CLI)
:::

### Command Line Interface (installer)

During installation the Webtools CLI guides you through a short wizard:
- Select content types to enable Webtools for
- Optionally select addons to install (e.g. Sitemap)

<img src="/webtools/img/assets/install/cli-select-content-types.png" alt="CLI: select content types" />

<img src="/webtools/img/assets/install/cli-select-addons.png" alt="CLI: select addons to install" />

:::tip Keyboard shortcuts
In the selector you can use:

- <kbd>Space</kbd> — toggle selection
- <kbd>a</kbd> — toggle all
- <kbd>i</kbd> — invert selection
- <kbd>Enter</kbd> — proceed
:::

### Enabling

The installer wizard will ask you which content types you want to enable. Select the content types that you consider to be web pages in your website front-end. Each content type you select will get its own unique URL which can be used on the front-end. Read more about enabling content types in the [usage documentation](/webtools/usage).

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

### Post-install checklist

- Enable Webtools per content type → see [Usage](/webtools/usage)
- Review API Permissions → see [API Permissions](/webtools/api-permissions)
- Review Admin Panel Permissions → see [Admin Permissions](/webtools/admin-permissions)

## Updating Webtools

### Update to latest version

To update Webtools to the latest version, use your package manager:

<Tabs groupId="yarn-npm">
  <TabItem value="yarn" label="Yarn">
    ```
    yarn upgrade strapi-plugin-webtools
    ```
  </TabItem>
  <TabItem value="npm" label="NPM">
    ```
    npm update strapi-plugin-webtools
    ```
  </TabItem>
</Tabs>

After updating, rebuild the admin UI:

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

:::tip Enable additional content types
To enable Webtools for additional content types after installation, see the [Usage documentation](/webtools/usage#enabling-webtools).
:::
