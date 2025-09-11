---
sidebar_label: 'Link component'
displayed_sidebar: webtoolsLinksSidebar
slug: /addons/links/link-component
---

# Link component
This addon provides a custom field for you to create internal linking. It's good to note that the custom field only provides you a way to set the URL value of a link. We recommend you to create a Component in your Strapi application which combines all the attributes needed to create a link. This can also include the link text and other possible attributes like target.

This component can then be used to as a reference field anywhere you need it.

<img src="/webtools/img/assets/addons/links/link-component.png" alt="Link component" />

The schema of this link component can look something like this:

```
{
  "collectionName": "components_core_links",
  "info": {
    "displayName": "Link"
  },
  "options": {},
  "attributes": {
    "Text": {
      "type": "string"
      "required": true,
    },
    "Link": {
      "type": "customField",
      "required": true,
      "customField": "plugin::webtools-addon-links.link"
    }
  }
}
```
