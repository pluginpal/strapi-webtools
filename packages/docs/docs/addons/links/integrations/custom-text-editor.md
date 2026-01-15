---
sidebar_label: 'Custom text editor'
displayed_sidebar: webtoolsLinksSidebar
slug: /addons/links/api/open-link-picker
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Custom text editor

When you want to use dynamics links in your rich text editor you can use our default [Ckeditor integration](/addons/links/ckeditor). However the plugin also provides an API to implement the link picker model in your own editor.

```md title="Example implementation"
import { useStrapiApp } from '@strapi/strapi/admin';
// ...
const getPlugin = useStrapiApp('WebtoolsLinks', (state) => state.getPlugin);
const linksPlugin = getPlugin('webtools-addon-links');
const { openLinkPicker } = linksPlugin?.apis;
// ...
const pick = await openLinkPicker({
  linkType: 'both',
  initialHref: 'if the link exists, put the existing link here',
  initialText: 'put in the selected text here'
});
```

This will open the modal where you can select the dynamic link.

<ThemedImage
  alt="Ckeditor link modal"
  sources={{
    light: useBaseUrl('/webtools/img/assets/addons/links/ckeditor-link-modal-light.png'),
    dark: useBaseUrl('/webtools/img/assets/addons/links/ckeditor-link-modal-light.png'),
  }}
/>
