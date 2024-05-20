

import { Context } from 'koa';
import { EntityService } from '@strapi/strapi';
import { errors } from '@strapi/utils';

import { getPluginService } from '../../util/getPluginService';
import { KoaContext } from '../../types/koa';
import { GenerateParams } from '../services/bulk-generate';


/**
 * Path controller
 */

export default {
  findOne: async (ctx: Context & { params: { id: number } }) => {
    const { id } = ctx.params;
    const pathEntity = await getPluginService('urlAliasService').findOne(id);
    ctx.body = pathEntity;
  },
  findMany: async (ctx: Context) => {
    const pathEntities = await getPluginService('urlAliasService').findMany(true, ctx.query);
    ctx.body = pathEntities;
  },
  delete: async (ctx: Context & { params: { id: number } }) => {
    const { id } = ctx.params;
    await getPluginService('urlAliasService').delete(id);
    ctx.body = { succes: true };
  },
  update: async (ctx: KoaContext<EntityService.Params.Pick<'plugin::webtools.url-alias', 'data'>> & { params: { id: number } }) => {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    const patternEntity = await getPluginService('urlAliasService').update(
      id,
      data,
    );
    ctx.body = patternEntity;
  },
  create: async (ctx: KoaContext<EntityService.Params.Pick<'plugin::webtools.url-alias', 'data'>>) => {
    const { data } = ctx.request.body;
    const patternEntity = await getPluginService('urlAliasService').create(
      data,
    );
    ctx.body = patternEntity;
  },
  editLink: async (ctx: Context) => {
    const { path } = ctx.query;
    const { entity, contentType } = await getPluginService('byPathService').byPath(path as string);

    if (!entity) {
      ctx.notFound();
      return;
    }

    const contentTypeObj = strapi.contentTypes[contentType];
    const contentTypeUrlPartial = contentTypeObj.kind === 'singleType' ? 'single-types' : 'collection-types';

    ctx.body = {
      link: `/content-manager/${contentTypeUrlPartial}/${contentType}/${entity.id}`,
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

    const generatedCount = await getPluginService('bulkGenerate').generateUrlAliases({ types, generationType });

    if (strapi.plugin('i18n')) {
      await getPluginService('bulkGenerate').createLanguageLinksForUrlAliases();
    }

    // Return the amount of generated URL aliases.
    ctx.body = {
      success: true,
      message: `Successfully generated ${generatedCount} URL alias${generatedCount > 1 ? 'es' : ''}.`,
    };
  },
};
