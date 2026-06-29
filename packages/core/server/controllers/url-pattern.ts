

import { Context } from 'koa';
import { factories, Schema, UID } from '@strapi/strapi';
import { KoaContext } from '../types/koa';
import { getPluginService } from '../util/getPluginService';

/**
 * URL pattern controller
 */

const contentTypeSlug = 'plugin::webtools.url-pattern';

export default factories.createCoreController(contentTypeSlug, ({ strapi }) => ({
  allowedFields: (ctx: Context) => {
    const formattedFields = {};

    Object.values(strapi.contentTypes).forEach((contentType: Schema.ContentType) => {
      const fields = getPluginService('url-pattern').getAllowedFields(
        contentType,
        ['pluralName', 'string', 'text', 'uid', 'documentId'],
      );
      formattedFields[contentType.uid] = fields;
    });

    ctx.body = formattedFields;
  },

  validatePattern: (ctx: KoaContext<{ pattern: string, modelName: UID.ContentType }>) => {
    const urlPatternService = getPluginService('url-pattern');
    const { pattern, modelName } = ctx.request.body;

    const contentType = strapi.contentTypes[modelName];

    const fields = urlPatternService.getAllowedFields(contentType, [
      'pluralName',
      'string',
      'text',
      'uid',
      'documentId',
    ]);
    const validated = urlPatternService.validatePattern(pattern, fields, contentType);

    ctx.body = validated;
  },
}));
