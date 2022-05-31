
'use strict';

const _ = require('lodash');

module.exports = async (strapi) => {
  // Register the path field.
  Object.values(strapi.contentTypes).forEach((contentType) => {
    const { attributes, pluginOptions } = contentType;

    // Not for CTs that are not visible in the content manager.
    const isInContentManager = _.get(pluginOptions, ['content-manager', 'visible']);
    if (isInContentManager === false) return;

    _.set(attributes, 'path', {
      writable: true,
      private: true,
      configurable: false,
      visible: false,
      default: null,
      type: 'string',
    });
  });
};
