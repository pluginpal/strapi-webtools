---
sidebar_label: 'Custom field'
displayed_sidebar: webtoolsLinksSidebar
slug: /addons/links/custom-field
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Custom field
This addon introduces a new custom field which you can add to your content types. This field can be used in your content types to accommodate internal linking from one page to another.

<ThemedImage
  alt="Link custom field"
  sources={{
    light: useBaseUrl('/webtools/img/assets/addons/links/link-custom-field-light.png'),
    dark: useBaseUrl('/webtools/img/assets/addons/links/link-custom-field-light.png'),
  }}
/>

### This custom field will provide you three options in the advanced settings:
* Set the link to "internal" and now you can search on something like "My first blog post". The field stores a documentId reference, so the link keeps working even if the slug or URL changes.
* Set the link to "external" so you can enter a full url, e.g. https://strapi.io/
* Set the link to "Internal & external links" and have both link options as described above, this is the default value. 

<ThemedImage
  alt="Link advanced settings"
  sources={{
    light: useBaseUrl('/webtools/img/assets/addons/links/webtools-pro-link-addon-options-light.png'),
    dark: useBaseUrl('/webtools/img/assets/addons/links/webtools-pro-link-addon-options-light.png'),
  }}
/>
