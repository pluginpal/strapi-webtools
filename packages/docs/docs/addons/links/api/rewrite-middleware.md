---
sidebar_label: 'Rewrite middleware'
displayed_sidebar: webtoolsLinksSidebar
slug: /addons/links/api/rewrite-middleware
---

# Rewrite middleware

The plugin provides a rewrite middleware so that the [raw link format](/addons/links/api/links-format) will be rewritten to the actual URL at request time.

## Opt out

You might want to opt-out of the rewrite functionality to get the raw Webtools link value. You can do that by providing a URL param to your request.

<ApiCall>

<Request>

`GET http://localhost:1337/api/home-page?skipLinkRewrite=true`

</Request>

<Response>
```
{
  "data": {
    "id": 1,
    "documentId": "yk4tcq7bd51cdqt7qk9gu5v6",
    "link": "wt-link://api::page.page/sp8bzbkn21pjy3m9wsf97dio?locale=en",
    "createdAt": "2025-09-07T13:03:00.877Z",
    "updatedAt": "2025-09-07T13:03:00.877Z",
    "publishedAt": "2025-09-07T13:03:00.873Z"
  },
  "meta": {}
}
```
</Response>

</ApiCall>

## GraphQL

GraphQL requests are not rewritten automatically because it doesn't use the Document Service of Strapi. To rewrite the links in your GraphQL requests you can manually add a middleware provided by the plugin.

```md title="config/middlewares.ts"
export default [
  // ...
  'plugin::webtools-addon-links.graphql',
  // ...
]
```

