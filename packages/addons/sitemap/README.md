<div align="center">
<h1>Webtools Sitemap add-on</h1>
	
<p style="margin-top: 0;">Create a highly customizable sitemap XML in Strapi CMS.</p>

<a href="https://docs.pluginpal.io/webtools/addons/sitemap">Read the documentation</a>
	
<p>
  <a href="https://www.npmjs.org/package/webtools-addon-sitemap">
    <img src="https://img.shields.io/npm/v/webtools-addon-sitemap/latest.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.org/package/webtools-addon-sitemap">
    <img src="https://img.shields.io/npm/dm/webtools-addon-sitemap" alt="Monthly download on NPM" />
  </a>
  <a href="https://codecov.io/gh/pluginpal/strapi-webtools">
    <img src="https://img.shields.io/github/actions/workflow/status/pluginpal/strapi-webtools/tests.yml?branch=master" alt="CI build status" />
  </a>
  <a href="https://codecov.io/gh/pluginpal/strapi-webtools">
    <img src="https://codecov.io/gh/pluginpal/strapi-webtools/coverage.svg?branch=master" alt="codecov.io" />
  </a>
</p>
</div>

## ✨ Features

- **Multilingual** (Implements `rel="alternate"` using the [official i18n Strapi patterns](https://docs.strapi.io/dev-docs/i18n))
- **Admin UI** (Easily configure your sitemaps using the admin UI)
- **URL bundles** (Bundle URLs by type and add them to the sitemap XML)
- **Custom URLs** (URLs of pages which are not managed in Strapi)
- **Virtual sitemap** (Sitemaps served from the database)
- **Cron regeneration** (Automatically scheduled cron job for regeneration)
- **Sitemap indexes** (Paginated sitemap indexes for large URL sets)
- **Exclude URLs** (Exclude specified URLs from the sitemap)
- **CLI** (CLI for sitemap generation)
- **Styled with XSL** (Human readable XML styling)

## ⏳ Installation

[Read the Getting Started tutorial](https://docs.pluginpal.io/webtools/addons/sitemap) or follow the steps below:

```bash
# using yarn
yarn add webtools-addon-sitemap

# using npm
npm install webtools-addon-sitemap --save
```

After successful installation you have to rebuild the admin UI so it'll include this plugin. To rebuild and restart Strapi run:

```bash
# using yarn
yarn build
yarn develop

# using npm
npm run build
npm run develop
```

The **Sitemap** plugin should now appear in the **Webtools** section of your Strapi app.

Enjoy 🎉

## 📓 Documentation

The full documentation of this plugin can be found on it's dedicated documentation website.

- [Webtools documentation](https://docs.pluginpal.io/webtools)

## 🔌 Addons

Webtools can be extended by installing addons that hook into the core Webtools functionality. Read more about how addons work and how to install them in the [addons documentation](https://docs.pluginpal.io/webtools/addons).

## 🤝 Contributing

Feel free to fork and make a pull request of this plugin. All the input is welcome!

## ⭐️ Show your support

Give a star if this project helped you.

## 🔗 Links

- [PluginPal marketplace](https://www.pluginpal.io/plugin/webtools)
- [NPM package](https://www.npmjs.com/package/webtools-addon-sitemap)
- [GitHub repository](https://github.com/pluginpal/strapi-webtools)
- [Strapi marketplace](https://market.strapi.io/plugins/@pluginpal-webtools-core)

## 🌎 Community support

- For general help using Strapi, please refer to [the official Strapi documentation](https://strapi.io/documentation/).
- You can contact me on the Strapi Discord [channel](https://discord.strapi.io/).

## 📝 Resources

- [MIT License](https://github.com/pluginpal/strapi-webtools/blob/master/LICENSE.md)
