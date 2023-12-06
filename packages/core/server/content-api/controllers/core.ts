
import { Context } from 'koa';
import { transformResponse } from '@strapi/strapi/dist/core-api/controller/transform';

import { getPluginService } from '../../util/getPluginService';
import { sanitizeOutput } from '../../util/sanitizeOutput';

/**
 * Router controller
 */

export default {
  router: async (ctx: Context) => {
    const { path } = ctx.query;
    const { auth } = ctx.state;

    const { entity, contentType } = await getPluginService('byPathService').byPath(path as string, ctx.query);

    if (!entity) {
      ctx.notFound();
      return;
    }

    // TODO:
    // Check 'find' permissions for the content type we're querying.
    // If there is no permission throw a 403.

    // Add content type to response.
    // @ts-ignore
    entity.contentType = contentType;
    const contentTypeObj = strapi.contentTypes[contentType];

    // Format response.
    const sanitizedEntity = await sanitizeOutput(entity, contentTypeObj, auth);
    ctx.body = transformResponse(sanitizedEntity, {}, { contentType: contentTypeObj });
  },
};
