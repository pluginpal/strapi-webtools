'use strict';

import _ from 'lodash';

export default async (strapi) => {
  // Register the url_path_id field.
  Object.values(strapi.contentTypes).forEach((contentType: any) => {
    const { attributes, pluginOptions } = contentType;

    // Not for CTs that are not visible in the content manager.
    const isInContentManager = _.get(pluginOptions, ['content-manager', 'visible']);
    if (isInContentManager === false) return;

    _.set(attributes, 'url_path_id', {
      writable: true,
      private: false,
      configurable: false,
      visible: false,
      default: null,
      type: 'string',
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
    if (!strapi.plugin('config-sync').pluginTypes) {
      strapi.plugin('config-sync').pluginTypes = [];
    }

    strapi.plugin('config-sync').pluginTypes.push({
      configName: 'url-pattern',
      queryString: 'plugin::webtools.pattern',
      uid: 'code',
    });
  }
};
