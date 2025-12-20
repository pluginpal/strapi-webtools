---
sidebar_label: 'Introduction'
displayed_sidebar: webtoolsLinksSidebar
slug: /addons/links/configuration
---

# 🔧 Configuration
The configuration of the plugin can be overridden in the `config/plugins.js` file. 
In the example below you can see how, and also what the default settings are.

```md title="config/plugins.js"
module.exports = ({ env }) => ({
  'webtools-addon-links': {
    enabled: true,
    config: {
      custom_links: [],
    },
  },
});
```
