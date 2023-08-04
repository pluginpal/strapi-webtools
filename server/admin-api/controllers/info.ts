"use strict";

import _ from "lodash";
import { getPluginService } from "../../util/getPluginService";
import { PluginOptions } from "../../../lib/schemas/pluginOptions";
import { GetContentTypes } from '../../../lib/schemas/getContentTypes';

/**
 * Info controller
 */

export default {
  getContentTypes: async (ctx) => {
    try {
      const contentTypes: GetContentTypes = [];

      const infoService = getPluginService("infoService");
      await Promise.all(
        Object.values(strapi.contentTypes).map(async (contentType: any) => {
          const { pluginOptions } = contentType;

          // Not for CTs that are not visible in the content manager.
          const isInContentManager = _.get(pluginOptions, [
            "content-manager",
            "visible",
          ]);
          if (isInContentManager === false) return;

          const urlAliasPluginOptions = infoService.getPluginOptions(contentType.uid) as PluginOptions;

          if (!urlAliasPluginOptions.enabled) {
            return;
          }

          contentTypes.push({
            name: contentType.globalId,
            uid: contentType.uid,
          });
        }),
      );

      // No need to validate the type here as it has already been set on the variable.

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
};
