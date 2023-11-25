

import { Context } from 'koa';
import { getPluginService } from '../../util/getPluginService';

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
