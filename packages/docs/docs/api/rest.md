---
sidebar_label: 'Rest API'
displayed_sidebar: webtoolsSidebar
slug: /api/rest
---

# REST API

The plugin exposes a couple of REST API endpoints that you can use to implement Webtools in your front-end of choice.

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
    "attributes": {
      "title": "Robust Strapi plugins for your project",
      "createdAt": "2023-11-28T21:06:51.727Z",
      "updatedAt": "2024-08-10T09:19:43.568Z",
      "publishedAt": "2023-12-10T12:54:15.699Z",
      "locale": "en",
      "body": "Try our open source plugins to enhance your Strapi project for free! For custom solutions please contact our team.",
      "contentType": "api::home.home"
    }
  },
  "meta": {

  }
}

```

</Response>

</ApiCall>


## URL alias findMany

This endpoint is just a native findMany endpoint exposed to query multiple URL aliases. This can be handy if you want to get a list of all the URLs in your website to build your (static) front-end.

As it's a native findMany endpoint you can use all the parameters you're used to like `populate`, `filters` and `fields`.

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
      "attributes": {
        "url_path": "/articles",
        "generated": true,
        "contenttype": "api::page.page",
        "createdAt": "2024-08-10T09:19:43.348Z",
        "updatedAt": "2024-08-10T09:19:44.581Z",
        "locale": "en"
      }
    },
    {
      "id": 14,
      "attributes": {
        "url_path": "/plugins",
        "generated": true,
        "contenttype": "api::page.page",
        "createdAt": "2024-08-10T09:19:43.808Z",
        "updatedAt": "2024-08-10T09:19:44.611Z",
        "locale": "en"
      }
    },
    {
      "id": 18,
      "attributes": {
        "url_path": "/privacy-policy",
        "generated": null,
        "contenttype": "api::page.page",
        "createdAt": "2024-09-01T12:55:04.863Z",
        "updatedAt": "2024-09-01T12:55:29.346Z",
        "locale": "en"
      }
    },
    {
      "id": 21,
      "attributes": {
        "url_path": "/terms-and-conditions",
        "generated": null,
        "contenttype": "api::page.page",
        "createdAt": "2024-09-01T13:13:14.364Z",
        "updatedAt": "2024-09-01T13:13:30.147Z",
        "locale": "en"
      }
    },
    {
      "id": 11,
      "attributes": {
        "url_path": "/",
        "generated": null,
        "contenttype": "api::home.home",
        "createdAt": "2024-08-10T09:19:43.351Z",
        "updatedAt": "2024-09-01T13:44:57.434Z",
        "locale": "en"
      }
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
