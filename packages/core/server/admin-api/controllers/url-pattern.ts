"use strict";

import _ from "lodash";
import { getPluginService } from "../../util/getPluginService";

/**
 * Pattern controller
 */

const controller = ({ strapi }) => ({
  findOne: async (ctx) => {
    try {
      const { id } = ctx.params;
      const patternEntity = await getPluginService("urlPatternService").findOne(
        id,
      );
      ctx.send(patternEntity);
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit("error", err, ctx);
    }
  },
  findMany: async (ctx) => {
    try {
      const patternEntities = await getPluginService(
        "urlPatternService",
      ).findMany();
      ctx.send(patternEntities);
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit("error", err, ctx);
    }
  },
  delete: async (ctx) => {
    try {
      const { id } = ctx.params;
      await getPluginService("urlPatternService").delete(id);
      ctx.send({ succes: true });
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit("error", err, ctx);
    }
  },
  update: async (ctx) => {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;
      const patternEntity = await getPluginService("urlPatternService").update(
        id,
        data,
      );
      ctx.send(patternEntity);
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit("error", err, ctx);
    }
  },
  create: async (ctx) => {
    try {
      const { data } = ctx.request.body;
      const patternEntity = await getPluginService("urlPatternService").create(
        data,
      );
      ctx.send(patternEntity);
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.details.errors;
      ctx.app.emit("error", err, ctx);
    }
  },
  allowedFields: async (ctx) => {
    const formattedFields = {};

    Object.values(strapi.contentTypes).map(async (contentType: any) => {
      const { pluginOptions } = contentType;

      // Not for CTs that are not visible in the content manager.
      const isInContentManager = _.get(pluginOptions, [
        "content-manager",
        "visible",
      ]);
      if (isInContentManager === false) return;

      const fields = await getPluginService("urlPatternService").getAllowedFields(
        contentType,
        ["string", "uid", "id"],
      );
      formattedFields[contentType.uid] = fields;
    });

    ctx.send(formattedFields);
  },

  validatePattern: async (ctx) => {
    const urlPatternService = getPluginService("urlPatternService");
    const { pattern, modelName } = ctx.request.body;

    const contentType = strapi.contentTypes[modelName];

    const fields = await urlPatternService.getAllowedFields(contentType, [
      "string",
      "uid",
      "id",
    ]);
    const validated = await urlPatternService.validatePattern(pattern, fields);

    ctx.send(validated);
  },
});

export default controller;
