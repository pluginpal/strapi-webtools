

import get from 'lodash/get';
import { Schema } from '@strapi/strapi';
import { Context } from 'koa';

import getAddons from '../../util/getAddons';

/**
 * Info controller
 */

export default {
  getContentTypes: (ctx: Context) => {
    const contentTypes: {
      name: string;
      uid: string;
      localized: boolean;
    }[] = [];

    Object.values(strapi.contentTypes).forEach((contentType: Schema.ContentType) => {
      const { pluginOptions } = contentType;

      // Only return content types which have webtools enabled.
      const isInContentManager = get(pluginOptions, [
        'webtools',
        'enabled',
      ]) as boolean;
      const isLocalized = get(pluginOptions, [
        'i18n',
        'localized',
      ]) as boolean;
      if (isInContentManager === true) {
        contentTypes.push({
          name: contentType.globalId,
          uid: contentType.uid,
          localized: isLocalized || false,
        });
      }
    });

    ctx.body = contentTypes;
  },

  getLanguages: async (ctx: Context) => {
    const formattedLocales: {
      name: string;
      uid: string;
    }[] = [];
    if (strapi.plugin('i18n')) {
      const locales = await strapi.entityService.findMany('plugin::i18n.locale');
      locales.forEach((locale) => {
        formattedLocales.push({
          name: locale.name,
          uid: locale.code,
        });
      });
      ctx.body = formattedLocales;
    } else {
      ctx.body = [];
    }
  },

  getAddons: (ctx: Context) => {
    const addons = getAddons(strapi);
    ctx.body = addons;
  },

  getConfig: (ctx: Context) => {
    const config = strapi.config.get('plugin.webtools');
    ctx.body = config;
  },
};
