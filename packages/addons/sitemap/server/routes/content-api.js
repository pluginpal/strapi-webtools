'use strict';

export default {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/sitemap/:id.xml',
      handler: 'core.getSitemap',
      config: {
        policies: [],
        prefix: '',

      },
    },
    {
      method: 'GET',
      path: '/sitemap/xsl/sitemap.xsl',
      handler: 'core.getSitemapXsl',
      config: {
        policies: [],
        prefix: '',

      },
    },
    {
      method: 'GET',
      path: '/sitemap/xsl/sortable.min.js',
      handler: 'core.getSitemapXslSortable',
      config: {
        policies: [],
        prefix: '',

      },
    },
    {
      method: 'GET',
      path: '/sitemap/xsl/sitemap.xsl.js',
      handler: 'core.getSitemapXslJs',
      config: {
        policies: [],
        prefix: '',

      },
    },
    {
      method: 'GET',
      path: '/sitemap/xsl/sitemap.xsl.css',
      handler: 'core.getSitemapXslCss',
      config: {
        policies: [],
        prefix: '',

      },
    },
  ],
};
