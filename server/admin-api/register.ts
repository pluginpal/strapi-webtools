'use strict';

import _ from 'lodash';
import { isContentTypeEnabled } from '../util/enabledContentTypes';

export default async (strapi) => {
  // Register the url_path_id field.
  Object.values(strapi.contentTypes).forEach((contentType: any) => {
    const { attributes, pluginOptions } = contentType;

    if (!isContentTypeEnabled(contentType.uid)) {
      return;
    }

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
      queryString: 'plugin::url-alias.pattern',
      uid: 'code',
    });
  }
};
