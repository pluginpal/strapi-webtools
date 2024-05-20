

import { Context } from 'koa';
import { EntityService } from '@strapi/strapi';
import { Common } from '@strapi/types';
import { errors } from '@strapi/utils';

import { getPluginService } from '../../util/getPluginService';
import { KoaContext } from '../../types/koa';
import { GenerationType } from '../../types';

interface GenerateParams { types: Common.UID.ContentType[], generationType: GenerationType }

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
    let generatedCount = 0;

    // Validation
    if (!types || !generationType) {
      const details: { [key in keyof GenerateParams]?: string } = {};

      if (!generationType) details.types = 'required';
      if (!generationType) details.generationType = 'required';

      throw new errors.ValidationError('Missing required POST parameter(s)', details);
    }

    // Map over all the types sent in the request.
    await Promise.all(types.map(async (type) => {
      if (generationType === 'all') {
        // Delete all the URL aliases for the given type.
        await getPluginService('url-alias').deleteMany({
          filters: {
            contenttype: type,
          },
        });
      }

      if (generationType === 'only_generated') {
        // Delete all the auto generated URL aliases of the given type.
        await getPluginService('url-alias').deleteMany({
          filters: {
            contenttype: type,
            generated: true,
          },
        });
      }

      const urlPattern = await getPluginService('urlPatternService').findByUid(type);
      const relations = getPluginService('urlPatternService').getRelationsFromPattern(urlPattern);

      // Query all the entities of the type that do not have a corresponding URL alias.
      const entities = await strapi.entityService.findMany(type, {
        filters: {
          url_alias: null,
        },
        populate: {
          ...relations.reduce((obj, key) => ({ ...obj, [key]: {} }), {}),
        },
      });

      // For all those entities we will create a URL alias and connect it to the entity.
      await Promise.all(entities.map(async (entity) => {
        const generatedPath = getPluginService('urlPatternService').resolvePattern(type, entity, urlPattern);
        const newUrlAlias = await getPluginService('urlAliasService').create({
          url_path: generatedPath,
          generated: true,
          contenttype: type,
        });

        await strapi.entityService.update(type, entity.id, {
          data: {
            // @ts-ignore
            url_alias: newUrlAlias.id,
          },
        });

        generatedCount += 1;
      }));
    }));

    // Return the amount of generated URL aliases.
    ctx.body = {
      success: true,
      message: `Successfully generated ${generatedCount} URL alias${generatedCount > 1 ? 'es' : ''}.`,
    };
  },
};
