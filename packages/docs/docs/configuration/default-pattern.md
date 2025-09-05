---
sidebar_label: 'Default pattern'
displayed_sidebar: webtoolsSidebar
slug: /configuration/default-pattern
---

# Default pattern

Webtools allows you to create custom URL patterns, specifically tweaked to your requirements. The default pattern acts as a fallback, for when you have not set an URL pattern for a specific content type. This fallback will then be used to generate the URLs for this content type.

For a quick conceptual overview, see [URL pattern](/webtools/url-pattern). For path formatting rules, see [Slugify](/webtools/configuration/slugify).

| Name | Details |
| ---- | ------- |
| Key | `default_pattern` |
| Required | false |
| Type | string |
| Default | `/[pluralName]/[documentId]` |
