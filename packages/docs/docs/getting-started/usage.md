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

The CLI presents a selector where you can:
- Choose content types to enable Webtools for
- Optionally select addons to install (e.g. Sitemap)

Keyboard shortcuts: Space (toggle), a (all), i (invert), Enter (confirm).

### Manually

:::tip
Enabling Webtools will write the following to your schema file. You can also add this change manually to enable Webtools without using the content-type builder, or the CLI.

```md title="schema.json"
pluginOptions: {
  webtools: {
    enabled: true,
  },
},
```
:::

## Workflow

After enabling Webtools for your content types:

1. **Create URL patterns** - See [URL pattern](/url-pattern) documentation
2. **Bulk generate URLs** - Go to Webtools > All URLs to create aliases for existing content  
3. **Generate sitemap** - Configure and generate XML sitemap with your URLs

:::tip Pattern discovery
Type `[` in the pattern field to see available fields from your content type.
:::

## Sitemap setup

After enabling content types and creating patterns:

1. Go to **Webtools > Sitemap > Settings**
2. Set hostname with `http://` prefix (e.g., `http://localhost:1337` for development)
3. Add URL bundles for each content type you want in the sitemap
4. Configure change frequency and priority per bundle
5. Click **Generate sitemap**

:::warning Hostname format
Always include the protocol (`http://` or `https://`) in your hostname setting to avoid sitemap generation errors.
:::
