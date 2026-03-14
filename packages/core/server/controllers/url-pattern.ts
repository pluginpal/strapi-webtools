


import get from 'lodash/get';
import { Context } from 'koa';
import { factories, Schema, UID } from '@strapi/strapi';
import { KoaContext } from '../types/koa';
import { getPluginService } from '../util/getPluginService';

/**
 * URL pattern controller
 */

const contentTypeSlug = 'plugin::webtools.url-pattern';

export default factories.createCoreController(contentTypeSlug, ({ strapi }) => ({
  async create(ctx: Context) {
    const response = await super.create(ctx);
    const telemetry = (global as any).webtoolsTelemetry;
    const entityData = (ctx.request as any).body?.data || {};
    telemetry?.trackEvent('url_pattern.created', {
      content_type_uid: entityData.contenttype,
      has_language_filter: Array.isArray(entityData.languages) && entityData.languages.length > 0,
    });
    return response;
  },

  async update(ctx: Context) {
    const response = await super.update(ctx);
    const telemetry = (global as any).webtoolsTelemetry;
    const entityData = (ctx.request as any).body?.data || {};
    telemetry?.trackEvent('url_pattern.updated', {
      content_type_uid: entityData.contenttype,
    });
    return response;
  },

  async delete(ctx: Context) {
    const { id } = ctx.params as { id: string };
    let contentTypeUid: string | undefined;
    try {
      const entity = await strapi.documents(contentTypeSlug as any).findOne({
        documentId: id,
        fields: ['contenttype'],
      });
      contentTypeUid = (entity as any)?.contenttype;
    } catch {
      // best-effort
    }
    const response = await super.delete(ctx);
    const telemetry = (global as any).webtoolsTelemetry;
    telemetry?.trackEvent('url_pattern.deleted', {
      content_type_uid: contentTypeUid,
    });
    return response;
  },

  allowedFields: (ctx: Context) => {
    const formattedFields = {};

    Object.values(strapi.contentTypes).forEach((contentType: Schema.ContentType) => {
      const { pluginOptions } = contentType;

      // Not for CTs that are not visible in the content manager.
      const isInContentManager = get(pluginOptions, [
        'content-manager',
        'visible',
      ]) as boolean;
      if (isInContentManager === false) return;

      const fields = getPluginService('url-pattern').getAllowedFields(
        contentType,
        ['pluralName', 'string', 'uid', 'documentId'],
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
      'uid',
      'documentId',
    ]);
    const validated = urlPatternService.validatePattern(pattern, fields);

    ctx.body = validated;
  },
}));
