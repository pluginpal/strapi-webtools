
'use strict';

import _ from 'lodash';
import { isContentTypeEnabled } from './utils/enabledContentTypes';
import autoGenerateMiddleware from './middlewares/auto-generate';

/**
 * Adds sitemap_exclude field to all the eligable content types.
 * @param {Strapi} strapi - The Strapi instance.
 *
 * @returns {void}
 */
const extendContentTypesWithExcludeField = async (strapi) => {
  Object.values(strapi.contentTypes).forEach((contentType) => {
    const hasWT = isContentTypeEnabled(contentType);

    if (!hasWT) return;

    const { attributes } = contentType;

    _.set(attributes, 'sitemap_exclude', {
      writable: true,
      private: true,
      configurable: false,
      visible: false,
      default: false,
      type: 'boolean',
    });
  });
};

export default ({ strapi }) => {
  strapi.documents.use(autoGenerateMiddleware);
  extendContentTypesWithExcludeField(strapi);
};
