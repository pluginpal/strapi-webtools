

import _ from 'lodash';
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
      const isInContentManager = _.get(pluginOptions, [
        'webtools',
        'enabled',
      ]) as boolean;
      const isLocalized = _.get(pluginOptions, [
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

  getAddons: (ctx: Context) => {
    const addons = getAddons(strapi);
    ctx.body = addons;
  },

  getConfig: (ctx: Context) => {
    const config = strapi.config.get('plugin.webtools');
    ctx.body = config;
  },
};
