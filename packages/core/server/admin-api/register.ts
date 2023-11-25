

import _ from 'lodash';
import { Schema } from '@strapi/strapi';
import { IStrapi } from '../types/strapi';

export default (strapi: IStrapi) => {
  // Register the url_alias field.
  Object.values(strapi.contentTypes).forEach((contentType: Schema.ContentType) => {
    const { attributes, pluginOptions } = contentType;

    // Not for CTs that are not visible in the content manager.
    const isInContentManager = _.get(pluginOptions, ['content-manager', 'visible']) as boolean;
    if (isInContentManager === false) return;

    _.set(attributes, 'url_alias', {
      writable: true,
      private: false,
      configurable: false,
      visible: false,
      default: null,
      type: 'relation',
      relation: 'oneToOne',
      target: 'plugin::webtools.url-alias',
      unique: true,
      pluginOptions: {
        i18n: {
          localized: true,
        },
      },
    });
  });

  // Register the pattern config type when using the config-sync plugin.
  if (strapi.plugin('config-sync')) {
    const configSyncPluginTypes = strapi.plugin('config-sync').pluginTypes as any[];

    if (!strapi.plugin('config-sync').pluginTypes) {
      // eslint-disable-next-line no-param-reassign
      strapi.plugin('config-sync').pluginTypes = [];
    }

    configSyncPluginTypes.push({
      configName: 'url-pattern',
      queryString: 'plugin::webtools.url-pattern',
      uid: 'code',
    });
  }
};
