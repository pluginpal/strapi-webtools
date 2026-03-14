import { ProAddon } from '../types/pro-addons';

export const PRO_ADDONS: ProAddon[] = [
  {
    id: 'redirects',
    name: 'Redirects',
    packageName: '@pluginpal/webtools-addon-redirects',
    tagline: 'Never lose SEO value when URLs change',
    description: 'Automatically manage redirects when URL aliases change. Prevent broken links and maintain SEO rankings.',
    benefits: [
      'Save 30+ hours/month on manual redirect management',
      'Chain & loop detection prevents redirect errors',
      'Preserve search rankings with automatic 301s',
      'REST API for frontend integration',
    ],
    icon: 'ArrowRight',
    docsUrl: 'https://docs.pluginpal.io/webtools/addons/redirects',
    value: 'Maintains SEO rankings during site reorganizations',
  },
  {
    id: 'links',
    name: 'Links',
    packageName: '@pluginpal/webtools-addon-links',
    tagline: 'Smart internal linking for your content',
    description: 'Custom field type for creating internal links that persist across URL changes. Links survive URL updates automatically.',
    benefits: [
      'Content teams manage links without developer help',
      'Links survive URL changes (document ID based)',
      'CKEditor & Magic Editor integration',
      'Smart search finds content instantly',
    ],
    icon: 'Link',
    docsUrl: 'https://docs.pluginpal.io/webtools/addons/links',
    value: 'Empowers content teams, reduces broken internal links',
  },
  {
    id: 'breadcrumbs',
    name: 'Breadcrumbs',
    packageName: '@pluginpal/webtools-addon-breadcrumbs',
    tagline: 'Automated breadcrumb navigation',
    description: 'Generate breadcrumb trails automatically based on URL structure. Zero manual maintenance required.',
    benefits: [
      'Automatic generation from URL structure',
      'Multilingual breadcrumbs out-of-the-box',
      'Works as API relation (populate in queries)',
      'Customizable per content type',
    ],
    icon: 'ArrowsLeftRight',
    docsUrl: 'https://docs.pluginpal.io/webtools/addons/breadcrumbs',
    value: 'Improves UX and SEO without developer maintenance',
  },
];

export const TRIAL_URL = 'https://polar.sh/checkout/polar_c_2scL6ja7SEWFHarsc21Pc8fHhRy14ib6XGUol2V5f7r';
export const DOCS_URL = 'https://docs.pluginpal.io/webtools/';
