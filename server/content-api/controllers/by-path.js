'use strict';

const { getPluginService } = require('../../util/getPluginService');

/**
 * ByPath controller
 */

module.exports = {
  get: async (ctx) => {
    const { path } = ctx.query;

    const pathEntity = await getPluginService('pathService').findByPath(path);
    if (!pathEntity) {
      ctx.status = 404;
      ctx.body = "Entity not found";
      return;
    }

    const entity = await strapi.entityService.findMany(pathEntity.contenttype, {
      filters: {
        path_id: pathEntity.id,
      },
      limit: 1,
    });
    if (!entity[0]) {
      ctx.status = 404;
      ctx.body = "Entity not found";
      return;
    }

    entity[0].contentType = pathEntity.contenttype;
    ctx.send(entity[0]);
  },
};
