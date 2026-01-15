---
sidebar_label: 'Rest API'
displayed_sidebar: webtoolsBreadcrumbsSidebar
slug: /addons/breadcrumbs/api/rest
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# REST API

The Breadcrumbs addon for Webtools allows you to get a computed breadcrumb trail in the Strapi API response. You can populate the breadcrumbs like you would with any regular relation.

<ApiCall>

<Request>

`GET http://localhost:1337/api/home-page?populate=breadcrumbs`

</Request>

<Response>

```json
{
  "data": {
    "id": 2,
    "documentId": "ke1s1aroaexv8jt03iuxn81g",
    "title": "Robust Strapi plugins for your project",
    "createdAt": "2025-03-09T16:45:24.886Z",
    "updatedAt": "2025-03-13T20:38:43.112Z",
    "publishedAt": "2025-03-13T17:06:57.578Z",
    "locale": "en",
    "breadcrumbs": {
      "items": [
        {
          "label": "Home",
          "url": "/"
        },
        {
          "label": "Plugins overview",
          "url": "/plugins"
        },
        {
          "label": "Strapi Webtools",
          "url": "/plugins/webtools"
        }
      ]
    }
  },
  "meta": {}
}

```

</Response>

</ApiCall>

## Permissions

To fetch the breadcrumbs from the API you need to enable the 'find' permissions of the Breadcrumbs content type.

<ThemedImage
  alt="Breadcrumbs permissions"
  sources={{
    light: useBaseUrl('/webtools/img/assets/addons/breadcrumbs/breadcrumbs-permissions-light.png'),
    dark: useBaseUrl('/webtools/img/assets/addons/breadcrumbs/breadcrumbs-permissions-light.png'),
  }}
/>
