'use strict';

const { getPluginService } = require('../../util/getPluginService');

/**
 * Sitemap.js controller
 *
 * @description: A set of functions called "actions" of the `sitemap` plugin.
 */

module.exports = {
  findOne: async (ctx) => {
    try {
      const { id } = ctx.params;
      const patternEntity = await getPluginService('patternSerivce').findOne(id);
      ctx.send(patternEntity);
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  },
  findMany: async (ctx) => {
    try {
      const patternEntities = await getPluginService('patternSerivce').findMany();
      ctx.send(patternEntities);
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  },
  delete: async (ctx) => {
    try {
      const { id } = ctx.params;
      await getPluginService('patternSerivce').delete(id);
      ctx.send({ succes: true });
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  },
  update: async (ctx) => {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;
      const patternEntity = await getPluginService('patternSerivce').update(id, data);
      ctx.send(patternEntity);
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  },
  create: async (ctx) => {
    try {
      const { data } = ctx.request.body;
      const patternEntity = await getPluginService('patternSerivce').create(data);
      ctx.send(patternEntity);
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  },
};
