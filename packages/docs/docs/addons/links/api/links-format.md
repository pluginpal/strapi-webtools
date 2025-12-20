---
sidebar_label: 'Links format'
displayed_sidebar: webtoolsLinksSidebar
slug: /addons/links/api/links-format
---

# Links format

This plugin stores the internal links in a specific format. That format looks something like this:

```
wt-link://api::page.page/sp8bzbkn21pjy3m9wsf97dio?locale=en
```

This makes it possible to fetch the page, and ultimately the URL alias of the document that you have linked to.

The plugin provides a [rewrite middleware](/addons/links/api/rewrite-middleware) so that this link format will be rewritten to the actual URL at request time.

