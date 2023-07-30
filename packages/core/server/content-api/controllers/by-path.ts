'use strict';

import { transformResponse } from '@strapi/strapi/lib/core-api/controller/transform';
import { getPluginService } from '../../util/getPluginService';
import { sanitizeOutput } from '../../util/sanitizeOutput';

/**
 * ByPath controller
 */

export default {
  get: async (ctx) => {
    const { path } = ctx.query;
    const { auth } = ctx.state;

    const { entity, contentType } = await getPluginService('byPathService').byPath(path, ctx.query);

    if (!entity) {
      ctx.notFound();
      return;
    }

    // TODO:
    // Check 'find' permissions for the content type we're querying.
    // If there is no permission throw a 403.

    // Add content type to response.
    entity.contentType = contentType;
    const contentTypeObj = strapi.contentTypes[contentType];

    // Format response.
    const sanitizedEntity = await sanitizeOutput(entity, contentTypeObj, auth);
    ctx.body = transformResponse(sanitizedEntity, {}, { contentType: contentTypeObj });
  },

  all: async (ctx) => {
    const { auth } = ctx.state;
    const { query } = ctx;

    const { results, pagination } = await getPluginService('urlAliasService').findMany(false, query);
    const contentTypeObj = strapi.contentTypes['plugin::webtools.url-alias'];

    if (!results) {
      ctx.notFound();
      return;
    }

    // Format response.
    const sanitizedEntity = await sanitizeOutput(results, contentTypeObj, auth);
    ctx.body = transformResponse(sanitizedEntity, { pagination }, { contentType: contentTypeObj });
  },
};
