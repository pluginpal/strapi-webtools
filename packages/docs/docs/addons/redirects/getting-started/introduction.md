---
sidebar_label: 'Introduction'
displayed_sidebar: webtoolsRedirectsSidebar
slug: /addons/redirects
---

# Webtools Redirects addon

This plugin offers the ability to configure **server-side redirects**. It integrates with Strapi Webtools to automatically generate redirects whenever the URL alias of a page changes.

:::note
This plugin acts as an extension of the core `strapi-plugin-webtools`. Please install and configure that before proceeding.
:::

## ✨ Features

- **Automatic creation** - Automatic redirect creation when your URL changes ([learn more](/addons/redirects/configuration/auto-generate))
- **Chain detection** - Prevents you from creating redirects that create chains ([what are chains?](/addons/redirects/usage#what-is-a-redirect-chain))
- **Loop detection** - Prevents you from creating redirects that create loops ([what are loops?](/addons/redirects/usage#what-is-a-redirect-loop))
- **Custom redirects** - Create custom redirects, separate from Webtools pages
- **API endpoint** - Fetch and use the redirects in your front-end ([REST API docs](/addons/redirects/api/rest))

