<div align="center">
<h1>Strapi Webtools</h1>
	
<p style="margin-top: 0;">Everything you need to build a website with Strapi CMS</p>

<a href="https://docs.pluginpal.io/webtools">Read the documentation</a>
	
<p>
  <a href="https://www.npmjs.org/package/strapi-plugin-webtools">
    <img src="https://img.shields.io/npm/v/strapi-plugin-webtools/latest.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.org/package/strapi-plugin-webtools">
    <img src="https://img.shields.io/npm/dm/strapi-plugin-webtools" alt="Monthly download on NPM" />
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

- **Unique URLs** Every page will get their own unique path
- **Auto generated** Automatically generated based on a pattern
- **Flexible** Overwrite single URLs
- **Frontend router** Get any page by it's unique path from the public API
- **Auto slugify** The URLs will automatically be slugified to ensure valid paths

## ⏳ Installation

[Read the Getting Started tutorial](https://docs.pluginpal.io/webtools) or follow the steps below:

### Installer wizard

To provide easy installation, this plugin comes with it's own installer wizard. It let's you interactively select which content types you want to enable and which addons you want to install. Making it easy to get started with Webtools!

```bash
npx webtools-cli install
```

### Enabling

Using the installer wizard you can easily enable Webtools for your content types. If there are still more content-types you want to enable, you can do that manually through the admin panel. Read more about how to do that in the [usage documentation](https://docs.pluginpal.io/webtools/usage).

### Building

After successful installation you have to rebuild the admin UI so it'll include this plugin. To rebuild and restart Strapi run:

```bash
# using yarn
yarn build
yarn develop

# using npm
npm run build
npm run develop
```

Enjoy 🎉

## 📓 Documentation

The full documentation of this plugin can be found on it's dedicated documentation website.

- [Webtools core plugin](https://docs.pluginpal.io/webtools)
- [Webtools sitemap addon](https://docs.pluginpal.io/webtools/addons/sitemap)


## 🔌 Addons

Webtools can be extended by installing addons that hook into the core Webtools functionality. Read more about how addons work and how to install them in the [addons documentation](https://docs.pluginpal.io/webtools/addons).

## 🔗 Links

- [PluginPal marketplace](https://www.pluginpal.io/plugin/webtools)
- [NPM package](https://www.npmjs.com/package/strapi-plugin-webtools)
- [GitHub repository](https://github.com/pluginpal/strapi-webtools)
- [Strapi marketplace](https://market.strapi.io/plugins/@pluginpal-webtools-core)

## 🌎 Community support

- For general help using Strapi, please refer to [the official Strapi documentation](https://strapi.io/documentation/).
- You can contact me on the Strapi Discord [channel](https://discord.strapi.io/).

## 📝 Resources

- [MIT License](https://github.com/pluginpal/strapi-webtools/blob/master/LICENSE.md)
