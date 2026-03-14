
import { factories, UID } from '@strapi/strapi';
import { Context } from 'koa';
import { errors } from '@strapi/utils';

import { getPluginService } from '../util/getPluginService';
import { KoaContext } from '../types/koa';
import { GenerateParams } from '../services/bulk-generate';

/**
 * URL alias controller
 */

const contentTypeSlug = 'plugin::webtools.url-alias';

export default factories.createCoreController(contentTypeSlug, ({ strapi }) => ({
  async create(ctx: Context) {
    const response = await super.create(ctx);
    const telemetry = (global as any).webtoolsTelemetry;
    const entityData = (ctx.request as any).body?.data || {};
    telemetry?.trackEvent('url_alias.created', {
      content_type_uid: entityData.contenttype,
      locale: entityData.locale,
      is_generated: entityData.generated ?? false,
    });
    return response;
  },

  async update(ctx: Context) {
    const response = await super.update(ctx);
    const telemetry = (global as any).webtoolsTelemetry;
    const entityData = (ctx.request as any).body?.data || {};
    telemetry?.trackEvent('url_alias.updated', {
      locale: entityData.locale,
      was_generated: entityData.generated ?? false,
    });
    return response;
  },

  async delete(ctx: Context) {
    const { id } = ctx.params as { id: string };
    let locale: string | undefined;
    try {
      const entity = await strapi.documents(contentTypeSlug as any).findOne({
        documentId: id,
        fields: ['locale'],
      });
      locale = (entity as any)?.locale;
    } catch {
      // best-effort
    }
    const response = await super.delete(ctx);
    const telemetry = (global as any).webtoolsTelemetry;
    telemetry?.trackEvent('url_alias.deleted', { locale });
    return response;
  },

  editLink: async (ctx: Context) => {
    const { path } = ctx.query;
    const { entity, contentType } = await getPluginService('url-alias').findRelatedEntity(path as string, { status: 'draft' });

    if (!entity) {
      ctx.notFound();
      return;
    }

    const contentTypeObj = strapi.contentTypes[contentType];
    const contentTypeUrlPartial = contentTypeObj.kind === 'singleType' ? 'single-types' : 'collection-types';

    const model = strapi.getModel(contentType);
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const isLocalized = model.pluginOptions.i18n?.localized as boolean;

    ctx.body = {
      link: `/content-manager/${contentTypeUrlPartial}/${contentType}/${contentTypeObj.kind === 'collectionType' ? entity.documentId : ''}${isLocalized ? `?plugins[i18n][locale]=${entity.locale}` : ''}`,
    };
  },
  generate: async (
    ctx: KoaContext<GenerateParams>,
  ) => {
    const { types, generationType } = ctx.request.body;

    // Validation
    if (!types || !generationType) {
      const details: { [key in keyof GenerateParams]?: string } = {};

      if (!generationType) details.types = 'required';
      if (!generationType) details.generationType = 'required';

      throw new errors.ValidationError('Missing required POST parameter(s)', details);
    }

    const generatedCount = await getPluginService('bulk-generate').generateUrlAliases({ types, generationType });

    // Return the amount of generated URL aliases.
    ctx.body = {
      success: true,
      message: `Successfully generated ${generatedCount} URL alias${generatedCount > 1 ? 'es' : ''}.`,
    };
  },
  findFrom: async (ctx: KoaContext) => {
    const {
      model,
      documentId,
      locale,
    } = ctx.query as { model: UID.ContentType, documentId: string, locale?: string };

    const isSingleType = strapi.getModel(model)?.kind === 'singleType';

    const entity = await strapi.documents(model as 'api::test.test').findFirst({
      ...(!isSingleType ? { filters: { documentId } } : {}),
      ...(locale ? { locale } : {}),
      populate: ['url_alias'],
      fields: [],
    });

    if (!entity || !entity.url_alias) {
      ctx.body = [];
      return;
    }

    ctx.body = entity.url_alias;
  },
}));
