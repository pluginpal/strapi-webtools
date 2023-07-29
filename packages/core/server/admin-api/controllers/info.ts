"use strict";

import _ from "lodash";
import getAddons from "../../util/getAddons";

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

          // Only return content types which have webtools enabled.
          const isInContentManager = _.get(pluginOptions, [
            "webtools",
            "enabled",
          ]);
          if (isInContentManager === true) {
            contentTypes.push({
              name: contentType.globalId,
              uid: contentType.uid,
            });
          } else {
            return false;
          }

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

  getAddons: async (ctx) => {
    const addons = getAddons(strapi);
    ctx.send(addons);
  },
};
