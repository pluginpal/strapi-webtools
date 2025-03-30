
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
