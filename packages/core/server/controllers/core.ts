
import { Context } from 'koa';

import { getPluginService } from '../util/getPluginService';
import { sanitizeOutput } from '../util/sanitizeOutput';

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

    // Check 'find' permissions for the content type we're querying.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await strapi.auth.verify(auth, { scope: [`${contentType}.find`] });

    // Add content type to response.
    // @ts-ignore
    entity.contentType = contentType;
    const contentTypeObj = strapi.contentTypes[contentType];

    // Format response.
    const sanitizedEntity = await sanitizeOutput(entity, contentTypeObj, auth);
    ctx.body = strapi.controller(contentType)
      // @ts-ignore
      .transformResponse(sanitizedEntity, {});
  },
};
