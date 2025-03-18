---
sidebar_label: 'Slugify'
displayed_sidebar: webtoolsSidebar
slug: /configuration/slugify
---

# Slugify

This config can be used to overwrite the function that is used to slugify your URLs. The function takes a single parameter which is the path before being slugified. It expects the return value to be the slugified URL.

### Example:

```md title="config/plugins.js"
import deburr from 'lodash/deburr';
import toLower from 'lodash/toLower';
import kebabCase from 'lodash/kebabCase';

export default ({ env }) => ({
  webtools: {
    config: {
      slugify: (fieldValue) => kebabCase(deburr(toLower(fieldValue))),
    },
  },
});
```

| Name | Details |
| ---- | ------- |
| Key | `slugify` |
| Required | false |
| Type | function |
