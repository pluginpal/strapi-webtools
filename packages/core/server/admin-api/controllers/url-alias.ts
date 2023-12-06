

import { Context } from 'koa';
import { EntityService } from '@strapi/strapi';

import { getPluginService } from '../../util/getPluginService';
import { KoaContext } from '../../types/koa';

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
    const pathEntities = await getPluginService('urlAliasService').findMany(true);
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

    ctx.body = {
      link: `/content-manager/${contentTypeObj.kind}/${contentType}/${entity.id}`,
    };
  },
};
