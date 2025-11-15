<div align="center">
  <h1>Strapi Webtools</h1>
  <p style="margin-top: 0;">Everything you need to build a website with Strapi CMS</p>
  
  <p>
    <a href="https://docs.pluginpal.io/webtools"><strong>Read the documentation →</strong></a>
  </p>

  <p>
    <a href="https://www.npmjs.org/package/strapi-plugin-webtools">
      <img src="https://img.shields.io/npm/v/strapi-plugin-webtools/latest.svg" alt="NPM Version" />
    </a>
    <a href="https://www.npmjs.org/package/strapi-plugin-webtools">
      <img src="https://img.shields.io/npm/dm/strapi-plugin-webtools" alt="Monthly download on NPM" />
    </a>
    <a href="https://img.shields.io/github/actions/workflow/status/pluginpal/strapi-webtools/tests.yml?branch=master">
      <img src="https://img.shields.io/github/actions/workflow/status/pluginpal/strapi-webtools/tests.yml?branch=master" alt="CI build status" />
    </a>
    <a href="https://codecov.io/gh/pluginpal/strapi-webtools">
      <img src="https://codecov.io/gh/pluginpal/strapi-webtools/coverage.svg?branch=master" alt="codecov.io" />
    </a>
  </p>
</div>

---

## ✨ Features

- Unique URLs – Every page gets its own unique path
- Auto-generated – Based on a configurable URL pattern
- Flexible – Override individual URLs when needed
- Frontend router – Fetch any page by its unique path via the public API
- Auto-slugify – Ensures valid, clean URL paths

## ✅ Requirements

- Node.js: >= 18.17
- Strapi: v5.x

## ⏳ Installation

Read the full Getting Started guide in the docs, or run the installer. The command below executes the Webtools installer (webtools-cli) in your current project directory:

```bash
npx webtools-cli install
```

The installer lets you:
- Enable Webtools for selected content types
- Optionally install addons (e.g. Sitemap)

> Keyboard shortcuts: Space (toggle), a (all), i (invert), Enter (confirm)

### Build the admin

After installation, rebuild the Strapi admin so it includes the plugin:

```bash
# using yarn
yarn build
yarn develop

# using npm
npm run build
npm run develop
```

## 🚀 Quick start

1) Enable Webtools for your content types (via the installer or Admin → Content-Type Builder)
2) Create URL patterns (Webtools → Patterns)
3) Bulk generate aliases (Webtools → All URLs)
4) Optionally set up the Sitemap addon (see docs)

Enjoy 🎉

## 📓 Documentation

- Core plugin: https://docs.pluginpal.io/webtools
- Sitemap addon: https://docs.pluginpal.io/webtools/addons/sitemap
- Links addon: https://docs.pluginpal.io/webtools/addons/links
- Redirects addon: https://docs.pluginpal.io/webtools/addons/redirects
- Breadcrumbs addon: https://docs.pluginpal.io/webtools/addons/breadcrumbs

## 🔌 Addons

Webtools can be extended with addons that hook into the core. Learn more: https://docs.pluginpal.io/webtools/addons

## 🔗 Links

- PluginPal marketplace: https://www.pluginpal.io/plugin/webtools
- NPM package: https://www.npmjs.com/package/strapi-plugin-webtools
- GitHub repository: https://github.com/pluginpal/strapi-webtools
- Strapi marketplace: https://market.strapi.io/plugins/@pluginpal-webtools-core

## 🌎 Community support

- For Strapi usage questions, see the official docs: https://strapi.io/documentation/
- Chat on Strapi Discord: https://discord.strapi.io/

## 📝 License

MIT — https://github.com/pluginpal/strapi-webtools/blob/master/LICENSE.md
