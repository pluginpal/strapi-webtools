'use strict';

import fs from 'fs';
import _ from 'lodash';
import path from 'path';

import { getService } from '../utils';

/**
 * Sitemap.js controller
 *
 * @description: A set of functions called "actions" of the `sitemap` plugin.
 */

export default {
  buildSitemap: async (ctx) => {
    try {
      await getService('core').createSitemap();

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
    const sitemap = await getService('query').getSitemap('default', 0, ['link_count', 'updated_at', 'type']);
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
      sitemapInfo.location = '/api/sitemap/index.xml';
    }

    sitemapInfo.hasPro = !!strapi.plugin('sitemap-pro');

    ctx.send(sitemapInfo);
  },

  getSitemap: async (ctx) => {
    const { page = 0 } = ctx.query;
    const sitemap = await getService('query').getSitemap('default', page);

    if (!sitemap) {
      ctx.notFound('Not found');
      return;
    }

    ctx.response.set('content-type', 'application/xml');
    ctx.body = sitemap.sitemap_string;
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
