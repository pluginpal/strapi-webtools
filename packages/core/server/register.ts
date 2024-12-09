/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import set from 'lodash/set';
import { Core, Schema } from '@strapi/strapi';
import { IStrapi } from './types/strapi';
import { isContentTypeEnabled } from './util/enabledContentTypes';
import { disableContentType } from './hooks/disable';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  // strapi.hook('strapi::content-types.beforeSync').register(disableContentType);

  // Register the url_alias field.
  Object.values(strapi.contentTypes).forEach((contentType: Schema.ContentType) => {
    const { attributes } = contentType;

    // Add a relation field to the url_alias content type, only
    // when webtools is explicitly enabled using pluginOptions.
    if (isContentTypeEnabled(contentType.uid)) {
      set(attributes, 'url_alias', {
        writable: true,
        private: false,
        configurable: false,
        visible: false,
        default: null,
        type: 'relation',
        relation: 'oneToMany',
        target: 'plugin::webtools.url-alias',
        unique: true,
      });
    }
  });

  // Register the pattern config type when using the config-sync plugin.
  if (strapi.plugin('config-sync')) {
    if (!strapi.plugin('config-sync').pluginTypes) {
      // eslint-disable-next-line no-param-reassign
      strapi.plugin('config-sync').pluginTypes = [];
    }

    strapi.plugin('config-sync').pluginTypes.push({
      configName: 'url-pattern',
      queryString: 'plugin::webtools.url-pattern',
      uid: 'code',
    });
  }
};
