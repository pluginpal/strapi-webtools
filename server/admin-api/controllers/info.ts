"use strict";

import _ from "lodash";
import { getPluginService } from "../../util/getPluginService";

/**
 * Info controller
 */

export default {
  getContentTypes: async (ctx) => {
    try {
      const contentTypes: {
        name: string;
        uid: string;
      }[] = [];

      await Promise.all(
        Object.values(strapi.contentTypes).map(async (contentType: any) => {
          const { pluginOptions } = contentType;

          // Not for CTs that are not visible in the content manager.
          const isInContentManager = _.get(pluginOptions, [
            "content-manager",
            "visible",
          ]);
          if (isInContentManager === false) return;

          contentTypes.push({
            name: contentType.globalId,
            uid: contentType.uid,
          });
        }),
      );

      ctx.send(contentTypes);
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit("error", err, ctx);
    }
  },

  getLanguages: async (ctx) => {
    try {
      const formattedLocales: {
        name: string;
        uid: string;
      }[] = [];
      if (strapi.plugin("i18n")) {
        const locales = await strapi.query("plugin::i18n.locale").findMany();
        locales.map((locale) => {
          formattedLocales.push({
            name: locale.name,
            uid: locale.code,
          });
        });
        ctx.send(formattedLocales);
      } else {
        ctx.send([]);
      }
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit("error", err, ctx);
    }
  },

  getPluginOptions: async (ctx) => {
    const { params } = ctx;
    const { uid } = params;

    if (typeof uid !== "string") return ctx.badRequest("uid must be a string");

    try {
      const service = getPluginService("infoService");
      const pluginOptions = await service.getPluginOptions(uid);

      ctx.send(pluginOptions);
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
    }
  },
};
