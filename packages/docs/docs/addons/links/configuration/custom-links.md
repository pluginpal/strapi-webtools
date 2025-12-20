---
sidebar_label: 'Custom links'
displayed_sidebar: webtoolsLinksSidebar
slug: /addons/links/configuration/custom-links
---

# Custom links

By default the links addon only allows to create links to pages that have Webtools enabled. If you want to allow a content type to be selected by the links addon that does not have Webtools enabled you can use this configuration array. This might be useful if you want to define a content type that stores all the external links that can be linked to.

```md title="config/plugins.ts"
export default () => {
  'webtools-addon-links': {
    enabled: true,
    config: {
      custom_links: [{
        content_type: 'api::external-link.external-link',
        resolver: (externalLink) => externalLink.external_link,
      }],
    }
  }
}
```

###### Key: `custom_links`

> `required:` NO | `type:` array | `default:` []
