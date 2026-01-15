---
sidebar_label: 'Router use controllers'
displayed_sidebar: webtoolsSidebar
slug: /configuration/router-use-controllers
---

# Router use controllers

The [Webtools Router](/api/rest#router) endpoint has an option to make use of the core controllers of your content types. That means that you can extend your controllers as you're used to and the result will be returned by the Router endpoint by of Webtools.

:::note
To make use of this feature you will need to enable the `findOne` permission of the specific content type.
:::

In the future this might become the default behavior but that will cause a breaking change in the current behavior.

| Name | Details |
| ---- | ------- |
| Key | `router_use_controllers` |
| Required | false |
| Type | boolean |
| Default | false |
