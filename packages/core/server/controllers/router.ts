
import { Context } from 'koa';
import { Schema, UID } from '@strapi/strapi';

import { getPluginService } from '../util/getPluginService';
import { sanitizeOutput } from '../util/sanitizeOutput';

/**
 * Router controller
 */

export default {
  findOne: async (ctx: Context) => {
    const { path, ...searchQuery } = ctx.query;
    const { auth } = ctx.state;

    const { entity, contentType } = await getPluginService('url-alias').findRelatedEntity(path as string, searchQuery);

    if (!entity) {
      ctx.notFound();
      return;
    }

    // Check 'find' permissions for the content type we're querying.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await strapi.auth.verify(auth, { scope: [`${contentType}.find`] });

    // Add content type to response.
    const responseEntity = {
      ...entity,
      contentType,
    };

    const contentTypeObj = strapi.contentTypes[contentType] as Schema.ContentType;

    // Format response.
    const sanitizedEntity = await sanitizeOutput(responseEntity, contentTypeObj, auth);
    ctx.body = await strapi.controller(contentType as UID.Controller)
      // @ts-expect-error
      // The strapi object is typed in a way that the following is expected to be a controller.
      // In fact that is not true, as this also exposes the helper functions of the controller.
      // That is the reason we put a ts-expect-error here.
      .transformResponse(sanitizedEntity, {});
  },
};
