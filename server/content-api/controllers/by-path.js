'use strict';

const { transformResponse } = require('@strapi/strapi/lib/core-api/controller/transform');

const { getPluginService } = require('../../util/getPluginService');
const { sanitizeOutput } = require('../../util/sanitizeOutput');

/**
 * ByPath controller
 */

module.exports = {
  get: async (ctx) => {
    const { path } = ctx.query;
    const { auth } = ctx.state;

    const { entity, contentType } = await getPluginService('byPathService').byPath(path);

    if (!entity) {
      ctx.notFound();
      return;
    }

    // Add content type to response.
    entity.contentType = contentType;
    const contentTypeObj = strapi.contentTypes[contentType];

    // Format response.
    const sanitizedEntity = await sanitizeOutput(entity, contentTypeObj, auth);
    ctx.body = transformResponse(sanitizedEntity, {}, { contentType: contentTypeObj });
  },

  all: async (ctx) => {
    const { auth } = ctx.state;

    const entities = await getPluginService('pathService').findMany();
    const contentTypeObj = strapi.contentTypes['plugin::url-alias.path'];

    if (!entities) {
      ctx.notFound();
      return;
    }

    // Format response.
    const sanitizedEntity = await sanitizeOutput(entities, contentTypeObj, auth);
    ctx.body = transformResponse(sanitizedEntity, {}, { contentType: contentTypeObj });
  },
};
