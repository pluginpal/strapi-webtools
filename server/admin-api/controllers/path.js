'use strict';

const { getPluginService } = require('../../util/getPluginService');

/**
 * Sitemap.js controller
 *
 * @description: A set of functions called "actions" of the `sitemap` plugin.
 */

module.exports = {
  get: async (ctx) => {
    try {
      const { id } = ctx.params;
      const pathEntity = await getPluginService('pathService').get(id);
      ctx.send(pathEntity);
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  },
};
