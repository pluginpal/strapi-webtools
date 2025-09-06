---
sidebar_label: 'Introduction'
displayed_sidebar: webtoolsLinkfieldSidebar
slug: /addons/linkfield
---

# 🔧 Configuration
The configuration of the plugin can be overridden in the `config/plugins.js` file.
In the example below you can see how, and also what the default settings are.

```md title="config/plugins.js"
module.exports = ({ env }) => ({
  'webtools-linkfield': {
    enabled: true,
    config: {
      addons: [
      '@pluginpal/webtools-addon-linkfield'
      ],
    },
  },
});
```
