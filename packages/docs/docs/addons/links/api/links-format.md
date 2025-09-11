---
sidebar_label: 'Links format'
displayed_sidebar: webtoolsLinksSidebar
slug: /addons/links/api/links-format
---

# Rewrite middleware

This plugin stores the internal links in a specific format. That format looks something like this:

```
wt-link://api::page.page/sp8bzbkn21pjy3m9wsf97dio
```

This makes it possible to fetch the page, and ultimately the URL alias of the document that you have linked to.

The plugin also provides a middleware which will rewrite these link formats to the actual link when you're using the Strapi API.

