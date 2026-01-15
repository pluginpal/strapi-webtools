---
sidebar_label: 'Multiple Sitemaps'
displayed_sidebar: webtoolsSitemapSidebar
slug: /addons/sitemap/expansion/multiple-sitemaps
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Multiple sitemaps

After you have setup your license and installed the additional Sitemap expansion you can now manage multiple Sitemaps from the Strapi admin panel. If you haven't do so yet, please [follow the instructions here](/addons/sitemap/expansion).

---

## Configuration

Navigate to the Sitemap settings page in your Strapi application. In your local development env you can find that on the following URL http://localhost:1337/admin/plugins/webtools/sitemap.

Here you are now able to see the different sitemaps that you have created. By default you will have a single sitemap already made with the name 'default'.

<ThemedImage
  alt="Custom URL"
  sources={{
    light: useBaseUrl('/webtools/img/assets/addons/sitemap/multiple-sitemaps.png'),
    dark: useBaseUrl('/webtools/img/assets/addons/sitemap/multiple-sitemaps.png'),
  }}
/>

---

## Access

Each sitemap can be accessed individually through the REST api. The URL to access the sitemap will be as follows:

```bash
http://localhost:1337/api/sitemap/[sitemap-name].xml
```

In the URL as shown here, you'll have to replace `[sitemap-name]` with the actual name of the sitemap that you want to access.
