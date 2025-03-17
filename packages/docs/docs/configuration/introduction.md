---
sidebar_label: 'Introduction'
displayed_sidebar: webtoolsSidebar
slug: /configuration
---

# 🔧 Configuration
The settings of the plugin can be overridden in the `config/plugins.js` file. 
In the example below you can see how, and also what the default settings are.

```md title="config/plugins.js"
import deburr from 'lodash/deburr';
import toLower from 'lodash/toLower';
import kebabCase from 'lodash/kebabCase';

export default ({ env }) => ({
  webtools: {
    enabled: true,
    config: {
      default_pattern: "/[pluralName]/[id]",
      website_url: null,
      slugify: (fieldValue) => kebabCase(deburr(toLower(fieldValue))),
    },
  },
});
```
