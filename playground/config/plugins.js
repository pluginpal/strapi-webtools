const path = require('path');

module.exports = {
  webtools: {
    enabled: true,
    resolve: path.resolve(__dirname, '../src/plugins/webtools'),
  },

  'webtools-addon-sitemap': {
    enabled: true,
    resolve: path.resolve(__dirname, '../src/plugins/webtools-addon-sitemap'),
  },

  'webtools-addon-redirects': {
    enabled: true,
    resolve: path.resolve(__dirname, '../src/plugins/webtools-addon-redirects'),
  },

  'webtools-addon-menus': {
    enabled: true,
    resolve: path.resolve(__dirname, '../src/plugins/webtools-addon-menus'),
  },
};
