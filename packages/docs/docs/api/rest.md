---
sidebar_label: 'Rest API'
displayed_sidebar: webtoolsSidebar
slug: /api/rest
---

# REST API

## Overview

The plugin exposes a couple of REST API endpoints that you can use to implement Webtools in your front-end of choice.

### Authentication

Use Public role or API Tokens as per Strapi defaults.

### Permissions

:::danger Permissions Required
Before you can use the router and url-alias endpoints publicly, you need to configure the **find** permissions. Without proper permissions, you'll get a **403 Forbidden** error.

**Quick Setup in Settings > Users & Permissions > Roles > Public:**
- `webtools.url-alias.find`
- `webtools.router.find`
- For each enabled content type: `[content-type].find`

See the [API Permissions](/api-permissions) guide for detailed instructions on setting up permissions, including API tokens and content-type permissions.
:::

## Router

Probably the most important endpoint of the plugin is it's router endpoint.
It can be used to query a single page, using it's URL alias as the unique identifier.

### Parameters

The endpoint takes one required paramater which is the `path` of the page. It will be used as the unique identifier of the page to execute an otherwise ordinary findOne operation.

Other than the path parameter this endpoint should behave just like a native findOne endpoint, allowing parameters like populate and fields.

<ApiCall>

<Request>

`GET http://localhost:1337/api/webtools/router?path=/about-page`

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
    "body": "Try our open source plugins to enhance your Strapi project for free! For custom solutions please contact our team.",
    "contentType": "api::home.home"
  },
  "meta": {}
}

```

</Response>

</ApiCall>


## URL alias findMany

This endpoint is just a native findMany endpoint exposed to query multiple URL aliases. This can be handy if you want to get a list of all the URLs in your website to build your (static) front-end.

As it's a native findMany endpoint you can use all the parameters you're used to like `populate`, `filters` and `fields`.

### Lookup Single URL

To find a specific URL alias, use Strapi's filter syntax:

```bash
GET http://localhost:1337/api/webtools/url-alias?filters[url_path][$eq]=/your-path
```

:::warning Filter Syntax
The query parameter `?url_path=` does not work correctly. Always use the full filter syntax: `?filters[url_path][$eq]=` to lookup specific URLs.
:::

<ApiCall>

<Request>

`GET http://localhost:1337/api/webtools/url-alias`

</Request>

<Response>

```json
{
  "data": [
    {
      "id": 10,
      "documentId": "ke1s1aroaexv8jt03iuxn81g",
      "url_path": "/articles",
      "generated": true,
      "contenttype": "api::page.page",
      "createdAt": "2025-03-09T16:45:24.886Z",
      "updatedAt": "2025-03-13T20:38:43.112Z",
      "locale": "en"
    },
    {
      "id": 14,
      "documentId": "f4x8aamrfaec0t5oea408n34",
      "url_path": "/plugins",
      "generated": true,
      "contenttype": "api::page.page",
      "createdAt": "2025-03-09T16:45:24.886Z",
      "updatedAt": "2025-03-13T20:38:43.112Z",
      "locale": "en"
    },
    {
      "id": 18,
      "documentId": "fdg21vh8i5bzbbwjm50dwk60",
      "url_path": "/privacy-policy",
      "generated": null,
      "contenttype": "api::page.page",
      "createdAt": "2025-03-09T16:45:24.886Z",
      "updatedAt": "2025-03-13T20:38:43.112Z",
      "locale": "en"
    },
    {
      "id": 21,
      "documentId": "so0mehxfna6l3o6i0aul75gr",
      "url_path": "/terms-and-conditions",
      "generated": null,
      "contenttype": "api::page.page",
      "createdAt": "2025-03-09T16:45:24.886Z",
      "updatedAt": "2025-03-13T20:38:43.112Z",
      "locale": "en"
    },
    {
      "id": 11,
      "documentId": "idrdcm7f9cn3w7iex32t2hh3",
      "url_path": "/",
      "generated": null,
      "contenttype": "api::home.home",
      "createdAt": "2025-03-09T16:45:24.886Z",
      "updatedAt": "2025-03-13T20:38:43.112Z",
      "locale": "en"
    },
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 11
    }
  }
}

```

</Response>

</ApiCall>

