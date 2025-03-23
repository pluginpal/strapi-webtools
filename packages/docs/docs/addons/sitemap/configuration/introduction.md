---
sidebar_label: 'Introduction'
displayed_sidebar: webtoolsSitemapSidebar
slug: /addons/sitemap/configuration
---

# 🔧 Configuration
The configuration of the plugin can be overridden in the `config/plugins.js` file. 
In the example below you can see how, and also what the default settings are.

```md title="config/plugins.js"
module.exports = ({ env }) => ({
  'webtools-addon-sitemap': {
    enabled: true,
    config: {
      cron: '0 0 0 * * *',
      limit: 45000,
      xsl: true,
      autoGenerate: false,
    },
  },
});
```
