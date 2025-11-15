---
sidebar_label: 'Setup License'
displayed_sidebar: webtoolsSidebar
slug: /cli/setup-license
---

# Setup license

## Overview

If you've purchased a license for the premium features of Webtools, or want to start a free trial, you can use this CLI to setup the configuration for proper installation and license validation. The CLI will ask you to input your license key which will be added to the `.npmrc` (or `.yarnrc.yml` for Yarn v2+) and `.env` files.

## Usage

```bash
npx webtools-cli setup-license
```

## License Setup Options

When you run the setup command, you'll be presented with three options:

### 1. Yes, use my license

Select this option if you already have a purchased license key. You'll be prompted to:
- Enter your license key
- The CLI will automatically create/update:
  - `.env` file with `WEBTOOLS_LICENSE_KEY=your-key`
  - `.npmrc` file (for npm/pnpm/Yarn v1) or `.yarnrc.yml` file (for Yarn v2+) with registry configuration

### 2. Get me a trial

Select this option to start a **7-day free trial** of the Essential plan. The trial includes:
- [Redirects addon](/webtools/addons/redirects)
- [Links addon](/webtools/addons/links)

#### Trial Process

1. The CLI will display a link to start your free trial
2. Visit the link to complete the checkout process
3. After checkout, you'll receive your trial license key
4. Return to the CLI and select "Yes" when asked "Got your license key?"
5. Enter your license key to complete the setup

:::tip
Remember: You can cancel within 7 days to ensure your trial remains free.
:::

### 3. Skip

Select this option if you want to continue without setting up a license. You'll have access to:
- Core Webtools features (URL aliases and patterns)
- [Sitemap addon](/webtools/addons/sitemap) (free)

## What Gets Created

The setup process creates/updates the following files:

### .env file

```
WEBTOOLS_LICENSE_KEY=your-license-key-here
```

### .npmrc file (npm/pnpm/Yarn v1)

```
@pluginpal:registry=https://npm.pluginpal.io
//npm.pluginpal.io/:_authToken=your-license-key-here
always-auth=true
```

### .yarnrc.yml file (Yarn v2+)

```yaml
npmScopes:
  pluginpal:
    npmPublishRegistry: https://npm.pluginpal.io
    npmRegistryServer: https://npm.pluginpal.io
    npmAlwaysAuth: true
    npmAuthIdent: "token"
    npmAuthToken: "your-license-key-here"
```

## Next Steps

After setting up your license, follow the installation instructions for the addons you want to use:

- [Redirects addon installation](/webtools/addons/redirects/installation)
- [Links addon installation](/webtools/addons/links/installation)
