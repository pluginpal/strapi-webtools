export interface Addon {
  name: string;
  description: string;
  packageName: string;
}

export const AVAILABLE_ADDONS: Addon[] = [
  {
    name: 'sitemap',
    description: 'Generate a sitemap for your Strapi content',
    packageName: 'webtools-addon-sitemap',
  },
];

export const PREMIUM_ADDONS: Addon[] = [
  {
    name: 'redirects',
    description: 'Manage redirects for your Strapi content',
    packageName: '@pluginpal/webtools-addon-redirects',
  },
  {
    name: 'links',
    description: 'Advanced link management for your Strapi content',
    packageName: '@pluginpal/webtools-addon-links',
  },
  {
    name: 'breadcrumbs',
    description: 'Generated breadcrumbs based on your URL alias',
    packageName: '@pluginpal/webtools-addon-breadcrumbs',
  },
  {
    name: 'sitemap expansion',
    description: 'Additional features for the sitemap addon',
    packageName: '@pluginpal/webtools-addon-sitemap-expansion',
  },
];
