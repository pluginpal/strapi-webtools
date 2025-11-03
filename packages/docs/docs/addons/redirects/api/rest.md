---
sidebar_label: 'Rest API'
displayed_sidebar: webtoolsRedirectsSidebar
slug: /addons/redirects/api/rest
---

# REST API

## Overview

The plugin exposes a REST API endpoint that you can use to implement the redirects in your front-end of choice.

### Authentication

Use Public role or API Tokens as per Strapi defaults.

### Permissions

:::danger Permissions Required
Before you can use the redirects endpoint publicly, you need to configure the **find** permission. Without proper permissions, you'll get a **403 Forbidden** error.

**Quick Setup in Settings > Users & Permissions > Roles > Public:**
- `webtools-addon-redirects.redirect.find`

For detailed permission configuration including admin panel access, see the [Permissions documentation](/webtools/addons/redirects/permissions).
:::

<ApiCall>

<Request>

`GET http://localhost:1337/api/webtools/redirects`

</Request>

<Response>
```
{
  "data": [
    {
      "id": 1,
      "documentId": "yk4tcq7bd51cdqt7qk9gu5v6",
      "from": "/old-url",
      "to": "/new-url",
      "status_code": 307,
      "createdAt": "2025-09-07T13:03:00.877Z",
      "updatedAt": "2025-09-07T13:03:00.877Z",
      "publishedAt": "2025-09-07T13:03:00.873Z"
    },
    {
      "id": 2,
      "documentId": "zl1ec15d8uuph7250epetorg",
      "from": "/campaign",
      "to": "/my-blog-post",
      "status_code": 302,
      "createdAt": "2025-09-07T13:03:22.444Z",
      "updatedAt": "2025-09-07T13:03:22.444Z",
      "publishedAt": "2025-09-07T13:03:22.442Z"
    },
    {
      "id": 3,
      "documentId": "ps5hqbk3idsanua30w8udvxe",
      "from": "/blogs",
      "to": "/articles",
      "status_code": 307,
      "createdAt": "2025-09-07T13:03:41.516Z",
      "updatedAt": "2025-09-07T13:03:41.516Z",
      "publishedAt": "2025-09-07T13:03:41.515Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 3
    }
  }
}
```
</Response>

</ApiCall>

