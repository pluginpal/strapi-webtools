---
sidebar_label: 'Usage'
displayed_sidebar: webtoolsSidebar
slug: /usage
---

# 💡 Usage
This plugin is specifically designed for usage in Strapi managed websites. Hence the name **web**tools. The plugin offers a variety of functionalities which you'll have to manually enable in the admin interface.

See below a screenshot of how to enable webtools for a given collection type.

<img src="/webtools/img/assets/enable-webtools.png" alt="Enable webtools" />

<br />
<br />  

:::tip
Enabling Webtools will write the following to your schema file. You can also add this change manually to enable Webtools without using the content-type builder.

```md title="schema.json"
pluginOptions: {
  webtools: {
    enabled: true,
  },
},
:::
