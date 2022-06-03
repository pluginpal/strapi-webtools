'use strict';

const { getPluginService } = require('../../util/getPluginService');

/**
 * Path controller
 */

module.exports = {
  findOne: async (ctx) => {
    try {
      const { id } = ctx.params;
      const pathEntity = await getPluginService('pathService').findOne(id);
      ctx.send(pathEntity);
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  },
};
