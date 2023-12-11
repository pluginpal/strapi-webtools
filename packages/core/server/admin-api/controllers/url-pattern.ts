

import _ from 'lodash';
import { Context } from 'koa';
import { Common, EntityService, Schema } from '@strapi/strapi';

import { getPluginService } from '../../util/getPluginService';
import { KoaContext } from '../../../types/koa';

/**
 * Pattern controller
 */

const controller = () => ({
  findOne: async (ctx: Context & { params: { id: number } }) => {
    const { id } = ctx.params;
    const patternEntity = await getPluginService('urlPatternService').findOne(
      id,
    );
    ctx.body = patternEntity;
  },
  findMany: async (ctx: Context) => {
    const patternEntities = await getPluginService(
      'urlPatternService',
    ).findMany({});
    ctx.body = patternEntities;
  },
  delete: async (ctx: Context & { params: { id: number } }) => {
    const { id } = ctx.params;
    await getPluginService('urlPatternService').delete(id);
    ctx.body = { succes: true };
  },
  update: async (ctx: KoaContext<EntityService.Params.Pick<'plugin::webtools.url-pattern', 'data'>> & { params: { id: number } }) => {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    const patternEntity = await getPluginService('urlPatternService').update(
      id,
      data,
    );
    ctx.body = patternEntity;
  },
  create: async (ctx: KoaContext<EntityService.Params.Pick<'plugin::webtools.url-pattern', 'data'>>) => {
    const { data } = ctx.request.body;
    const patternEntity = await getPluginService('urlPatternService').create(
      data,
    );
    ctx.body = patternEntity;
  },
  allowedFields: (ctx: Context) => {
    const formattedFields = {};

    Object.values(strapi.contentTypes).forEach((contentType: Schema.ContentType) => {
      const { pluginOptions } = contentType;

      // Not for CTs that are not visible in the content manager.
      const isInContentManager = _.get(pluginOptions, [
        'content-manager',
        'visible',
      ]) as boolean;
      if (isInContentManager === false) return;

      const fields = getPluginService('urlPatternService').getAllowedFields(
        contentType,
        ['string', 'uid', 'id'],
      );
      formattedFields[contentType.uid] = fields;
    });

    ctx.body = formattedFields;
  },

  validatePattern: (ctx: KoaContext<{ pattern: string, modelName: Common.UID.ContentType }>) => {
    const urlPatternService = getPluginService('urlPatternService');
    const { pattern, modelName } = ctx.request.body;

    const contentType = strapi.contentTypes[modelName];

    const fields = urlPatternService.getAllowedFields(contentType, [
      'string',
      'uid',
      'id',
    ]);
    const validated = urlPatternService.validatePattern(pattern, fields);

    ctx.body = validated;
  },
});

export default controller;
