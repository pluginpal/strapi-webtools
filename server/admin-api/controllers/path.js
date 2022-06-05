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
  findMany: async (ctx) => {
    try {
      const pathEntities = await getPluginService('pathService').findMany();
      ctx.send(pathEntities);
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  },
  editLink: async (ctx) => {
    try {
      const { path } = ctx.query;
      const { entity, contentType } = await getPluginService('byPathService').byPath(path);

      if (!entity) {
        ctx.notFound();
        return;
      }

      const contentTypeObj = strapi.contentTypes[contentType];

      ctx.send({
        link: `/content-manager/${contentTypeObj.kind}/${contentType}/${entity.id}`,
      });
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  },
};
