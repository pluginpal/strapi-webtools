
import Koa from 'koa';
import { errors } from '@strapi/utils';
import { transformResponse } from '@strapi/strapi/dist/core-api/controller/transform';

import { sanitizeOutput } from '../../util/sanitizeOutput';

/**
 * URL alias controller
 */

const contentTypeSlug = 'plugin::webtools.url-alias';

export default {
  find: async (ctx: Koa.Context) => {
    const { auth } = ctx.state;
    const { query } = ctx;

    const { results, pagination } = await strapi.entityService.findPage(contentTypeSlug, {
      ...query,
    });

    if (!results) {
      throw new errors.NotFoundError('Not found');
    }

    // Format response.
    const contentTypeObj = strapi.contentTypes[contentTypeSlug];
    const sanitizedEntity = await sanitizeOutput(results, contentTypeObj, auth);
    ctx.body = transformResponse(sanitizedEntity, { pagination }, { contentType: contentTypeObj });
  },
};