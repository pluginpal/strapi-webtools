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
