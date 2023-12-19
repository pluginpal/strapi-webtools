module.exports = {
  webtools: {
    enabled: true,
    resolve: './src/plugins/webtools',
    config: {
      website_url: 'https://www.pluginpal.io'
    }
  },

  'webtools-addon-sitemap': {
    enabled: true,
    resolve: './src/plugins/webtools-addon-sitemap',
  },

  'webtools-addon-redirects': {
    enabled: true,
    resolve: './src/plugins/webtools-addon-redirects',
  },

  'webtools-addon-menus': {
    enabled: true,
    resolve: './src/plugins/webtools-addon-menus',
  },
};
