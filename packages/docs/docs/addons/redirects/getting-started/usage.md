---
sidebar_label: 'Usage'
displayed_sidebar: webtoolsRedirectsSidebar
slug: /addons/redirects/usage
---

# 💡 Usage
This plugin offers the ability to manage your redirects in the Strapi admin panel. You can create, update and delete as many redirects as you need and fetch them using the REST API.

<img src="/webtools/img/assets/addons/redirects/admin.png" alt="URL bundle" />

## Next.js example implementation

For the redirects to take effect you need to configure them in your front-end. For example Next.js offers te ability configure redirects in the `next.config.js`.

You could fetch your redirects like this:

```ts
const redirects = () => {
  return fetch('http://localhost:1337/api/webtools/redirects')
    .then(res => res.json())
    .then(response => {
      // Use redirects however you need to
    });
};

module.exports = redirects;
```

And include them in the  `next.config.js` like this:

```ts
const getRedirects = require('./redirects');

module.exports = {
  // Other configurations...
  redirects: () => getRedirects(),
};
```
