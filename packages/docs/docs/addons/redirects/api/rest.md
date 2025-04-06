---
sidebar_label: 'Rest API'
displayed_sidebar: webtoolsRedirectsSidebar
slug: /addons/redirects/api/rest
---

# REST API

The plugin exposes a REST API endpoint that you can use to implement redirects in your front-end of choice. This endpoint is essentially a native `find` request and thus behaves the same. Allowing for filtering and fields selection.

<ApiCall>

<Request>

`GET http://localhost:1337/api/webtools/redirects`

</Request>

<Response>

```json
{
  "data": [
    {
      "id": 10,
      "documentId": "ke1s1aroaexv8jt03iuxn81g",
      "from": "/old-url",
      "to": "/new-url",
      "status_code": 307,
      "createdAt": "2025-03-09T16:45:24.886Z",
      "updatedAt": "2025-03-13T20:38:43.112Z",
    },
    {
      "id": 14,
      "documentId": "f4x8aamrfaec0t5oea408n34",
      "from": "/very-old-url",
      "from": "/new-url",
      "generated": 301,
      "createdAt": "2025-03-09T16:45:24.886Z",
      "updatedAt": "2025-03-13T20:38:43.112Z",
    },
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 2
    }
  }
}

```

</Response>

</ApiCall>
