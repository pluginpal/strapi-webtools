
import { Context } from 'koa';
import { Schema } from '@strapi/strapi';

import { getPluginService } from '../util/getPluginService';
import { sanitizeOutput } from '../util/sanitizeOutput';

type EntityResponse = { data: {}, meta: {} };

const routerWithControllers = async (ctx: Context) => {
  const { path, ...searchQuery } = ctx.query;

  // Find related entity by path.
  const { entity, contentType } = await getPluginService('url-alias').findRelatedEntity(path as string, {
    ...searchQuery,
    fields: ['documentId'],
  });

  const isSingleType = strapi.contentTypes[contentType].kind === 'singleType';
  let controllerEntity: EntityResponse = null;

  // Query the full entity using the content type controller.
  if (isSingleType) {
    controllerEntity = await strapi.controllers[contentType].find(ctx, async () => {}) as
      EntityResponse;
  } else {
    controllerEntity = await strapi.controllers[contentType].findOne({
      ...ctx,
      query: {
        ...ctx.query,
      },
      params: {
        ...ctx.params as {},
        id: entity.documentId,
      },
    }, async () => {}) as EntityResponse;
  }

  if (!controllerEntity) {
    ctx.notFound();
    return null;
  }

  // Add content type to response.
  const responseEntity = {
    data: {
      ...controllerEntity.data,
      contentType,
    },
    meta: {
      ...controllerEntity.meta,
    },
  };

  return responseEntity;
};

/**
 * Router controller
 */

export default {
  router: async (ctx: Context) => {
    const { path, ...searchQuery } = ctx.query;
    const { auth } = ctx.state;
    const start = Date.now();

    const routerUseControllers = strapi.config.get('plugin::webtools.router_use_controllers', false);
    const telemetry = (global as any).webtoolsTelemetry;

    if (routerUseControllers) {
      const entity = await routerWithControllers(ctx);
      if (!entity) {
        telemetry?.trackEvent('router.not_found', {
          locale: (searchQuery as any).locale,
          duration_ms: Date.now() - start,
        });
        return;
      }
      telemetry?.trackEvent('router.resolved', {
        content_type_uid: (entity.data as any).contentType,
        locale: (searchQuery as any).locale,
        used_controllers: true,
        duration_ms: Date.now() - start,
      });
      ctx.body = entity;
      return;
    }

    // Find related entity by path.
    const { entity, contentType } = await getPluginService('url-alias').findRelatedEntity(path as string, searchQuery);

    if (!entity) {
      telemetry?.trackEvent('router.not_found', {
        locale: (searchQuery as any).locale,
        duration_ms: Date.now() - start,
      });
      ctx.notFound();
      return;
    }

    // Check 'find' permissions for the content type we're querying.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await strapi.auth.verify(auth, { scope: [`${contentType}.find`] });

    telemetry?.trackEvent('router.resolved', {
      content_type_uid: contentType,
      locale: entity.locale,
      used_controllers: false,
      duration_ms: Date.now() - start,
    });

    // Add content type to response.
    const responseEntity = {
      ...entity,
      contentType,
    };

    const contentTypeObj = strapi.contentTypes[contentType] as Schema.ContentType;

    // Format response.
    const sanitizedEntity = await sanitizeOutput(responseEntity, contentTypeObj, auth);
    ctx.body = {
      data: sanitizedEntity,
      meta: {},
    };
  },
};
