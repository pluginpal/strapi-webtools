---
"strapi-plugin-webtools": patch
---

Fix async handling in router controller

Add await keyword before transformResponse call to properly handle the Promise returned by the method. This resolves the issue where the router endpoint returns empty objects instead of the expected content.