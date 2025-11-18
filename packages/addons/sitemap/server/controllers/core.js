'use strict';

import fs from 'fs';
import path from 'path';
import { getPluginService } from '../utils/getPluginService';

/**
 * Sitemap.js controller
 *
 * @description: A set of functions called "actions" of the `sitemap` plugin.
 */

export default {
  buildSitemap: async (ctx) => {
    try {
      await getPluginService('core').createSitemap(ctx.params.id);

      ctx.send({
        message: 'The sitemap has been generated.',
      });
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  },

  info: async (ctx) => {
    const sitemap = await getPluginService('query').getSitemap(ctx.params.id, 0, ['link_count', 'updatedAt', 'type']);
    const sitemapInfo = {};

    if (sitemap) {
      if (sitemap.type === 'index') {
        sitemapInfo.sitemaps = sitemap.link_count;
        sitemapInfo.urls = 0;
      } else {
        sitemapInfo.urls = sitemap.link_count;
        sitemapInfo.sitemaps = 0;
      }

      sitemapInfo.updateTime = sitemap.updatedAt;
      sitemapInfo.location = `/api/sitemap/${ctx.params.id}.xml`;
    }

    ctx.send(sitemapInfo);
  },

  getSitemap: async (ctx) => {
    const { page = 0 } = ctx.query;
    let { id } = ctx.params;

    let sitemap = await getPluginService('query').getSitemap(id, page);

    // If the sitemap that is being queried has id 'index', and none is found,
    // try to get a sitemap with the id 'default'. This adds backwards compatibility
    // for users upgrading from older versions of the plugin.
    if (!sitemap && id === 'index') {
      sitemap = await getPluginService('query').getSitemap('default', page);
    }

    if (!sitemap) {
      ctx.notFound('Not found');
      return;
    }

    ctx.response.set('content-type', 'application/xml');
    ctx.body = sitemap.sitemap_string;
  },

  getSitemapTypes: async (ctx) => {
    ctx.body = ['hreflang'];
  },

  getSitemapXsl: async (ctx) => {
    const xsl = fs.readFileSync(path.resolve(__dirname, '../../xsl/sitemap.xsl'), 'utf8');
    ctx.response.set('content-type', 'application/xml');
    ctx.body = xsl;
  },

  getSitemapXslJs: async (ctx) => {
    const xsl = fs.readFileSync(path.resolve(__dirname, '../../xsl/sitemap.xsl.js'), 'utf8');
    ctx.response.set('content-type', 'text/javascript');
    ctx.body = xsl;
  },

  getSitemapXslSortable: async (ctx) => {
    const xsl = fs.readFileSync(path.resolve(__dirname, '../../xsl/sortable.min.js'), 'utf8');
    ctx.response.set('content-type', 'text/javascript');
    ctx.body = xsl;
  },

  getSitemapXslCss: async (ctx) => {
    const xsl = fs.readFileSync(path.resolve(__dirname, '../../xsl/sitemap.xsl.css'), 'utf8');
    ctx.response.set('content-type', 'text/css');
    ctx.body = xsl;
  },
};
