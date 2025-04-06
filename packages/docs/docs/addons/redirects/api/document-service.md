---
sidebar_label: 'Document service'
displayed_sidebar: webtoolsRedirectsSidebar
slug: /addons/redirects/api/document-service
---

# Document Service

Redirects can also be created programmatically using the document service of Strapi.

Example:

```ts
await strapi.documents('plugin::webtools-addon-redirects.redirect').create({
  data: {
    from: '/old-url',
    to: '/new-url',
    status_code: 307,
  },
});
```
