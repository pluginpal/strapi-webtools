---
sidebar_label: 'Usage'
displayed_sidebar: webtoolsSidebar
slug: /usage
---

# 💡 Usage
This plugin is specifically designed for usage in Strapi managed websites. Hence the name **web**tools. The plugin offers a variety of functionalities which you'll have to manually enable.

## Enabling Webtools

Once you enable Webtools for a content-type each entry of that type will get it's own unique URL alias. That alias can be used as the slug of your page in the front-end. To enable Webtools, you have a few options.

### Using the Admin Interface

See below a screenshot of how to enable webtools for a given collection type.

<img src="/webtools/img/assets/enable-webtools.png" alt="Enable webtools" />

### Using the CLI

You can also use the Webtools CLI to enable Webtools for your content types. This is especially useful when you want to enable Webtools for multiple content types at once.

```bash
npx webtools-cli enable
```

### Manually

:::tip
Enabling Webtools will write the following to your schema file. You can also add this change manually to enable Webtools without using the content-type builder, or the CLI.

```md title="schema.json"
pluginOptions: {
  webtools: {
    enabled: true,
  },
},
:::
