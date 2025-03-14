---
sidebar_label: 'Default language URL type'
displayed_sidebar: webtoolsSitemapSidebar
slug: /addons/sitemap/settings/default-language-url-type
---

# Default language URL (x-default)

This setting will add an additionnal `<link />` tag into each sitemap urls bundles with value `hreflang="x-default"` and the path of your choice. The hreflang x-default value is used to specify the language and region neutral URL for a piece of content when the site doesn't support the user's language and region. For example, if a page has hreflang annotations for English and Spanish versions of a page along with an x-default value pointing to the English version, French speaking users are sent to the English version of the page due to the x-default annotation. The x-default page can be a language and country selector page, the page where you redirect users when you have no content for their region, or just the version of the content that you consider default. 

###### Key: `defaultLanguageUrlType`

> `required:` NO | `type:` string | `default:` ''
