
import { factories } from '@strapi/strapi';
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

    ctx.body = {
      link: `/content-manager/${contentTypeUrlPartial}/${contentType}/${contentTypeObj.kind === 'collectionType' ? entity.documentId : ''}`,
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

    if (strapi.plugin('i18n')) {
      await getPluginService('bulk-generate').createLanguageLinksForUrlAliases();
    }

    // Return the amount of generated URL aliases.
    ctx.body = {
      success: true,
      message: `Successfully generated ${generatedCount} URL alias${generatedCount > 1 ? 'es' : ''}.`,
    };
  },
}));
