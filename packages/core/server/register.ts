/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import set from 'lodash/set';
import { Core, Schema } from '@strapi/strapi';
import { isContentTypeEnabled } from './util/enabledContentTypes';
import { disableContentType } from './hooks/disable';
import preventDuplicateUrlsMiddleware from './middlewares/prevent-duplicate-urls';
import deleteUrlAliasMiddleware from './middlewares/delete-url-alias';
import generateUrlAliasMiddleware from './middlewares/generate-url-alias';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.hook('strapi::content-types.beforeSync').register(disableContentType);

  strapi.documents.use(preventDuplicateUrlsMiddleware);
  strapi.documents.use(deleteUrlAliasMiddleware);
  strapi.documents.use(generateUrlAliasMiddleware);

  // Register the url_alias field.
  Object.values(strapi.contentTypes).forEach((contentType: Schema.ContentType) => {
    const { attributes } = contentType;

    // Add a relation field to the url_alias content type, only
    // when webtools is explicitly enabled using pluginOptions.
    if (isContentTypeEnabled(contentType)) {
      set(attributes, 'url_alias', {
        writable: true,
        private: false,
        configurable: false,
        editable: false,
        /**
         * Ideally this field would be hidden, but doing so will cause an issue.
         * The issue can be prevented by setting the field to visible.
         *
         * @see https://github.com/strapi/strapi/issues/23039
         * @see https://github.com/strapi/strapi/issues/22975
         */
        visible: true,
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
      uid: 'documentId',
    });
  }
};
