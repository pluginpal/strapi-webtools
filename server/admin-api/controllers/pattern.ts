"use strict";

import _ from "lodash";
import { getPluginService } from "../../util/getPluginService";
import { isContentTypeEnabled } from "../../util/enabledContentTypes";

/**
 * Pattern controller
 */

const controller = ({ strapi }) => ({
  findOne: async (ctx) => {
    try {
      const { id } = ctx.params;
      const patternEntity = await getPluginService("patternService").findOne(
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
        "patternService",
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
      await getPluginService("patternService").delete(id);
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
      const patternEntity = await getPluginService("patternService").update(
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
      const patternEntity = await getPluginService("patternService").create(
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
      if (!isContentTypeEnabled(contentType.uid)) {
        return;
      }

      const fields = getPluginService("patternService").getAllowedFields(
        contentType,
        ["string", "uid", "id"],
      );
      formattedFields[contentType.uid] = fields;
    });

    ctx.send(formattedFields);
  },

  validatePattern: async (ctx) => {
    const patternService = getPluginService("patternService");
    const { pattern, modelName } = ctx.request.body;

    const contentType = strapi.contentTypes[modelName];

    const fields = patternService.getAllowedFields(contentType, [
      "string",
      "uid",
      "id",
    ]);
    const validated = await patternService.validatePattern(pattern, fields);

    ctx.send(validated);
  },
});

export default controller;
